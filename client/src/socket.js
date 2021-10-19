import { io } from "socket.io-client";
import {
    chatMessagesReceived,
    chatMessageReceived,
} from "./redux/messages/slice.js";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("latestChatMessages", (msgs) => {
            store.dispatch(chatMessagesReceived(msgs));
            console.log("chatti chat", msgs);
        });

        // socket.on("chatMessage", (msg) =>
        //     store.dispatch(chatMessageReceived(msg))
        // );

        socket.on("addChatMsg", (msg) => {
            console.log(
                "got a message in the client!! about to start redux process by dispatching in here",
                msg
            );
            store.dispatch(chatMessageReceived(msg));
        });
    }
};
