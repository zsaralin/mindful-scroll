import {addDoc, collection} from "firebase/firestore";
import {db, deleteMessages, isLogging, startTime, UID} from "./Logging";

export function logScrollStart(x, y, touchType, numTouches, angle, force,) {
    if (isLogging) {
        const coll = collection(db, "touch");
        const newMessage = {
            time: Date.now(),
            type: "I",
            action: "sc",
            uid: UID,
            event: "D",
            x: x,
            y: y,
            typeTouch: touchType ? touchType : "null",
            numTouch: numTouches ,
            angle: angle ,
            force: force,
        }
        addDoc(coll, newMessage);
    }
}

export function logScrollMove(x0,y0,x1,y1, speedX, speedY, touchType, numTouches, angle, force,) {
    if (isLogging) {
        const coll = collection(db, "touch");
        const newMessage = {
            time: Date.now(),
            type: "I",
            action: "sc",
            uid: UID,
            event: "M",
            x0: x0,
            y0: y0,
            x1: x1,
            y1: y1,
            vx: speedX,
            vy: speedY,
            typeTouch: touchType ? touchType : "null",
            numTouch: numTouches ,
            angle: angle ,
            force: force,
        }
        addDoc(coll, newMessage);
    }
}

export async function logScrollEnd(x, y, touchType, numTouches, angle, force) {
    if (isLogging) {
        const coll = collection(db, "touch");
        const newMessage = {
            time: Date.now(),
            type: "I",
            action: "sc",
            uid: UID,
            event: "U",
            x: x,
            y: y,
            typeTouch: touchType ? touchType : "null",
            numTouch: numTouches ,
            angle: angle ,
            force: force,
        };
        addDoc(coll, newMessage);
    }
}
