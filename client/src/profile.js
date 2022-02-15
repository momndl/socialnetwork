import ProfilePic from "./profilepic";
import BioEditor from "./bioEditor";

export default function Profile(props) {
    // console.log("props in profile: ", props);
    return (
        <div className="profileContainer">
            <div className="myProfile">
                <h2>
                    {props.first} {props.last}
                </h2>
                <ProfilePic
                    first={props.first}
                    last={props.last}
                    imageUrl={props.imageUrl}
                />
            </div>
            <div className="myProfileBio">
                <BioEditor bio={props.bio} updateBio={props.updateBio} />
            </div>
        </div>
    );
}
