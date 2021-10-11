import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./logo.js";
import ProfilePic from "./profilepic";

export default function Header(props) {
    useEffect(() => {
        console.log("props", props);
    }, []);
    return (
        <header className="appHeader">
            <div className="headerLeft">
                <Link to="/">
                    <Logo />
                </Link>
            </div>
            <div className="headerRight">
                <Link to="/find-people">find people!</Link>
                <ProfilePic
                    imageUrl={props.imageUrl}
                    first={props.first}
                    last={props.last}
                    clickHandler={props.clickHandler}
                />
            </div>
        </header>
    );
}
