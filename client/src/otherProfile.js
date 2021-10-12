import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";

export default function OtherProfile() {
    const [user, setUser] = useState({});
    const params = useParams();
    const { otherUserId } = useParams();
    const history = useHistory();
    useEffect(() => {
        let abort = false;
        console.log("otherprofilerendered");
        console.log("params", params);
        fetch(`/user/:${otherUserId}.json`)
            .then((res) => res.json())
            .then((usersFound) => {
                console.log("data after fetch find people", usersFound);
                setUser(usersFound);
            })
            .catch(console.log); // {otherUserId: number}
        // we'll need to figure out which user profile we should show! so our  server should be given the
        // otherUserId from the url in the brwoser
        console.log("userid we want to see", otherUserId);
        if (!abort) {
            console.log("history", history);
            //if(otherUserId == ourId ) { history.push("/")}
            //we need to make fetch to get the users profilepic, first, last, bio
            // the data from server needs to be put in state
            // IF the user that we are requsting is ourselves, we want to render the profile component i.e. change the url to "/"
            // IF the user does not exist we want to send user to own profile or render a conditional error message
            // use setError to change this component state to true and in our return hav coditional render logic that renders 404 ouser not found or stuff like that
        }
        return () => {
            console.log("cleanup fn running");
            abort = true;
        };
    }, []);
    return (
        <div>
            <img src={user.pic_url} alt={user.first} />

            <p>
                {user.first} {user.last}
            </p>
            <p>{user.bio}</p>
        </div>
    );
}

// handle stuff like userinputs in url serverside
