export function chatMessagesReducer(state = null, action) {
    if (action.type == "messages/receivedLatestMessages") {
        state = action.payload.msgs;
    } else if (action.type == "messages/receivedNewMessage") {
        const msg = action.payload.msg;
        return [...state, msg];
    }
    return state;
}

// action creators
export function chatMessagesReceived(msgs) {
    return {
        type: "messages/receivedLatestMessages",
        payload: { msgs },
    };
}

export function chatMessageReceived(msg) {
    return {
        type: "messages/receivedNewMessage",
        payload: { msg },
    };
}
