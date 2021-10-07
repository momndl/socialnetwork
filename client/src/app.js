import { Component } from "react";
import ProfilePic from "./profilepic";
import { Uploader } from "./uploader.js";
import Logo from "./logo.js";

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        //this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        fetch("/user.json")
            .then((res) => res.json())
            .then((data) => {
                this.setState(data);
                console.log("state check:", this.state.userInfo.id); // check if success is really needed
            });
    }
    render() {
        if (!this.state.userInfo) {
            return (
                <>
                    <h1> LOADING...</h1>
                </>
            );
        }
        return (
            <>
                <Logo />

                <ProfilePic
                    imageUrl={this.state.userInfo.imageUrl}
                    first={this.state.userInfo.first}
                    last={this.state.userInfo.last}
                    clickHandler={() =>
                        this.setState({ uploaderIsVisible: true })
                    }
                />
                {this.state.uploaderIsVisible && <Uploader />}
            </>
        );
    }
}
