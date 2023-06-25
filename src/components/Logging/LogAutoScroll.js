import {db, isLogging, UID} from "./Logging";
import {addDoc, collection} from "firebase/firestore";

export function logAutoScrollStart() {
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            time: Date.now(),
            type: "E",
            action: "autoScStart",
            uid: UID,
        }
        addDoc(coll, newMessage);
    }
}

export function logAutoScrollStop() {
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            time: Date.now(),
            type: "E",
            action: "autoScStop",
            uid: UID,
        };
        addDoc(coll, newMessage);
    }
}

export function logAutoScrollEnd() {
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            time: Date.now(),
            type: "E",
            action: "autoScEnd",
            uid: UID,
        };
        addDoc(coll, newMessage);
    }
}
