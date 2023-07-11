// Function to capture and save a screenshot of a specific element
import {deleteObject, getStorage, listAll, ref, uploadString} from "firebase/storage";
import {logIdString} from "./TimeLog";
import {db, isLogging, startTime, UID} from "./Logging";
import {addDoc, collection} from "firebase/firestore";
import {getOffsetY} from "../Scroll/Offset";

const storage = getStorage()

export async function startScreenshots() {
    setInterval(async function () {
        if (UID && !document.hidden) captureScreenshot()
    }, 10000);

}

function captureScreenshot() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    // Get the source canvas elements
    const canvas1 = document.getElementById('fill-canvas');
    const canvas2 = document.getElementById('top-canvas');
    const canvas3 = document.getElementById('tiling-canvas');

    // Create a new canvas to combine the contents
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = viewportWidth; // Set the desired width
    combinedCanvas.height = viewportHeight; // Set the desired height

    // Get the 2D rendering context of the combined canvas
    const combinedContext = combinedCanvas.getContext('2d');

    // Draw the source canvases onto the combined canvas
    combinedContext.drawImage(canvas1, 0, getOffsetY(), viewportWidth, viewportHeight, 0, 0, viewportWidth, viewportHeight);
    combinedContext.drawImage(canvas2, 0, getOffsetY(), viewportWidth, viewportHeight, 0, 0, viewportWidth, viewportHeight);
    combinedContext.drawImage(canvas3, 0, getOffsetY(), viewportWidth, viewportHeight, 0, 0, viewportWidth, viewportHeight);

    const dataUrl = combinedCanvas.toDataURL()
    const time= Date.now()
    const fileName = `image_${time}.png`; // Append timestamp to the file name

    const storageRef = ref(storage, `${UID}/${logIdString()}/${fileName}`);

    uploadString(storageRef, dataUrl, 'data_url').then((snapshot) => {
        logScreenshotTime(time, `${UID}/${logIdString()}/${fileName}`)
    }).catch((error) => {
        console.error('Error uploading data URL:', error);
    });

}

async function deleteAllImages() {
    const folderRef = ref(storage, 'images');
    const folderFiles = await listAll(folderRef);

    // Delete each file in the folder
    folderFiles.items.map((fileRef) =>
        deleteObject(fileRef))
}

function logScreenshotTime(time, path) {
    if (isLogging) {
        const coll = collection(db, "log");
        const newMessage = {
            time: time,
            type: "E",
            action: "pic",
            path: path
        }
        addDoc(coll, newMessage);
    }

}