import {addDoc, collection} from "firebase/firestore";
import {db, deleteMessages, startTime, UID} from "./Logging";

let startT;
let speedArr = []
let method; //1 or 2 fingers

export function logScrollStart(numFingers) {
    startT = Date.now() - startTime
    const coll = collection(db, "scrollStart");
    method = numFingers;
    const newMessage = {
        time: startT,
        name: "scrollStart",
        event: {"participant": UID, numFingers: method}
    }
    addDoc(coll, newMessage);
}
export function logScrollMove(speed) {
    const coll = collection(db, "scrollMove");
    const newMessage = {
        time: Date.now() - startTime,
        name: "scrollMove",
        event: {"participant": UID,
            "dir": speed > 0 ? "up": "down",
        }
    };
    speedArr.push(Math.abs(speed))
    addDoc(coll, newMessage);
}

export async function logScrollEnd(type, col, lw, tilingI) {
    const coll = collection(db, "scrollEnd");
    const endTime = Date.now() - startTime;
    const newMessage = {
        time: endTime,
        name: "scrollEnd",
        event: {"participant": UID,
            "numFingers": method,
            "speed" : calculateAverage(speedArr),
            "duration": endTime - startT,
        }
    };
    speedArr = []
    addDoc(coll, newMessage);
}

function calculateAverage(numbers) {
    if (numbers.length === 0) {
        return 0; // Handle the case of an empty array to avoid division by zero
    }

    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }

    const average = sum / numbers.length;
    return average;
}
