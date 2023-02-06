import {addToTilingArr, redrawTilings, sumArray, sumArrayPrev, tilingArrLength} from "./Tiling/TilingArr";
import {redrawStrokes} from "./Stroke/StrokeArr";
import {redrawActiveTiles} from "./Effects/Watercolor";
import {LINE_WIDTH} from "./Constants";
import {redrawTiles} from "./Tile/CompleteTile";
import {redrawGlow} from "./Tile/Shape";

let offsetY = 0; //distance from origin
let autoScroll = false;
const FIFTH_WINDOW = window.innerHeight * 4 / 5;
let autoScrollOn = true;

export let limitScroll;

export function doScroll(currY, prevY) {
    limitScroll = tilingArrLength() <= 2 ? 0 : (sumArrayPrev() - LINE_WIDTH)
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
    if (!autoScroll && cursorY > FIFTH_WINDOW && autoScrollOn) {
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

export function redrawCanvas() {
    const canvas = document.getElementById("canvas");
    const fillCanvas = document.getElementById("fill-canvas")
    const invisCanvas = document.getElementById("invis-canvas")
    const tilingCanvas = document.getElementById("tiling-canvas")

    console.log('offset ' + offsetY)
    if (offsetY > window.innerHeight*2){
        canvas.height = invisCanvas.height = tilingCanvas.height = fillCanvas.height = window.innerHeight;
    }
    canvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight);
    invisCanvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight);
    tilingCanvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight);
    fillCanvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight);

    // set the canvas to the size of the window
    // canvas.width = invisCanvas.width = tilingCanvas.width = fillCanvas.width = window.innerWidth;
    // canvas.height = invisCanvas.height = tilingCanvas.height = fillCanvas.height = window.innerHeight;
    //
    // invisCanvas.getContext("2d").translate(0, -offsetY)
    // tilingCanvas.getContext("2d").translate(0, -offsetY)
    // canvas.getContext("2d").translate(0, -offsetY)
    // fillCanvas.getContext("2d").translate(0, -offsetY)

    // canvas.style.transform = `translate(0,-${offsetY}px)`;
    // fillCanvas.style.transform = `translate(0,-${offsetY}px)`;
    // tilingCanvas.style.transform = `translate(0,-${offsetY}px)`;
    // invisCanvas.style.transform = `translate(0,-${offsetY}px)`;


    redrawStrokes();
    redrawActiveTiles();
    redrawTilings();
    redrawGlow();
}

export function triggerScroll(){
    autoScrollOn = !autoScrollOn
}