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
        });

        socket.on("addChatMsg", (msg) => {
            store.dispatch(chatMessageReceived(msg));
        });
    }
};
