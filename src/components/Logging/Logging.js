import {addDoc, collection, getFirestore, getDocs, deleteDoc} from "firebase/firestore";
import firebase from "firebase/compat/app";
import {getAuth} from "firebase/auth";
import html2canvas from "html2canvas";
import {getStorage, ref, uploadBytes, uploadString, listAll, deleteObject} from "firebase/storage";
import * as htmlToImage from 'html-to-image';
import {dateString, logIdString} from "./TimeLog";

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

export async function logStrokeStart(type, col, lw, pos, tilingI) {
    // deleteMessages()
    const messagesCollection = collection(db, "messages");
    const newMessage = {
        time: Date.now() - startTime,
        name: "strokeStart",
        event: {"participant": UID,
            "type": type,
            "col": col,
            "lw": lw,
            "pos": pos.toString(),
            "tiling": tilingI}
    };
    await addDoc(messagesCollection, newMessage);
}

export async function deleteMessages(coll) {
    const querySnapshot = await getDocs(coll);

    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });
}