const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { hash, compare } = require("../bc.js");
const cookieSession = require("cookie-session");
const db = require("../db.js");
const cryptoRandomString = require("crypto-random-string");
const ses = require("../server/ses.js");
const { uploader } = require("./upload");
const s3 = require("./s3");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

app.use(compression());

app.use(express.json());

let secrets;
process.env.NODE_ENV === "production"
    ? (secrets = process.env)
    : (secrets = require("../secrets.json"));

const cookieSessionMiddleware = cookieSession({
    secret: `${secrets.cookieSecret}`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
    sameSite: true,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.post("/upload", uploader.single("file"), s3.uploadS3, (req, res) => {
    if (req.file) {
        const { filename } = req.file;
        const url = "https://s3.amazonaws.com/spicedling/" + filename;
        db.updatePicUrl(url, req.session.userId)
            .then(() => {
                res.json({ url: url });
            })
            .catch((error) =>
                console.log("error in post /upload updatePicUrl", error)
            );
    } else {
        res.json({ success: false });
    }
});

app.get("/find-people.json", (req, res) => {
    db.findPeople()
        .then((data) => {
            res.json(data.rows);
        })
        .catch((error) => console.log("error in /find-people", error));
});

app.post("/find-more-people.json", (req, res) => {
    const { find } = req.body;
    const values = find.split(" ");

    // do something async here to get lastnames!================================
    db.getMatchingUsersFirst(find)
        .then((data) => {
            // matches.push(data.rows);
            // console.log("return data in server", matches[0]);
            //res.json(matches[0]);
            res.json(data.rows);

            //     if (values[1]) {
            //         console.log("IF!");
            //         return db.getMatchingUsersLast(values[1]);
            //     } else {
            //         console.log("ELSE!");

            //         return;
            //     }
            // })
            // .then((matchingLastnames) => {
            //     //console.log("matchinglastnames", matchingLastnames);
            //     matches.push(matchingLastnames);
            //     console.log("mathce s", matches);
            //     res.json(matches[0]);
        })
        .catch((error) => console.log("error in /find-more-people", error));
});

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.post("/user/updatebio.json", (req, res) => {
    const { bio } = req.body;

    db.updateBio(bio, req.session.userId).then((data) => {
        res.json({ officialBio: data.rows[0].bio });
    });
});

app.get("/user.json", (req, res) => {
    db.getUser(req.session.userId)
        .then((data) => {
            return data.rows[0];
        })
        .then((userInfo) => {
            res.json({ userInfo });
        })
        .catch((error) => {
            res.json({ success: false }); // add error message =====================================================================
            console.log("error in get /user.json db.getUser:", error);
        });
});

app.post("/password/reset/verify.json", (req, res) => {
    const { email, code, password } = req.body;

    db.getResetCode(email)
        .then((data) => {
            if (data.rows[0].code == code) {
                hash(password).then((hashedPW) => {
                    db.updatePassword(hashedPW, email).then(() => {
                        res.json({ success: true, step: 3 });
                    });
                });
            } else {
                res.json({
                    succes: false,
                    error: "wrong code, please try again",
                });
            }
        })
        .catch((error) =>
            console.log(
                "error in /password/reset/verify.json getResetCode",
                error
            )
        );
});

app.post("/password/reset/start.json", (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({
            success: false,
            error: "please enter your email",
        });
    }

    const myEmail = email.split("@");

    const secretCode = cryptoRandomString({
        length: 6,
    });

    const address = `vivacious.camp+${myEmail[0]}@spicedling.email`;
    const subject = "password reset";
    const text = `hey friend, use this code ${secretCode} to reset your email`;

    db.regCheck(email)
        .then((data) => {
            if (data.rows[0]) {
                ses.sendEmail(address, subject, text);
                db.addResetCode(email, secretCode)
                    .then(() => {
                        res.json({ success: true, step: 2 });
                    })
                    .catch((error) => {
                        console.log(
                            "error in post /password/reset/start.json addResetCode",
                            error
                        );
                    });
            } else {
                res.json({
                    success: false,
                    error: "this email is not registered",
                });
            }
        })
        .catch((error) => {
            console.log(
                "error in post /password/reset/start.json regCheck",
                error
            );
        });
});

app.post("/login.json", (req, res) => {
    const { email, password } = req.body;

    db.regCheck(email)
        .then((data) => {
            if (data.rows[0]) {
                compare(password, data.rows[0].password).then(
                    (passwordMatch) => {
                        if (passwordMatch) {
                            req.session.userId = data.rows[0].id;
                            res.json({
                                success: true,
                                userId: data.rows[0].id,
                            });
                        } else {
                            res.json({
                                success: false,
                                error: "invalid email or password :(",
                            });
                        }
                    }
                );
            } else {
                res.json({
                    success: false,
                    error: "invalid email or password :(",
                });
            }
        })
        .catch((error) =>
            console.log("error in post /login.json with db.regCheck", error)
        );
});

app.post("/registration.json", (req, res) => {
    const { first, last, email, password } = req.body;

    // make this async=====================================================
    if (password && first && last && email) {
        db.regCheck(email)
            .then((data) => {
                if (!data.rows[0]) {
                    hash(password).then((hashedPW) => {
                        db.addUser(first, last, email, hashedPW)
                            .then((id) => {
                                req.session.userId = id.rows[0].id;
                                res.json({
                                    success: true,
                                    userId: id.rows[0].id,
                                });
                            })
                            .catch((error) => {
                                console.log("error in post reg", error);
                                res.json({
                                    success: false,
                                    error: "error :( please try again",
                                });
                            });
                    });
                } else {
                    res.json({
                        success: false,
                        error: "email already in use",
                    });
                }
            })
            .catch((error) =>
                console.log(
                    "error in post /registration.json with db.regCheck",
                    error
                )
            );
    } else {
        res.json({
            success: false,
            error: "please fill out all input fields",
        });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.json({ success: true });
});

app.post("/update/status.json", (req, res) => {
    const { buttonText, otherUserId: viewedProfile } = req.body;
    const loggedInUser = req.session.userId;

    if (buttonText == "Send Friend Request") {
        db.setFriendRequest(loggedInUser, viewedProfile)
            .then(() => {
                res.json({ buttonText: "Cancel Friend Request" });
            })
            .catch(console.log);
    } else if (
        buttonText == "Cancel Friend Request" ||
        buttonText == "Unfriend"
    ) {
        db.deleteFriendRequest(loggedInUser, viewedProfile)
            .then(() => {
                res.json({ buttonText: "Send Friend Request" });
            })
            .catch(console.log);
    } else if (buttonText == "Accept Friend Request") {
        db.updateFriendRequest(loggedInUser, viewedProfile)
            .then(() => {
                res.json({ buttonText: "Unfriend" });
            })
            .catch(console.log);
    }
});

app.post("/friends/update/:id.json", (req, res) => {
    const { id: viewedProfile } = req.params;
    const loggedInUser = req.session.userId;

    db.updateFriendRequest(loggedInUser, viewedProfile)
        .then(() => {
            res.json({ success: true });
        })
        .catch(console.log);
});

app.post("/friends/remove/:id.json", (req, res) => {
    const { id: viewedProfile } = req.params;
    const loggedInUser = req.session.userId;

    db.deleteFriendRequest(loggedInUser, viewedProfile)
        .then(() => {
            res.json({ success: true });
        })
        .catch(console.log);
});

app.get("/relation/:id.json", (req, res) => {
    const { id: viewedProfile } = req.params;
    const loggedInUser = req.session.userId;
    db.checkFriendship(loggedInUser, viewedProfile)
        .then((data) => {
            if (data.rowCount == 0) {
                console.log("no friends");
                res.json({ buttonText: "Send Friend Request" });
            } else if (
                !data.rows[0].accepted &&
                data.rows[0].recipient_id == loggedInUser
            ) {
                res.json({ buttonText: "Accept Friend Request" });
            } else if (
                !data.rows[0].accepted &&
                data.rows[0].recipient_id == viewedProfile
            ) {
                res.json({ buttonText: "Cancel Friend Request" });
            } else if (data.rows[0].accepted) {
                res.json({ buttonText: "Unfriend" });
            } else {
                res.json({ buttonText: "ingo" });
            }
        })
        .catch(console.log);
});

app.get("/user/:id.json", (req, res) => {
    const { id } = req.params;
    console.log("this i want to see");

    if (id == req.session.userId) {
        res.json({ ownProfile: true });
    } else {
        db.getUser(id)
            .then((data) => {
                if (typeof data.rows[0] == "undefined") {
                    res.json({ userNotFound: true });
                } else {
                    res.json(data.rows[0]);
                }
            })
            .catch((error) => {
                console.log("error in getUser at  /user/:id.json", error);
                res.json({ userNotFound: true });
            });
    }
});

app.get("/friends.json", (req, res) => {
    const loggedInUser = req.session.userId;

    db.getFriendsAndWannabes(loggedInUser)
        .then((data) => {
            res.json(data.rows);
        })
        .catch(console.log);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
const newOnlineUsers = {};
const onlineUsers = {};
io.on("connection", (socket) => {
    // const users = [];
    // for (let [id] of io.of("/").sockets) {
    //     users.push({
    //         userID: id,
    //         username: "ingo",
    //     });
    //     console.log("users", users);
    // }
    // socket.emit("users", users);

    const userId = socket.request.session.userId;
    console.log("onlineUsers", onlineUsers);
    console.log("mySocket", socket.id);
    if (!userId) {
        return socket.disconnect(true);
    }
    onlineUsers[socket.id] = userId;
    newOnlineUsers[userId] = socket.id;

    const onlineUsersArray = [...new Set(Object.values(onlineUsers))];
    console.log(onlineUsersArray);

    db.getLatestChatMessages()
        .then((res) => {
            socket.emit("latestChatMessages", res.rows.reverse());
        })
        .catch(console.log);

    db.getLatestPrivateMessages(userId)
        .then((res) => {
            socket.emit("latestPrivateChats", res.rows);
        })
        .catch(console.log);

    db.getOnlineUsers(onlineUsersArray)
        .then((res) => {
            // console.log("onlineusersArray", res);
            io.emit("onlineUsers", res.rows);
        })
        .catch(console.log);

    db.getFriendsAndWannabes(userId)
        .then((data) => {
            socket.emit("FriendsAndWannabes", data.rows);
        })
        .catch(console.log);

    socket.on("NewChatMessage", (newMsg) => {
        if (newMsg == "") {
            return;
        }
        // make this try and catch
        async function handleMessage(newMsg, userId) {
            const messages = await db.addChatMessage(userId, newMsg);
            const userInfo = await db.getUser(userId);
            const { id: msgId, message, posted } = messages.rows[0];
            const { id, first, last, pic_url } = userInfo.rows[0];

            const newMessage = {
                id: msgId,
                user_id: id,
                message: message,
                posted: posted,
                first: first,
                last: last,
                pic_url: pic_url,
            };

            return io.emit("addChatMsg", newMessage);
        }

        handleMessage(newMsg, userId);
    });

    socket.on("privateNewChatMessage", (newPrvMsg) => {
        if (newPrvMsg == "") {
            return;
        }

        const { message, recipient_id, socket_id: friendSocket } = newPrvMsg;
        console.log("message", message);
        console.log("omg digga", friendSocket);

        // make this try and catch
        async function handleMessage(newPrvMsg, userId) {
            const messages = await db.addPrvChatMessage(
                userId,
                recipient_id,
                newPrvMsg
            );
            const userInfo = await db.getUser(userId);
            const { id: msgId, message, posted } = messages.rows[0];
            const { id, first, last, pic_url } = userInfo.rows[0];

            const newMessage = {
                id: msgId,
                sender_id: id,
                recipient_id: recipient_id,
                message: message,
                posted: posted,
                first: first,
                last: last,
                pic_url: pic_url,
            };

            io.to(newOnlineUsers[recipient_id]).emit(
                "addPrvChatMsg",
                newMessage
            );
            socket.emit("addPrvChatMsg", newMessage);
        }

        handleMessage(message, userId);
    });

    // HIER GEHTS GLEICH WEITER MIT ONLINE USERS! ====

    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];

        io.emit("userDisconnected", { id: userId });
    });
});
