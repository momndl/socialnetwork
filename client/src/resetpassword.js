import { Component } from "react";
import { Link } from "react-router-dom";

export class Reset extends Component {
    constructor() {
        super();
        this.state = {
            step: 1,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange({ target }) {
        console.log("someone is typing in an input field");

        this.setState(
            {
                [target.name]: target.value,
            },
            () => console.log("Registration state update:", this.state.email)
        );
    }
    handleReset(e) {
        e.preventDefault();

        fetch("/password/reset/start.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        }).then((resp) =>
            resp
                .json()
                .then((resp) => {
                    if (resp.success) {
                        this.setState({ step: resp.step });
                        //location.reload();
                    } else {
                        this.setState({
                            error: resp.error,
                        });
                    }
                })
                .catch((err) => {
                    console.log("err in POST /registration.json", err);
                    this.setState({
                        error: "Something went wrong",
                    });
                })
        );
    }
    handleStepTwo(e) {
        e.preventDefault();
        fetch("/password/reset/verify.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        }).then((resp) =>
            resp
                .json()
                .then((resp) => {
                    console.log("POST handle steptwo:", resp);
                    if (resp.success) {
                        this.setState({ step: resp.step });
                        //location.reload();
                    } else {
                        this.setState({
                            error: resp.error,
                        });
                    }
                })
                .catch((err) => {
                    console.log("err in POST /registration.json", err);
                    this.setState({
                        error: "Something went wrong",
                    });
                })
        );
    }
    render() {
        return (
            <div>
                {this.state.step == 1 && (
                    <>
                        <h2>Reset Password</h2>
                        {this.state.error && (
                            <h2 className="resetError"> {this.state.error}</h2>
                        )}
                        <h3>
                            Please enter your email address to reset your
                            password
                        </h3>
                        <form>
                            <input
                                type="email"
                                name="email"
                                placeholder="email"
                                onChange={this.handleChange}
                            ></input>
                            <button onClick={(e) => this.handleReset(e)}>
                                submit
                            </button>
                        </form>
                    </>
                )}
                {this.state.step == 2 && (
                    <>
                        <h2>Reset Password</h2>
                        {this.state.error && (
                            <h2 className="resetError"> {this.state.error}</h2>
                        )}
                        <form>
                            <h3>Please enter the code you received</h3>
                            <input
                                type="text"
                                name="code"
                                placeholder="code"
                                onChange={this.handleChange}
                            ></input>
                            <h3>Please enter a new password</h3>
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                onChange={this.handleChange}
                            ></input>
                            <button onClick={(e) => this.handleStepTwo(e)}>
                                submit
                            </button>
                        </form>
                    </>
                )}
                {this.state.step == 3 && (
                    <>
                        <h2>Reset Password</h2>
                        {this.state.error && (
                            <h2 className="resetError"> {this.state.error}</h2>
                        )}

                        <h3>Success</h3>

                        <h3>
                            you can now <Link to="/login">login</Link> with your
                            new password
                        </h3>
                    </>
                )}
            </div>
        );
    }
}

// this could be a way to render
