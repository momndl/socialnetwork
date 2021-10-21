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
import {
    privateChatMessagesReceived,
    privateChatMessageReceived,
} from "./redux/privateChat/slice";
export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("test123", (msg) => {
            console.log("incoming", msg);
        });

        socket.on("test1234", (msg) => {
            console.log("incominggggg", msg);
        });

        socket.on("users", (msg) => {
            console.log("usersss", msg);
        });

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
        });

        socket.on("addPrvChatMsg", (msg) => {
            store.dispatch(privateChatMessageReceived(msg));
            console.log("ingo:", msg);
        });

        socket.on("userDisconnected", (onlineUsers) => {
            store.dispatch(onlineUserDisconnect(onlineUsers.id));
            console.log("user left", onlineUsers);
        });
    }
};
