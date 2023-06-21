
// Function to capture and save a screenshot of a specific element
import {deleteObject, getStorage, listAll, ref, uploadString} from "firebase/storage";
import {logIdString} from "./TimeLog";
import {startTime, UID} from "./Logging";

const storage = getStorage()

export async function startScreenshots() {
    setInterval(async function () {
        if(UID && !document.hidden) captureScreenshot()
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
    combinedContext.drawImage(canvas1,  0, 0, viewportWidth, viewportHeight,0, 0, viewportWidth, viewportHeight);
    combinedContext.drawImage(canvas2,  0, 0, viewportWidth, viewportHeight,0, 0, viewportWidth, viewportHeight);
    combinedContext.drawImage(canvas3,  0, 0, viewportWidth, viewportHeight,0, 0, viewportWidth, viewportHeight);

    const dataUrl = combinedCanvas.toDataURL()
    const fileName = `image_${Date.now() - startTime}.png`; // Append timestamp to the file name

    const storageRef = ref(storage, `${UID}/${logIdString()}/${fileName}`);

    uploadString(storageRef, dataUrl, 'data_url').then((snapshot) => {
        console.log('Uploaded a data_url string!');
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