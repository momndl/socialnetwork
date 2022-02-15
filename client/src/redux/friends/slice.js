/* eslint-disable indent */
export function friendsReducer(state = null, action) {
    switch (action.type) {
        case "friends/receivedFriends": {
            state = action.payload.friends;
            return state;
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
