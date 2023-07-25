import {addDoc, collection, getFirestore, getDocs, deleteDoc, listCollections} from "firebase/firestore";
import firebase from "firebase/compat/app";
import {getAuth} from "firebase/auth";
import html2canvas from "html2canvas";
import {getStorage, ref, uploadBytes, uploadString, listAll, deleteObject} from "firebase/storage";
import * as htmlToImage from 'html-to-image';
import {dateString, logIdString} from "./TimeLog";

export let isLogging  = false;
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD7jkL5al-vXpx49bscaB56M1p8uQAPhWU",
    authDomain: "mindful-coloring.firebaseapp.com",
    projectId: "mindful-coloring",
    storageBucket: "mindful-coloring.appspot.com",
    messagingSenderId: "899048890421",
    appId: "1:899048890421:web:ef1ea89361951460ab117c",
    measurementId: "G-L5Y0CXJXFG"
};

firebase.initializeApp(firebaseConfig);
export const db = getFirestore(firebase.app);
const auth = getAuth();
export const startTime = Date.now();
export const UID = setupParticipant()

export function setupParticipant() {
    // deleteAllCollections()
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // Retrieving the participant number
    const participantNumber = urlParams.get('uid');
    return participantNumber
}

export async function sendMessageFB(message) {
    const messagesCollection = collection(db, "messages");
    const newMessage = {
        participantId: UID,
        original: "Hello, Firestore!",
        time: Date.now() - startTime,
        stroke: {key1: 2, key2: 3}
    };
    const docRef = await addDoc(messagesCollection, newMessage);
}

export async function deleteMessages(coll) {
    const querySnapshot = await getDocs(coll);

    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });
}

async function deleteAllCollections() {
    const db = getFirestore();
    const collectionNames = ['dot', 'scrollEnd', 'scrollMove',
    'scrollStart', 'strokeEnd', 'strokeMove', 'strokeStart', 'fillTile']; // Add the names of your collections

    // Delete each collection and its documents
    for (const collectionName of collectionNames) {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);

        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
        });
    }
}