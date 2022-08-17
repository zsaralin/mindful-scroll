import {addToTilingArr, redrawTilings, sumArray, sumArrayPrev, tilingArrLength} from "./TilingArr";
import {redrawStrokes} from "./Stroke/StrokeArr";
import {redrawTiles} from "./FillTile";
import {LINE_WIDTH} from "./ScaleConstants";

let offsetY = 0; //distance from origin
let autoScroll = false;
const FIFTH_WINDOW = window.innerHeight * 4 / 5;

export function doScroll(currY, prevY) {
    let limitScroll = tilingArrLength() <= 2 ? 0 : (sumArrayPrev() - LINE_WIDTH)
    if (offsetY - (currY - prevY) >= limitScroll) {
        offsetY -= (currY - prevY);
    } else {
        offsetY = limitScroll
    }
    if (offsetY > (sumArray() - window.innerHeight)) {
        addToTilingArr(offsetY)
    }
    redrawCanvas();
    if (autoScroll) endAutoScroll()
}

export function startAutoScroll(cursorY) {
    if (!autoScroll && cursorY > FIFTH_WINDOW) {
        autoScroll = true;
        let timesRun = 0;
        autoScroll = setInterval(function () {
            timesRun += 1;
            offsetY += 1;
            redrawCanvas()
            if (timesRun === 60) {
                endAutoScroll()
            }
        }, 100);
    }
}

function endAutoScroll() {
    clearInterval(autoScroll)
    autoScroll = false;
}

export function getOffsetY() {
    return offsetY
}

function redrawCanvas() {
    const canvas = document.getElementById("canvas");
    const invisCanvas = document.getElementById("invis-canvas")
    const tilingCanvas = document.getElementById("tiling-canvas")

    // set the canvas to the size of the window
    canvas.width = invisCanvas.width = tilingCanvas.width = window.innerWidth;
    canvas.height = invisCanvas.height = tilingCanvas.height = window.innerHeight;

    // canvas.getContext("2d").translate(0, -offsetY)
    invisCanvas.getContext("2d").translate(0, -offsetY)
    tilingCanvas.getContext("2d").translate(0, -offsetY)

    redrawStrokes(offsetY);
    redrawTiles()
    redrawTilings();
}