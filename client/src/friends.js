// must export function component, because we want to use useDispatch and useSelector hooks.
// when mounts (useEffect) -> network request to get the list of friends/and wannabes (db.query) => once list arrives, dispatch action to add themto the global state (redux)
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { thingyfromslice } from "./redux/friends/slice.js";

export default function friends() {
    const dispatch = useDispatch();

    const friendsAndWannabes = useSelector(
        (state) => state.friendsAndWannabes && state.friendsAndWannabes
    );

    useEffect(function () {
        fetch("/friends")
            .then((res) => res.json())
            .then((friendsAndWannabes) => {
                dispatch(thingyfromslice(friendsAndWannabes));
            });
    }, []);

    return (
        <>
            <h1>friends</h1>
            {/* {friends.map()} */}

            <h1>Wannabes</h1>
            {/* {wannabes.map()} */}
        </>
    );
}
