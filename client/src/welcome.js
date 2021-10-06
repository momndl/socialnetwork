// function component
import { Registration } from "./registration.js";
import { Component } from "react";
import Logo from "./logo.js";
import { Login } from "./login.js";
import { BrowserRouter, Route } from "react-router-dom";

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
                </section>
            </BrowserRouter>
        );
    }
}
