import { useState, useEffect } from "react";

export function FriendshipButton(props) {
    const [buttonText, setButtonText] = useState();
    const { otherUserId } = props;

    useEffect(() => {
        console.log("friendshipbutton mounted! next fetch get dynamic rout");
        console.log("props", otherUserId);
        fetch(`/relation/${otherUserId}.json`)
            .then((res) => res.json())
            .then((response) => {
                console.log("response for mo", response);
            })
            .catch(console.log);
        setButtonText("to change me, setButtonText");
        //fetch("/relation/id.json");
    }, []);
    const clickHandler = () => {
        console.log("button has been clicked");
    };
    // needs to be passed the id of the user whose prifle the btn appers on
    // as we need to go ask our sever wheter we the user is in wants to befriend/cancel/end friendshio
    //in useeffect we will make a fetch request to the server to find out the relationship status
    // depending on the servers response well set the btn textr value
    //on btn click we want to pdate the relationship between our usersers
    // so well need to run a fetsch POST communication to the server to update the relationship between user loggen in; and user whose prifle the btn is on
    // as a result when the DB is updatedm the btn text should reflect this new status by changin its text
    return (
        <>
            <button className="friendshipBtn" onClick={clickHandler}>
                {buttonText}
            </button>
        </>
    );
}
