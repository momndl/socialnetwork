// class component
import { Component } from "react";

export class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
            userId: 0,
        };
        this.handleChange = this.handleChange.bind(this);
        // we can ommit the binding of this to our method when we use a function
        // expression in our clickhandler like so "onClick={(e)=>this.methodToRun()}"
        // this.handleRegister = this.handleRegister.bind(this);
    }
    componentDidMount() {
        console.log("Registration just mounted");
    }
    handleChange({ target }) {
        console.log("someone is typing in an input field");
        // console.log("target.name", target.name);
        // console.log("target.value", target.value);
        // add these values to the component's state
        this.setState(
            {
                [target.name]: target.value,
            },
            () => console.log("Registration state update:", this.state)
        );
    }
    handleRegister(e) {
        e.preventDefault(); // to prevent the refresh that would happen otherwise
        console.log("you clicked on the button");
        console.log("this.state", this.state);
        // now we'll want to make a fetch to register our user
        fetch("/registration.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        }).then((resp) =>
            resp
                .json()
                .then((resp) => {
                    console.log("POST /registrations.json:", resp);
                    if (resp.success) {
                        console.log("hat geklappt frau schwarz");
                        this.setState({ userId: resp.userId });
                        location.reload();
                        // console.log("check id", this.state);
                    } else {
                        console.log("hat nicht geklappt, sad face");
                        this.setState({
                            error: "Something went wrong with registration",
                        });
                    }
                    // depending on whether or not our user successfully registered we now want to do either:
                    // a: user successfully registered, the should be send to the logged in experience, in this
                    // case we want to rerun our fetch from start.js
                    // and we can trigger that with the help of location.reload()
                    // b: sth went wrong we want to have our registration component
                    // to render with an error message
                })
                .catch((err) => {
                    console.log("err in POST /registration.json", err);
                    this.setState({
                        error: "Something went wrong with registration",
                    });
                    // update the error property in state!
                })
        );
    }
    render() {
        return (
            <section>
                <h1>Registration</h1>
                {this.state.error && (
                    <h2 className="regError"> {this.state.error}</h2>
                )}
                <form className="regForm">
                    <input
                        type="text"
                        name="first"
                        placeholder="first name"
                        onChange={this.handleChange}
                    ></input>
                    <input
                        type="text"
                        name="last"
                        placeholder="last name"
                        onChange={this.handleChange}
                    ></input>
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
                    <button onClick={(e) => this.handleRegister(e)}>
                        register
                    </button>
                </form>
            </section>
        );
    }
}
