import {db, startTime, UID} from "./Logging";
import {addDoc, collection} from "firebase/firestore";

export function logFillTile(type, under, col, tilingI) {
    const coll = collection(db, "fillTile");
    const newMessage = {
        time: Date.now() - startTime,
        name: "fillTile",
        event: {"participant": UID,
            "type": type,
            "col": col,
            "tiling": tilingI}
    };
    addDoc(coll, newMessage);
}