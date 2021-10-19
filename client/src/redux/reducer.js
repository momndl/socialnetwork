import { combineReducers } from "redux";
import { friendsReducer, pendingReducer } from "./friends/slice.js";
import { chatMessagesReducer } from "./messages/slice.js";

const rootReducer = combineReducers({
    friendsAndWannabes: friendsReducer,
    pendingRequests: pendingReducer,
    chatMessages: chatMessagesReducer,
});

export default rootReducer;
