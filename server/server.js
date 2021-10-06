const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { hash, compare } = require("../bc.js");
const cookieSession = require("cookie-session");
const db = require("../db.js");
const cryptoRandomString = require("crypto-random-string");
const ses = require("../server/ses.js");

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

app.get("/user/id.json", function (req, res) {
    // console.log("client wants to know if the user is registered/logged in");
    // console.log("user-id", req.session.userId);
    res.json({
        userId: req.session.userId,
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
                    db.updatePassword(hashedPW, email).then((data) => {
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
                    .then((resp) => {
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
    res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
