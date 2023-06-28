import {db, isLogging, UID} from "./Logging";
import {addDoc, collection} from "firebase/firestore";
import {tileIds} from "../Tiling/TilingPathDict";
import {path} from "../Tiling/TilingPath";

export function logTiling(tilingI, tiles, bounds, offset, colourPal, fillInfo, tilingType) {
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            time: Date.now(),
            type: "E",
            action: "t",
            uid: UID,
            tilingId: tilingI,
            tiles: tiles, // {id: id, bounds: bounds, offset: [offsetX, offsetY]}
            bounds: bounds,
            offset: offset,
            colourPal: colourPal,
            tilingType: tilingType,
            tilingPath: path,
            fillInfo: JSON.stringify(fillInfo),
        }
        addDoc(coll, newMessage);
    }
}