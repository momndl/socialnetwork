import { Component } from "react";
import ProfilePic from "./profilepic";
import { Uploader } from "./uploader.js";
import Logo from "./logo.js";
import Profile from "./profile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import FindPeople from "./findpeople";
import Header from "./header";
import OtherProfile from "./otherProfile.js";
import Friends from "./friends.js";
import Chat from "./chat.js";
import PrivateChat from "./privateChat";

// add a route that renders our new friends component

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
            });
    }
    updateBio(bio) {
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
            <BrowserRouter>
                <Header
                    imageUrl={this.state.userInfo.pic_url}
                    first={this.state.userInfo.first}
                    last={this.state.userInfo.last}
                    clickHandler={() =>
                        this.setState({ uploaderIsVisible: true })
                    }
                />
                <Route exact path="/">
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
                </Route>
                <Route path="/user/:otherUserId">
                    <OtherProfile />
                </Route>
                <Route path="/find-people">
                    <FindPeople />
                </Route>
                <Route path="/friends">
                    <Friends id={this.state.userInfo.id} />
                </Route>
                <Route path="/chat">
                    <Chat />
                </Route>
                <Route path="/private-chat">
                    <PrivateChat />
                </Route>
            </BrowserRouter>
        );
    }
}
