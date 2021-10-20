import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OnlineUsers from "./onlineUsersInChat.js";

export default function PrivateChat() {
    const elemRef = useRef();

    const privateMessages = useSelector(
        (state) => state.privateChatMessages && state.privateChatMessages
    );

    useEffect(
        function () {
            console.log("privatechat");
            elemRef.current.scrollTop =
                elemRef.current.scrollHeight - elemRef.current.clientHeight;
        },
        [privateMessages]
    );

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            // socket.emit("NewChatMessage", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <>
            <div className="chatMessagesContainer" ref={elemRef}>
                {privateMessages &&
                    privateMessages.map((message, i) => (
                        <div className="chatMessage" key={i}>
                            <div className="chatUser">
                                <Link to={`/user/${message.id}`}>
                                    <img src={message.pic_url}></img>
                                </Link>
                                <Link to={`/user/${message.id}`}>
                                    <h2>
                                        {message.first} {message.last}
                                    </h2>
                                </Link>
                                <span>{message.posted}</span>
                            </div>
                            <p>{message.message}</p>
                        </div>
                    ))}
            </div>
            <textarea
                placeholder="add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </>
    );
}
