export function friendsReducer(state = null, action) {
    if (action.type == "friends/receivedFriends") {
        state = action.payload.friends;
    } else if (action.type === "friends/acceptWannabe") {
        //console.log("ähh okay, irgendwas in slice? state?:", state);
        state = state.map((friends) => {
            if (friends.id === action.payload.wannabeId) {
                return {
                    ...friends,
                    accepted: true,
                };
            } else {
                return friends;
            }
        });
    } else if (action.type === "friends/removeFriend") {
        let stateCopy = [...state];

        stateCopy = state.filter(
            (friend) => friend.id != action.payload.friendId
        );

        return stateCopy;
    }
    return state;
}

export function pendingReducer(state = null, action) {
    if (action.type == "request/receivedPendingRequests") {
        state = action.payload.requests;
    } else if (action.type == "request/removeRequest") {
        let stateCopy = [...state];

        stateCopy = state.filter(
            (friend) => friend.id != action.payload.friendId
        );

        return stateCopy;
    }
    return state;
}

// Action Creators ----------------------
export function receiveFriends(friends) {
    return {
        type: "friends/receivedFriends",
        payload: { friends },
    };
}

export function acceptWannabe(wannabeId) {
    return {
        type: "friends/acceptWannabe",
        payload: { wannabeId },
    };
}

export function removeFriend(friendId) {
    return {
        type: "friends/removeFriend",
        payload: { friendId },
    };
}

export function receiveRequest(requests) {
    return {
        type: "request/receivedPendingRequests",
        payload: { requests },
    };
}

export function removeRequest(friendId) {
    return {
        type: "request/removeRequest",
        payload: { friendId },
    };
}
