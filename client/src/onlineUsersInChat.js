import { useEffect } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function OnlineUsers() {
    // const elemRef = useRef();

    const onlineUsers = useSelector(
        (state) => state.onlineUsers && state.onlineUsers
    );

    useEffect(
        function () {
            console.log("onlineUsersComponentMounted");
            console.log("onlineUsers:", onlineUsers);
        },
        [onlineUsers]
    );

    return (
        <>
            <div className="onlineUsersContainer">
                {onlineUsers &&
                    onlineUsers.map((user, i) => (
                        <div className="onlineUser" key={i}>
                            <Link to={`/user/${user.id}`}>
                                <img src={user.pic_url}></img>
                            </Link>

                            <p>
                                {user.first} {user.last}
                            </p>
                        </div>
                    ))}
            </div>
        </>
    );
}
