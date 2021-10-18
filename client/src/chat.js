import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { io } from "socket.io-client";
const socket = io.connect();

socket.on("greeting", (data) => {
    console.log("socket.on ->", data);
});

export default function Chat() {
    // const dispatch = useDispatch();

    // const myPendingRequests = useSelector(state => state.state)

    useEffect(function () {
        console.log("chat mounted");
        socket.on("greeting", (data) => {
            console.log("socket.on ->", data);
        });
    }, []);

    return (
        <>
            <h4> i am chat component</h4>
        </>
    );
}
