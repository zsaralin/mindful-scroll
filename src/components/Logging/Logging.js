import {addDoc, collection, getFirestore} from "firebase/firestore";
import firebase from "firebase/compat/app";
import {getAuth} from "firebase/auth";
import html2canvas from "html2canvas";
import {getStorage, ref, uploadBytes, uploadString, listAll, deleteObject } from "firebase/storage";
import * as htmlToImage from 'html-to-image';

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
const db = getFirestore(firebase.app);
const auth = getAuth();
const startTime = Date.now();
const storage = getStorage()
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
    };
    const docRef = await addDoc(messagesCollection, newMessage);
}

export async function startScreenshots() {
    setInterval(async function () {
        if(UID && !document.hidden) captureScreenshot()
    }, 10000);

}

// Function to capture and save a screenshot of a specific element
function captureScreenshot() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    // Get the source canvas elements
    const canvas1 = document.getElementById('fill-canvas');
    const canvas2 = document.getElementById('top-canvas');
    const canvas3 = document.getElementById('tiling-canvas');

    // Create a new canvas to combine the contents
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = viewportWidth; // Set the desired width
    combinedCanvas.height = viewportHeight; // Set the desired height

    // Get the 2D rendering context of the combined canvas
    const combinedContext = combinedCanvas.getContext('2d');

    // Draw the source canvases onto the combined canvas
    combinedContext.drawImage(canvas1,  0, 0, viewportWidth, viewportHeight,0, 0, viewportWidth, viewportHeight);
    combinedContext.drawImage(canvas2,  0, 0, viewportWidth, viewportHeight,0, 0, viewportWidth, viewportHeight);
    combinedContext.drawImage(canvas3,  0, 0, viewportWidth, viewportHeight,0, 0, viewportWidth, viewportHeight);

    const dataUrl = combinedCanvas.toDataURL()
    const fileName = `image_${Date.now() - startTime}.png`; // Append timestamp to the file name
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-based, so we add 1
    const year = today.getFullYear() ;

    const storageRef = ref(storage, `${UID}/${year}_${day}_${month}/${fileName}`);
    uploadString(storageRef, dataUrl, 'data_url').then((snapshot) => {
        console.log('Uploaded a data_url string!');
    }).catch((error) => {
        console.error('Error uploading data URL:', error);
    });

}

async function deleteAllImages() {
    const folderRef = ref(storage, 'images');
    const folderFiles = await listAll(folderRef);

    // Delete each file in the folder
    folderFiles.items.map((fileRef) =>
        deleteObject(fileRef))
}
