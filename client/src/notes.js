// export function friendsReducer(state = null, action) {
//     if (action.type == "friends/receivedFriends") {
//        state = action.payload.friends;
//     } else if (action.type === "friends/acceptWannabe") {
//         //console.log("ähh okay, irgendwas in slice? state?:", state);
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
//         let stateCopy = [...state];
//         stateCopy = state.filter(
//             (friend) => friend.id != action.payload.friendId
//         );
//         return stateCopy;
//     }
//     return state;
// }

// export  function friendsReducer(state = null, action) {
//     switch (action.type) {
//         case "friends/receivedFriends": {console.log("friends");}
//         case "friends/acceptWannabe": {
//             console.log("accept");

//             // state = state.map((friends) => {
//             //     if (friends.id === action.payload.wannabeId) {
//             //         return {
//             //             ...friends,
//             //             accepted: true,
//             //         };
//             //     } else {
//             //         return friends;
//             //     }
//             // });
//         }
//         case "friends/removeFriend": {
//             console.log("remove");

//             // let stateCopy = [...state];
//             // stateCopy = state.filter(
//             //     (friend) => friend.id != action.payload.friendId
//             // );
//             // return stateCopy;
//         }
//     }
// }
