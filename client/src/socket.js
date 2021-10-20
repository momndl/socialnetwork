import { io } from "socket.io-client";
import {
    chatMessagesReceived,
    chatMessageReceived,
} from "./redux/messages/slice.js";
import {
    receiveOnlineUsers,
    onlineUserDisconnect,
} from "./redux/onlineUsers/slice";
import { receiveFriends } from "./redux/friends/slice.js";
import { privateChatMessagesReceived } from "./redux/privateChat/slice";
export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("latestChatMessages", (msgs) => {
            store.dispatch(chatMessagesReceived(msgs));
        });

        socket.on("FriendsAndWannabes", (users) => {
            store.dispatch(receiveFriends(users));
        });

        socket.on("addChatMsg", (msg) => {
            store.dispatch(chatMessageReceived(msg));
        });

        socket.on("onlineUsers", (onlineUsers) => {
            store.dispatch(receiveOnlineUsers(onlineUsers));
            // console.log("onlineUsers: ", onlineUsers);
        });

        socket.on("latestPrivateChats", (msgs) => {
            store.dispatch(privateChatMessagesReceived(msgs));
            console.log("privat:", msgs);
        });

        socket.on("userDisconnected", (onlineUsers) => {
            console.log("titikaka", onlineUsers);
            store.dispatch(onlineUserDisconnect(onlineUsers.id));
        });
    }
};
