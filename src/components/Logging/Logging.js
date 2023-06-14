import {addDoc, collection, getFirestore} from "firebase/firestore";
import {UID} from "../Audio/Audio";
import firebase from "firebase/compat/app";
import {getAuth} from "firebase/auth";
import html2canvas from "html2canvas";
import { getStorage, ref , uploadBytes} from "firebase/storage";

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

export async function sendMessageFB(message) {
    const messagesCollection = collection(db, "messages");
    const newMessage = {
        participantId: UID,
        original: "Hello, Firestore!",
        time: Date.now() - startTime,
    };
    const docRef = await addDoc(messagesCollection, newMessage);
    console.log("Document written with ID: ", docRef.id);
}

export async function startScreenshots(){
    setInterval(async function() {
        captureScreenshot()
    }, 5000);
}

// Function to capture and save a screenshot of a specific element
function captureScreenshot() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    html2canvas(document.getElementById('app'), {
        allowTaint: true,
        scale: .5,
        useCORS: true,
        width: viewportWidth,
        height: viewportHeight,
        backgroundColor: '#FFFFFF',
    }).then(function(canvas) {
        canvas.toBlob(function(blob) {
            const fileName = `image_${Date.now() - startTime}.jpg`; // Append timestamp to the file name
            const spaceRef = ref(storage, `images/${fileName}`);
            // Replace the 'file' parameter with the Blob object
            uploadBytes(spaceRef, blob).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });
        }, 'image/jpeg', 1);
        // var a = document.createElement('a');
        // a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        // a.download = 'Screenshot.jpg';
        // return a.href
        // a.click();
        // return a.download
    });
}