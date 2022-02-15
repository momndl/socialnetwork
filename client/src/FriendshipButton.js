import { useState, useEffect } from "react";

export function FriendshipButton(props) {
    const [buttonText, setButtonText] = useState();
    const { otherUserId } = props;

    useEffect(() => {
        let abort = false;
        if (!abort) {
            fetch(`/relation/${otherUserId}.json`)
                .then((res) => res.json())
                .then((response) => {
                    setButtonText(response.buttonText);
                })
                .catch(console.log);
        }
        return () => {
            console.log("cleanUp fn running");
            abort = true;
        };
    }, []);
    const clickHandler = () => {
        fetch("/update/status.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buttonText: buttonText,
                otherUserId: otherUserId,
            }),
        })
            .then((res) => res.json())
            .then((response) => {
                setButtonText(response.buttonText);
            })
            .catch(console.log);
    };

    return (
        <>
            <button className="friendshipBtn" onClick={clickHandler}>
                {buttonText}
            </button>
        </>
    );
}
