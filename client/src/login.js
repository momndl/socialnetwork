import { Component } from "react";
import { Link } from "react-router-dom";

export class Login extends Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange({ target }) {
        console.log("someone is typing in an input field");

        this.setState(
            {
                [target.name]: target.value,
            },
            () => console.log("Registration state update:", this.state)
        );
    }
    handleLogin(e) {
        e.preventDefault();
        console.log("you clicked on the button");
        console.log("this.state", this.state);

        fetch("/login.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        }).then((resp) =>
            resp
                .json()
                .then((resp) => {
                    console.log("POST /login.json:", resp);
                    if (resp.success) {
                        location.reload();
                    } else {
                        this.setState({
                            error: resp.error,
                        });
                    }
                })
                .catch((err) => {
                    console.log("err in POST /registration.json", err);
                    this.setState({
                        error: "Something went wrong with registration",
                    });
                })
        );
    }
    render() {
        return (
            <section id="login">
                {this.state.error && (
                    <h2 className="regError"> {this.state.error}</h2>
                )}
                <form>
                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        onChange={this.handleChange}
                    ></input>
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={this.handleChange}
                    ></input>
                    <button onClick={(e) => this.handleLogin(e)}>login</button>
                </form>
                <Link to="/">Not registered? Go here!</Link>
            </section>
        );
    }
}
