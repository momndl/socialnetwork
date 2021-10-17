// must export function component, because we want to use useDispatch and useSelector hooks.
// when mounts (useEffect) -> network request to get the list of friends/and wannabes (db.query) => once list arrives, dispatch action to add themto the global state (redux)
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    receiveFriends,
    acceptWannabe,
    removeFriend,
    removeRequest,
    receiveRequest,
} from "./redux/friends/slice.js";

export default function Friends() {
    const dispatch = useDispatch();

    const friends = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter(
                (friends) => friends.accepted == true
            )
    );

    const wannabes = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter(
                (friends) => friends.accepted == false
            )
    );

    const pendingRequests = useSelector(
        (state) => state.pendingRequests && state.pendingRequests
    );
    // const myPendingRequests = useSelector(state => state.state)

    useEffect(function () {
        fetch("/friends.json")
            .then((res) => res.json())
            .then((data) => {
                console.log("222", data);
                dispatch(receiveFriends(data.friendsAndWannabes));
                dispatch(receiveRequest(data.pendingRequests));
            });
    }, []);

    const handleWannabes = async (id) => {
        const data = await fetch(`/friends/update/${id}.json`, {
            method: "POST",
        }).then((res) => res.json());
        if (data.success) {
            dispatch(acceptWannabe(id));
        } else {
            return;
        }
    };

    const handleFriends = async (id) => {
        const data = await fetch(`/friends/remove/${id}.json`, {
            method: "POST",
        }).then((res) => res.json());
        if (data.success) {
            dispatch(removeFriend(id));
        } else {
            return;
        }
    };

    const handleRequests = async (id) => {
        const data = await fetch(`/friends/remove/${id}.json`, {
            method: "POST",
        }).then((res) => res.json());
        if (data.success) {
            dispatch(removeRequest(id));
        } else {
            return;
        }
    };

    return (
        <div id="friendsAndWannabes">
            {wannabes && (
                <>
                    <h3>{wannabes.length} new friend requests:</h3>
                    <div className="wannabes">
                        {wannabes &&
                            wannabes.map((wannabe, i) => (
                                <div
                                    className="wannabesAndFriendsContainer"
                                    key={i}
                                >
                                    <Link to={`/user/${wannabe.id}`}>
                                        <img src={wannabe.pic_url}></img>
                                    </Link>
                                    <h3>
                                        {wannabe.first} {wannabe.last}
                                    </h3>
                                    <button
                                        onClick={() =>
                                            handleWannabes(wannabe.id)
                                        }
                                    >
                                        accept friend request
                                    </button>
                                </div>
                            ))}
                    </div>
                </>
            )}

            {friends && (
                <>
                    <h3>view your friends:</h3>
                    <div className="friends">
                        {friends &&
                            friends.map((friend, i) => (
                                <div
                                    className="wannabesAndFriendsContainer"
                                    key={i}
                                >
                                    <Link to={`/user/${friend.id}`}>
                                        <img src={friend.pic_url}></img>
                                    </Link>
                                    <h3>
                                        {friend.first} {friend.last}
                                    </h3>
                                    <button
                                        onClick={() => handleFriends(friend.id)}
                                    >
                                        remove friend
                                    </button>
                                </div>
                            ))}
                    </div>
                </>
            )}

            {pendingRequests && (
                <>
                    <h3>{pendingRequests.length} pending friend requests:</h3>
                    <div className="pendingRequests">
                        {pendingRequests &&
                            pendingRequests.map((pending, i) => (
                                <div
                                    className="wannabesAndFriendsContainer"
                                    key={i}
                                >
                                    <Link to={`/user/${pending.id}`}>
                                        <img src={pending.pic_url}></img>
                                    </Link>
                                    <h3>
                                        {pending.first} {pending.last}
                                    </h3>
                                    <button
                                        onClick={() =>
                                            handleRequests(pending.id)
                                        }
                                    >
                                        cancel friend request
                                    </button>
                                </div>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}
