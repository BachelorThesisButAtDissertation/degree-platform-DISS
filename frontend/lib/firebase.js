// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: 'AIzaSyDIWhFG0-asv9aDkiM4K05Wez1U5G7usM0',
//     authDomain: 'degree-platform.firebaseapp.com',
//     projectId: 'degree-platform',
//     storageBucket: 'degree-platform.appspot.com',
//     messagingSenderId: '570104824047',
//     appId: '1:570104824047:web:98102bc77344564d911b1a',
// };

const firebaseConfig = {
    apiKey: "AIzaSyBByWRAsa6dChhcd0R-k88MJk7_M5q9AfQ",
    authDomain: "degree-platform-5bec3.firebaseapp.com",
    projectId: "degree-platform-5bec3",
    storageBucket: "degree-platform-5bec3.appspot.com",
    messagingSenderId: "880369023270",
    appId: "1:880369023270:web:72681705cd04cd04d029e7",
    measurementId: "G-GF6BY5SPCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
