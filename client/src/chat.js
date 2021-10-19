import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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

            socket.emit("NewChatMessage", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <>
            <h4> i am chat component</h4>
            <div>
                <div className="chatMessagesContainer" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((message, i) => (
                            <div className="chatMessage" key={i}>
                                <Link to={`/user/${message.user_id}`}>
                                    <img src={message.pic_url}></img>
                                </Link>
                                <h2>
                                    {message.first} {message.last}
                                </h2>
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
