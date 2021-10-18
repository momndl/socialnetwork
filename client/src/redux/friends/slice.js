/* eslint-disable indent */
export function friendsReducer(state = null, action) {
    let newState = {};
    switch (action.type) {
        case "friends/receivedFriends": {
            newState = action.payload.friends;
            return newState;
        }
        case "friends/acceptWannabe": {
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
        }
        // eslint-disable-next-line no-fallthrough
        case "friends/removeFriend": {
            console.log("remove");

            const spreadState = [...state];
            const stateUpdate = spreadState.filter(
                (friend) => friend.id != action.payload.friendId
            );

            return stateUpdate;
        }
        default:
            return state;
    }
}

export function pendingReducer(state = null, action) {
    if (action.type == "request/receivedPendingRequests") {
        state = action.payload.requests;
    } else if (action.type == "request/removeRequest") {
        const spreadState = [...state];
        const stateUpdate = spreadState.filter(
            (request) => request.id != action.payload.friendId
        );

        return stateUpdate;
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
