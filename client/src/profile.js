import ProfilePic from "./profilepic";

export default function Profile(props) {
    console.log("props in profile: ", props);
    return (
        <div className="profileContainer">
            <h2>
                {props.first} {props.last}
            </h2>
            <ProfilePic
                first={props.first}
                last={props.last}
                imageUrl={props.imageUrl}
            />
        </div>
    );
}
