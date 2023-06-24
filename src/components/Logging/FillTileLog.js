import {db, isLogging, startTime, UID} from "./Logging";
import {addDoc, collection} from "firebase/firestore";

export function logFillTile(type, under, tileId, colors, fillColor, fillColors, colorCode, fillNum) {
    console.log(
        'EY'
    )
    if(isLogging) {
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
            fillColor: fillColors,
            colorCode: colorCode,
            fillNum : fillNum
        };
        addDoc(coll, newMessage);
    }
    //, tile.i, tile.colors, tile.fillColor, tile.fillColors, colorCode)
}