// // randomly generates a number between the range of low and high
// function getRandom(low = 1, high = 10) {
//     let randomNumber;
//     // calculate random number
//     randomNumber = Math.round(Math.random() * (high - low)) + low;
//     // returning value
//     return randomNumber;
// }

// function addKey(functionToCall, myCode = "Enter") {
//     document.addEventListener("keydown", (e) => {
//         // is the key released the specified key?
//         if (e.code === myCode) {
//             // pressing the enter key will force some browsers to refresh
//             // this command stops the event from going further
//             e.preventDefault();
//             // call provided callback to do everything else that needs to be done
//             functionToCall();
//             // this also helps the event from propagating in some browsers
//             return false;
//         }
//     });
// }

// export { getRandom, addKey };