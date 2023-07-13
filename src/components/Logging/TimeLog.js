import {ref} from "firebase/storage";
import {db, isLogging, UID} from "./Logging";
import {addDoc, collection} from "firebase/firestore";
import {basicVersion} from "../Tiling/SortingHat/CompleteTile2";
import MobileDetect from 'mobile-detect';

export function logIdString() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0'); // Add leading zero if necessary
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if necessary
    const year = today.getFullYear();
    // const minutes = today.getMinutes();
    // const seconds = today.getSeconds();

    return `${UID}_${year}_${month}_${day}`;
}

export function logStart() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);

    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            uid: UID,
            type: "E",
            datetime: formattedDate,
            time: Date.now(),
            device: getDevice(),
            action: "start",
            winW: window.innerWidth,
            winH: window.innerHeight,
            basic : basicVersion.toString(),
            // basic: urlParams.get('basic'),
        }
        addDoc(coll, newMessage);
    }

}

function getDevice(){
    const md = new MobileDetect(window.navigator.userAgent);
    return md.mobile();
}

export function logTimer() {
    const currentDate = new Date();
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            uid: UID,
            type: "E",
            time: Date.now(),
            action: "end",
        }
        addDoc(coll, newMessage);
    }

}

export function logRefresh(){
    if (isLogging) {
        console.log('IMM REFRESHING')
        const coll = collection(db, "log");
        const newMessage = {
            uid: UID,
            type: "E",
            time: Date.now(),
            action: "refresh",
        }
        addDoc(coll, newMessage);
    }
}

export function logExit(){
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            uid: UID,
            type: "E",
            time: Date.now(),
            action: "exit",
        }
        addDoc(coll, newMessage);
    }
}

window.addEventListener('beforeunload', function(event) {
    logRefresh()
})

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        logExit()
        // Custom logic to handle when the user leaves the tab
        // This code will be executed when the user switches to a different tab or closes the tab
    }
});