import {addDoc, collection} from "firebase/firestore";
import {db, deleteMessages, isLogging, startTime, UID} from "./Logging";

export function logNeighStart(tileId, neighIds, currColor) {
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            time: Date.now(),
            action: "neighStart",
            uid: UID,
            event: "E",
            tileId: tileId,
            neighIds: neighIds,
            col: currColor,
        }
        addDoc(coll, newMessage);
    }
}


export function logNeighEnd(tileId, neighIds, currColor) {
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            time: Date.now(),
            action: "neighEnd",
            uid: UID,
            event: "E",
            tileId: tileId,
            neighIds: neighIds,
            col: currColor,
        }
        addDoc(coll, newMessage);
    }
}
