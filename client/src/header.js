import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./logo.js";
import ProfilePic from "./profilepic";

export default function Header(props) {
    useEffect(() => {
        console.log("props", props);
    }, []);
    const handleLogout = () => {
        console.log("hi");
        fetch("/logout")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    location.replace("/");
                }
            });
    };

    return (
        <header className="appHeader">
            <div className="headerLeft">
                <Link to="/">
                    <Logo />
                </Link>
            </div>
            <div className="headerRight">
                <Link to="/chat">chat</Link>
                <Link to="/friends">friends</Link>

                <Link to="/find-people">find people!</Link>

                <span onClick={() => handleLogout()}> logout </span>
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
