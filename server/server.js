const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

app.use(compression());

// setup cookie middleware!
app.use(express.json()); // we use this middleware to parse JSON requests coming in!

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", function (req, res) {
    console.log("client wants to know if the user is registered/logged in");
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
    /* 
    register our users:
        hash their password (remember to setup bcrypt!)
        and then insert all values submitted to the db -> need to setup our database 
        stuff check your petition project !!
        IF the user registers successfully let the client side know 
        IF sth goes wrong let the client side know
*/
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
