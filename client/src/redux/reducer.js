import { combineReducers } from "redux";
import { friendsReducer } from "./friends/slice.js";
import { chatMessagesReducer } from "./messages/slice.js";

const rootReducer = combineReducers({
    friendsAndWannabes: friendsReducer,

    chatMessages: chatMessagesReducer,
});

export default rootReducer;
