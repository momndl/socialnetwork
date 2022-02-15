// function component
import { Registration } from "./registration.js";
import { Component } from "react";
import Logo from "./logo.js";
import { Login } from "./login.js";
import { BrowserRouter, Route } from "react-router-dom";
import { Reset } from "./resetpassword";

export class Welcome extends Component {
    render() {
        return (
            <BrowserRouter>
                <section id="welcome">
                    <Route exact path="/">
                        <Logo />
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/passwordreset">
                        <Reset />
                    </Route>
                </section>
            </BrowserRouter>
        );
    }
}
