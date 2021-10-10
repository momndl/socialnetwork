import { Component } from "react";
import ProfilePic from "./profilepic";
import { Uploader } from "./uploader.js";
import Logo from "./logo.js";
import Profile from "./profile";

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: "",
        };
        this.updateImage = this.updateImage.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }
    componentDidMount() {
        fetch("/user.json")
            .then((res) => res.json())
            .then((data) => {
                this.setState(data);
                console.log("state check:", this.state.userInfo.bio); // check if success is really needed
            });
    }
    updateBio(bio) {
        console.log("hello from app, update Bio", bio.officialBio);

        this.setState((prevState) => {
            let userInfo = Object.assign({}, prevState.userInfo);
            userInfo.bio = bio.officialBio;
            return { userInfo };
        });

        // this.setState({ bio: bio });
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
                <header className="appHeader">
                    <Logo />

                    <ProfilePic
                        imageUrl={this.state.userInfo.pic_url}
                        first={this.state.userInfo.first}
                        last={this.state.userInfo.last}
                        clickHandler={() =>
                            this.setState({ uploaderIsVisible: true })
                        }
                    />
                </header>
                <Profile
                    bio={this.state.userInfo.bio}
                    imageUrl={this.state.userInfo.pic_url}
                    first={this.state.userInfo.first}
                    last={this.state.userInfo.last}
                    clickHandler={() =>
                        this.setState({ uploaderIsVisible: true })
                    }
                    updateBio={this.updateBio}
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
