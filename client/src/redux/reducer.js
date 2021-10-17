import { combineReducers } from "redux";
import { friendsReducer, pendingReducer } from "./friends/slice.js";

const rootReducer = combineReducers({
    friendsAndWannabes: friendsReducer,
    pendingRequests: pendingReducer,
});

export default rootReducer;
