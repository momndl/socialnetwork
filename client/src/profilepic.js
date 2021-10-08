export default function ProfilePic({ imageUrl, first, last, clickHandler }) {
    imageUrl = imageUrl || "/assets/default.jpg";

    return (
        <>
            <img
                className="profileSmall"
                src={imageUrl}
                onClick={clickHandler}
            />
        </>
    );
}
