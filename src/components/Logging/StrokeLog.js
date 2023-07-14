import {addDoc, collection} from "firebase/firestore";
import {db, deleteMessages, isLogging, startTime, UID} from "./Logging";

export function logStrokeStart(x, y, touchType, angle, force, lw, tileId, tilingId, col, filled, totCol, fr, strokeType) {
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            time: Date.now(),
            type: "I",
            action: "st",
            uid: UID,
            event: "D",
            x: x,
            y: y,
            typeTouch: touchType ? touchType : "null",
            angle: angle,
            force: force,
            lw: lw,
            tileId: tileId,
            tilingId: tilingId,
            col: col,
            filled: filled,
            totCol: totCol,
            fr: fr,
            stType : strokeType,
        }
        addDoc(coll, newMessage);
    }
}

export async function logStrokeMove(x0, y0, x1, y1, speedX, speedY, touchType, angle, force, lw, tileId, tilingId, col, stType, sizeChange, filled, totCol) {
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            time: Date.now(),
            type: "I",
            action: "st",
            uid: UID,
            event: "M",
            x0: x0,
            y0: y0,
            x1: x1,
            y1: y1,
            vx: speedX,
            vy: speedY,
            typeTouch: touchType ? touchType : "null",
            angle: angle,
            force: force,
            lw: lw,
            tileId: tileId,
            tilingId: tilingId,
            col: col,
            stType: stType,
            sizeChange: sizeChange,
            filled: filled,
            totCol: totCol,
        }
        addDoc(coll, newMessage);
    }
}

export async function logStrokeEnd(x, y, touchType, angle, force, lw, tileId, tilingId, col, filled, totCol, fr, stType) {
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            time: Date.now(),
            type: "I",
            action: "st",
            uid: UID,
            event: "U",
            x: x,
            y: y,
            typeTouch: touchType ? touchType : "null",
            angle: angle,
            force: force,
            lw: lw,
            tileId: tileId,
            tilingId: tilingId,
            col: col,
            filled: filled,
            totCol: totCol,
            fr: fr,
            stType: stType,
        };
        addDoc(coll, newMessage);
    }
}

export async function logDot(x, y, touchType, angle, force, lw, tileId, tilingId, col, dotType, filled, totCol) {
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            time: Date.now(),
            type: "I",
            action: "dot",
            uid: UID,
            event: "U",
            x: x,
            y: y,
            typeTouch: touchType ? touchType : "null",
            angle: angle,
            force: force,
            lw: lw,
            tileId: tileId,
            tilingId: tilingId,
            col: col,
            dotType: dotType,
            filled: filled,
            totCol: totCol,
        };
        addDoc(coll, newMessage);
    }

}