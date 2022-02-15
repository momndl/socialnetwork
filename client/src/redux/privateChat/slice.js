export function privateChatMessagesReducer(state = null, action) {
    if (action.type == "privateMessages/receivedLatestMessages") {
        state = action.payload.msgs;
    } else if (action.type == "privateMessages/receivedNewMessage") {
        const msg = action.payload.msg;
        return [...state, msg];
    }
    return state;
}

// action creators
export function privateChatMessagesReceived(msgs) {
    return {
        type: "privateMessages/receivedLatestMessages",
        payload: { msgs },
    };
}

export function privateChatMessageReceived(msg) {
    return {
        type: "privateMessages/receivedNewMessage",
        payload: { msg },
    };
}
