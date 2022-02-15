import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function PrivateChat(props) {
    const elemRef = useRef();
    const imgRef = useRef();

    const privateMessages = useSelector(
        (state) =>
            state.privateChatMessages &&
            state.privateChatMessages.filter(
                (message) =>
                    message.recipient_id == props.otherUserId ||
                    message.sender_id == props.otherUserId
            )
    );

    useEffect(
        function () {
            console.log("privatechat mounted");
            elemRef.current.scrollTop =
                elemRef.current.scrollHeight - elemRef.current.clientHeight;
            // imgRef.current.style.color = "red";
        },
        [privateMessages]
    );

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const message = {
                message: e.target.value,
                recipient_id: props.otherUserId,
                socket_id: socket.id,
            };
            socket.emit("privateNewChatMessage", message);
            e.target.value = "";
        }
        // console.log((elemRef.style.color = "red"));
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
                                    <h2 ref={imgRef}>
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
