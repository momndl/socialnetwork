export default function ProfilePic({ imageUrl, first, last, clickHandler }) {
    imageUrl = imageUrl || "/assets/default.jpg";
    return (
        <>
            <p>
                {" "}
                profile pic component for {first} {last}
            </p>
            <img
                className="profileSmall"
                src={imageUrl}
                onClick={clickHandler}
            />
        </>
    );
}
