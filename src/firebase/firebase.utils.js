import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const config = {
  apiKey: "AIzaSyCOtzgUi7k5OAVOuQB1Vru-FwJsI5PFnTA",
  authDomain: "propiedad-horizontal-6258e.firebaseapp.com",
  databaseURL: "https://propiedad-horizontal-6258e.firebaseio.com",
  projectId: "propiedad-horizontal-6258e",
  storageBucket: "propiedad-horizontal-6258e.appspot.com",
  messagingSenderId: "732564655965",
  appId: "1:732564655965:web:3c15f60e36a563137f22b4",
  measurementId: "G-CREJ16WNMC"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage().ref();

export default firebase;
