const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

app.use(compression());

app.use(express.json()); // we use this middleware to parse JSON requests coming in!

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", function (req, res) {
    console.log("client wants to know if the user is registered/logged in");
    // res.json({
    //     userId: req.session.userId,
    // });
    // mocking the response as I have NOT set up
    // any cookie middleware
    //mocking no userId cookie:
    res.json({
        userId: undefined,
    });
    // mocking actual userId value
    // res.json({
    //     userId: 57,
    // });
});

app.post("/registration.json", (req, res) => {});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
