import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { FriendshipButton } from "./FriendshipButton";

export default function OtherProfile() {
    let isFriend = [];
    const friends = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter(
                (friends) => friends.accepted == true
            )
    );
    const [user, setUser] = useState({});
    const [error, setError] = useState({});

    const { otherUserId } = useParams();
    const history = useHistory();
    useEffect(() => {
        let abort = false;

        if (!abort) {
            fetch(`/user/${otherUserId}.json`)
                .then((res) => res.json())
                .then((otherProfile) => {
                    setUser(otherProfile);

                    if (otherProfile.ownProfile) {
                        history.push("/");
                    } else if (otherProfile.userNotFound) {
                        setError(otherProfile);
                    }
                })
                .catch(console.log);
        }
        return () => {
            console.log("cleanUp fn running");
            abort = true;
        };
    }, []);

    const chatHandler = () => {
        console.log("clicked");
    };

    if (friends) {
        isFriend = friends.filter((friend) => friend.id == user.id);
        console.log("isFriend", isFriend);
        if (isFriend.length == 0) {
            isFriend = null;
        }
    }
    return (
        <>
            {error.userNotFound && (
                <>
                    <h2> user not found </h2>
                    <Link to="/find-people">try again?</Link>
                </>
            )}
            <div className="otherProfile">
                <img src={user.pic_url} alt={user.first} />

                <p className="name">
                    {user.first} {user.last}
                </p>
                <p className="bio">{user.bio}</p>
                <FriendshipButton otherUserId={otherUserId} />
                {isFriend && (
                    <>
                        <Link to="/private-chat">private chat?</Link>
                    </>
                )}
            </div>
        </>
    );
}
