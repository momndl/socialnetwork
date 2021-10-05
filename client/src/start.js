import ReactDOM from "react-dom";
import Welcome from "./welcome.js";
import Logo from "./logo.js";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            // this means our user is not registered/logged in, we should see Welcome component
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            // this means our user IS registered/logged in!
            ReactDOM.render(<Logo />, document.querySelector("main"));
        }
    });
