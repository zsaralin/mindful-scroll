import {addDoc, collection} from "firebase/firestore";
import {db, deleteMessages, startTime, UID} from "./Logging";

let startT;
let speedArr = []
export function logStrokeStart(type, col, lw, pos, tilingI) {
    deleteMessages()
    startT = Date.now() - startTime
    const messagesCollection = collection(db, "messages");
    const newMessage = {
        time: startT,
        name: "strokeStart",
        event: {"participant": UID,
            "type": type,
            "col": col,
            "lw": lw,
            "pos": pos.toString(),
            "tiling": tilingI}
    };
    addDoc(messagesCollection, newMessage);
}
export async function logStrokeMove(type, col, lw, pos, tilingI, speed) {
    const messagesCollection = collection(db, "messages");
    const newMessage = {
        time: Date.now() - startTime,
        name: "strokeMove",
        event: {"participant": UID,
            "type": type,
            "col": col,
            "lw": lw,
            "pos": pos.toString(),
            "tiling": tilingI,
            // "speed" : speed,
        }
    };
    speedArr.push(speed)
    addDoc(messagesCollection, newMessage);
}
export async function logStrokeEnd(type, col, lw, tilingI) {
    const messagesCollection = collection(db, "messages");
    const endTime = Date.now() - startTime;
    const newMessage = {
        time: endTime,
        name: "strokeEnd",
        event: {"participant": UID,
            "type": type,
            "col": col,
            "lw": lw,
            // "pos": pos.toString(),
            "tiling": tilingI,
            "speed" : calculateAverage(speedArr),
            "timeStroke": endTime - startT,
        }
    };
    speedArr = []
    addDoc(messagesCollection, newMessage);
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