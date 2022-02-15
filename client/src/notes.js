// export function friendsReducer(state = null, action) {
//     if (action.type == "friends/receivedFriends") {
//         state = action.payload.friends;
//     } else if (action.type === "friends/acceptWannabe") {
//         state = state.map((friends) => {
//             if (friends.id === action.payload.wannabeId) {
//                 return {
//                     ...friends,
//                     accepted: true,
//                 };
//             } else {
//                 return friends;
//             }
//         });
//     } else if (action.type === "friends/removeFriend") {
//         const spreadState = [...state];
//         const stateUpdate = spreadState.filter(
//             (friend) => friend.id != action.payload.friendId
//         );

//         return stateUpdate;
//     }
//     return state;
// }

// export function friendsReducer(state = null, action) {
//     switch (action.type) {
//         case "friends/receivedFriends": {
//             state = action.payload.friends;
//             return state;
//         }
//         case "friends/acceptWannabe": {
//             state = state.map((friends) => {
//                 if (friends.id === action.payload.wannabeId) {
//                     return {
//                         ...friends,
//                         accepted: true,
//                     };
//                 } else {
//                     return friends;
//                 }
//             });
//         }
//         case "friends/removeFriend": {
//             console.log("remove");

//             const spreadState = [...state];
//             const stateUpdate = spreadState.filter(
//                 (friend) => friend.id != action.payload.friendId
//             );

//             return stateUpdate;
//         }
//         default:
//             return state;
//     }
// }
