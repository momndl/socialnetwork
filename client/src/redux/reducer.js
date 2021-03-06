import { combineReducers } from "redux";
import { friendsReducer } from "./friends/slice.js";
import { chatMessagesReducer } from "./messages/slice.js";
import { onlineUsersReducer } from "./onlineUsers/slice.js";
import { privateChatMessagesReducer } from "./privateChat/slice.js";

const rootReducer = combineReducers({
    friendsAndWannabes: friendsReducer,
    onlineUsers: onlineUsersReducer,
    chatMessages: chatMessagesReducer,
    privateChatMessages: privateChatMessagesReducer,
});

export default rootReducer;
