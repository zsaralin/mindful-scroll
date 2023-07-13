import {db, isLogging, startTime, UID} from "./Logging";
import {addDoc, collection} from "firebase/firestore";

export function logFillTile(type, under, tileId, colors, fillColor, fillColors, colorCode) {
    if(isLogging) {
        console.log('HERE YEEEEEEEEEE ' + fillColors + ' and fillColor ' + fillColor)
        const coll = collection(db, "log");
        const newMessage = {
            uid: UID,
            time: Date.now(),
            type: "E",
            action: "f",
            fillType: type,
            under: under,
            tileId: tileId,
            colors: colors,
            fillColor: typeof fillColor === 'undefined' ? "null" : fillColor,
            fillColors: fillColors ? fillColors : "null",
            colorCode: colorCode,
        };
        addDoc(coll, newMessage);
    }
}
export function logWaterStart(tileId, color, type){
if(isLogging) {
    const coll = collection(db, "log");
    const newMessage = {
        uid: UID,
        time: Date.now(),
        type: "E",
        action: "ws",
        tileId: tileId,
        color: color,
        dir: type,
    };
    addDoc(coll, newMessage);
}
}
export function logWaterEnd(tileId, color, type){
    if(isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            uid: UID,
            time: Date.now(),
            type: "E",
            action: "we",
            tileId: tileId,
            color: color,
            dir: type,
        };
        addDoc(coll, newMessage);
    }
}