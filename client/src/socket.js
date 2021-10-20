import { io } from "socket.io-client";
import {
    chatMessagesReceived,
    chatMessageReceived,
} from "./redux/messages/slice.js";
import {
    receiveOnlineUsers,
    onlineUserDisconnect,
} from "./redux/onlineUsers/slice";
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

        socket.on("onlineUsers", (onlineUsers) => {
            store.dispatch(receiveOnlineUsers(onlineUsers));
            // console.log("onlineUsers: ", onlineUsers);
        });

        socket.on("userDisconnected", (onlineUsers) => {
            console.log("titikaka", onlineUsers);
            store.dispatch(onlineUserDisconnect(onlineUsers.id));
        });
    }
};
