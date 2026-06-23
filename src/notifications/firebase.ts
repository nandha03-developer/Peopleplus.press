// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

// const firebaseConfig = {
//     apiKey: "",
//     authDomain: "peoplepluspress-cd965.firebaseapp.com",
//     projectId: "peoplepluspress-cd965",
//     storageBucket: "peoplepluspress-cd965.appspot.com",
//     messagingSenderId: "818997380809",
//     appId: "1:818997380809:web:0a2441103f88804f57ef18",
//     measurementId: "G-YG4BSSNR20"
// };

// const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging(app);

// // export const generateToken = async () => {
// //     const permission = await Notification.requestPermission();
// //     if (permission === "granted") {
// //         const token = await getToken(messaging, {
// //             vapidKey: ""
// //         })
// //     }
// // }


// export const generateToken = async () => {
//     try {
//       const permission = await Notification.requestPermission();
//       if (permission === "granted") {
//         const token = await getToken(messaging, {
//           vapidKey: ""
//         });
//         return token;
//       } else {
//         console.error("Permission denied for notifications");
//         return null;
//       }
//     } catch (error) {
//       console.error("Error generating token:", error);
//       return null;
//     }
//   };
