import { Component } from "react";
import ProfilePic from "./profilepic";
import { Uploader } from "./uploader.js";
import Logo from "./logo.js";

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.updateImage = this.updateImage.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    componentDidMount() {
        fetch("/user.json")
            .then((res) => res.json())
            .then((data) => {
                this.setState(data);
                console.log("state check:", this.state); // check if success is really needed
            });
    }
    updateImage(url) {
        this.setState((prevState) => {
            let userInfo = Object.assign({}, prevState.userInfo);
            userInfo.pic_url = url;
            return { userInfo };
        });
        this.setState({ uploaderIsVisible: false });
    }
    closeModal() {
        this.setState({ uploaderIsVisible: false });
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
                    imageUrl={this.state.userInfo.pic_url}
                    first={this.state.userInfo.first}
                    last={this.state.userInfo.last}
                    clickHandler={() =>
                        this.setState({ uploaderIsVisible: true })
                    }
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        closeModal={this.closeModal}
                        updateImage={this.updateImage}
                    />
                )}
            </>
        );
    }
}
