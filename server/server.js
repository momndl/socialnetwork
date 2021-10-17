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

app.use(compression());

// setup cookie middleware!
app.use(express.json()); // we use this middleware to parse JSON requests coming in!

let secrets;
process.env.NODE_ENV === "production"
    ? (secrets = process.env)
    : (secrets = require("../secrets.json"));

app.use(
    cookieSession({
        secret: `${secrets.cookieSecret}`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.post("/upload", uploader.single("file"), s3.uploadS3, (req, res) => {
    // console.log("req.body", req.body);
    console.log("req.file", req.file);
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
    console.log("next make a db query att /findpeople");
    db.findPeople()
        .then((data) => {
            console.log("return data in server find three", data);
            res.json(data.rows);
        })
        .catch((error) => console.log("error in /find-people", error));
});

app.post("/find-more-people.json", (req, res) => {
    const { find } = req.body;
    const values = find.split(" ");
    console.log("find in server", values.length);
    let matches = [];

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

// app.post("/test.json", (req, res) => {
//     console.log("irgendwas angegkommen in test");
//     const body = req.body;
//     console.log("body in test", body);
//     res.json(body);
// });

app.get("/user/id.json", function (req, res) {
    console.log("client wants to know if the user is registered/logged in");
    console.log("user-id", req.session.userId);
    res.json({
        userId: req.session.userId,
    });
});

app.post("/user/updatebio.json", (req, res) => {
    const { draftBio } = req.body;
    console.log("draftBio", draftBio);
    db.updateBio(draftBio, req.session.userId).then((data) => {
        console.log("data from d b", data);
        res.json({ officialBio: data.rows[0].bio });
    });
    // res.json(req.body);
});

app.get("/user.json", (req, res) => {
    console.log("i dont want this");
    db.getUser(req.session.userId)
        .then((data) => {
            return data.rows[0];
        })
        .then((userInfo) => {
            // console.log("haaalloo", userInfo);
            res.json({ userInfo });
        })
        .catch((error) => {
            res.json({ success: false }); // add error message =====================================================================
            console.log("error in get /user.json db.getUser:", error);
        });
});

app.post("/password/reset/verify.json", (req, res) => {
    const { email, code, password } = req.body;
    console.log(email);

    db.getResetCode(email)
        .then((data) => {
            console.log("code results", data);
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
                console.log("juhu", address);
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
                // render error message, email or password unknown }
            }
        })
        .catch((error) =>
            console.log("error in post /login.json with db.regCheck", error)
        );
});

app.post("/registration.json", (req, res) => {
    const { first, last, email, password } = req.body;
    console.log("first", first);
    console.log("last", last);
    console.log("email", email);
    console.log("password", password);

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
    console.log("post has been madem to update/status.json");
    const { buttonText, otherUserId: viewedProfile } = req.body;
    const loggedInUser = req.session.userId;
    //console.log("buttonText:", buttonText, " other user id:", otherUserId);
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
        // database deletion
        db.deleteFriendRequest(loggedInUser, viewedProfile)
            .then(() => {
                res.json({ buttonText: "Send Friend Request" });
            })
            .catch(console.log);
    } else if (buttonText == "Accept Friend Request") {
        // database query, accepted truea
        db.updateFriendRequest(loggedInUser, viewedProfile)
            .then(() => {
                res.json({ buttonText: "Unfriend" });
            })
            .catch(console.log);
    }
});

app.post("/friends/update/:id.json", (req, res) => {
    console.log("post to update friends has been made");
    const { id: viewedProfile } = req.params;
    const loggedInUser = req.session.userId;
    console.log(
        "viewedProfile: ",
        viewedProfile,
        " loggedInUser: ",
        loggedInUser
    );
    db.updateFriendRequest(loggedInUser, viewedProfile)
        .then(() => {
            res.json({ success: true });
        })
        .catch(console.log);
});

app.post("/friends/remove/:id.json", (req, res) => {
    console.log("post to remove friends has been made");
    const { id: viewedProfile } = req.params;
    const loggedInUser = req.session.userId;
    console.log(
        "viewedProfile: ",
        viewedProfile,
        " loggedInUser: ",
        loggedInUser
    );
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
            // console.log("checkFriendship data", data);
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

    //  console.log("fetch has been made", id, " test ",// profileId);
    //res.json("ingo");
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
    // console.log("fetch made to friends!");
    db.getFriendsAndWannabes(loggedInUser).then((data) => {
        const friendsAndWannabes = {
            friendsAndWannabes: data.rows.filter(
                (pending) => pending.sender_id != loggedInUser
            ),
            pendingRequests: data.rows.filter(
                (pending) => pending.sender_id == loggedInUser
            ),
        };

        res.json(friendsAndWannabes);
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
