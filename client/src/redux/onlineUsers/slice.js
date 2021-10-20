export function onlineUsersReducer(state = null, action) {
    if (action.type == "onlineUsers/receivedOnlineUsers") {
        state = action.payload.users;
    } else if (action.type == "onlineUsers/userDisconnected") {
        console.log("sate: ", action.payload.usersId);
        const spreadState = [...state];
        const stateUpdate = spreadState.filter(
            (users) => users.id != action.payload.usersId
        );

        return stateUpdate;
    }
    return state;
}

export function receiveOnlineUsers(users) {
    return {
        type: "onlineUsers/receivedOnlineUsers",
        payload: { users },
    };
}

export function onlineUserDisconnect(usersId) {
    return {
        type: "onlineUsers/userDisconnected",
        payload: { usersId },
    };
}
