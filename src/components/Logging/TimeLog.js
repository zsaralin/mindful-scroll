import {ref} from "firebase/storage";
import {db, isLogging, UID} from "./Logging";
import {addDoc, collection} from "firebase/firestore";
import {basicVersion} from "../Tiling/SortingHat/CompleteTile2";

export function logIdString(){
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-based, so we add 1
    const year = today.getFullYear() ;
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    return`${UID}_${year}_${day}_${month}_${minutes}_${seconds}`
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
            basic : basicVersion.toString()
            // basic: urlParams.get('basic'),
        }
        addDoc(coll, newMessage);
    }

}

function getDevice(){
    var userAgent = navigator.userAgent;
    var model = "Unknown";

// Check if the device is an iPhone
    if (/iPhone/i.test(userAgent)) {
        // Extract the iPhone model from the user agent
        var match = userAgent.match(/iPhone\s*([^\s;]*)/);
        if (match && match.length > 1) {
            model = match[1];
        }
    }
// Check if the device is an iPad
    else if (/iPad/i.test(userAgent)) {
        // Extract the iPad model from the user agent
        var match = userAgent.match(/iPad\s*([^\s;]*)/);
        if (match && match.length > 1) {
            model = match[1];
        }
    }
// Check if the device is a Google Pixel
    else if (/Pixel/i.test(userAgent)) {
        // Extract the Pixel model from the user agent
        var match = userAgent.match(/Pixel\s*([^\s;]*)/);
        if (match && match.length > 1) {
            model = match[1];
        }
    }
// Check if the device is an Android phone or tablet
    else if (/Android/i.test(userAgent)) {
        // Extract the Android model from the user agent
        var match = userAgent.match(/Android\s*([^;]*)/);
        if (match && match.length > 1) {
            model = match[1];
        }
    }

    return model
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