import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OnlineUsers from "./onlineUsersInChat.js";

export default function Chat() {
    const elemRef = useRef();

    const chatMessages = useSelector(
        (state) => state.chatMessages && state.chatMessages
    );

    useEffect(
        function () {
            elemRef.current.scrollTop =
                elemRef.current.scrollHeight - elemRef.current.clientHeight;
        },
        [chatMessages]
    );

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // hier neue emitter, für privat chat message
            //socket.emit("NewChatMessage", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <>
            <div>
                <OnlineUsers />
            </div>
            <div>
                <div className="chatMessagesContainer" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((message, i) => (
                            <div className="chatMessage" key={i}>
                                <div className="chatUser">
                                    <Link to={`/user/${message.user_id}`}>
                                        <img src={message.pic_url}></img>
                                    </Link>
                                    <Link to={`/user/${message.user_id}`}>
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
            </div>

            <textarea
                placeholder="add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </>
    );
}
