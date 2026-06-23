// // Give the service worker access to Firebase Messaging.
// // Note that you can only use Firebase Messaging here. Other Firebase libraries
// // are not available in the service worker.
// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// firebase.initializeApp({
//     apiKey: "AIzaSyDY31KPbXbkD_RbitzQcG51ajAE82PXvRU",
//     authDomain: "peoplepluspress-cd965.firebaseapp.com",
//     projectId: "peoplepluspress-cd965",
//     storageBucket: "peoplepluspress-cd965.appspot.com",
//     messagingSenderId: "818997380809",
//     appId: "1:818997380809:web:0a2441103f88804f57ef18",
//     measurementId: "G-YG4BSSNR20"
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging();


// messaging.onBackgroundMessage((payload) => {
//     // Customize notification here
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//       body: payload.notification.body,
//       icon: payload.notification.image
//     };
  
//     self.registration.showNotification(notificationTitle, notificationOptions);
//   });