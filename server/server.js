const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { hash, compare } = require("../bc.js");
const cookieSession = require("cookie-session");
const db = require("../db.js");

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
    console.log("client wants to know if the user is registered/logged in");
    console.log("user-id", req.session.userId);
    res.json({
        userId: req.session.userId,
    });
    // CODE BELOW IS NOT NEEDED THAT WAS TO DEMO THE BEHAVIOR IN CLASS
    // mocking the response as I have NOT set up
    // any cookie middleware
    //mocking no userId cookie:
    // res.json({
    //     userId: undefined,
    // });
    // mocking actual userId value
    // res.json({
    //     userId: 57,
    // });
});

app.post("/registration.json", (req, res) => {
    const { first, last, email, password } = req.body;
    console.log("first", first);
    console.log("last", last);
    console.log("email", email);
    console.log("password", password);

    if (password && first && last && email) {
        hash(password).then((hashedPW) => {
            db.addUser(first, last, email, hashedPW)
                .then((id) => {
                    req.session.userId = id.rows[0].id;
                    res.json({ success: true, userId: id.rows[0].id });
                })
                .catch((error) => {
                    console.log("error in post reg", error);
                    res.json({ success: false });
                });

            /* 
    register our users:
        hash their password (remem ber to setup bcrypt!)
        and then insert all values submitted to the db -> need to setup our database 
        stuff check your petit ion project !!
        IF the user registers successfully let the client side know 
        IF sth goes wrong let the client side know
*/
        });
    } else {
        console.log("error nicht alles ausgefuellt");
        res.json({ success: false });
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
