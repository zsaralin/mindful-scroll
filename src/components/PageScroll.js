
import {drawTwoTilings, refreshTilings, topSecondTiling} from "./Tiling/Tiling2";

let offsetY = 0; //distance from origin
let autoScroll = false;
const FIFTH_WINDOW = window.innerHeight * 4 / 5;
let autoScrollOn = true;

export let limitScroll = 0;

export function refreshPage(){
    refreshTilings()
    copyToOnScreen(createOffscreenCanvas())
}
export function doScroll(currY, prevY) {
    // limitScroll = tilingArrLength() <= 2 ? 0 : (sumArrayPrev() - LINE_WIDTH)
    if (offsetY - (currY - prevY) >= limitScroll) {
        offsetY -= (currY - prevY);
        console.log('off ' + offsetY)
        redrawCanvas();

    } else {
        offsetY = limitScroll
    }
    // if (offsetY > (sumArray() - window.innerHeight)) {
    //     addToTilingArr(offsetY)
    // }
    //     redrawCanvas();
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

function createOffscreenCanvas() {
    var offScreenCanvas = document.getElementById('off-canvas');
    // offScreenCanvas.style.transform = `translate(0,-${offsetY}px)`;

    // offScreenCanvas.width = window.innerWidth;
    var context = offScreenCanvas.getContext("2d");
    // context.style.backgroundColor = 'orange'; //set fill color
    // context.fillRect(10, 10, 200, 200);
    return offScreenCanvas; //return canvas element
}

function copyToOnScreen(offScreenCanvas) {
    var onScreenContext = document.getElementById('tiling-canvas').getContext('2d');
    onScreenContext.drawImage(offScreenCanvas, 0, 0);
}

export function setUpCanvas(){
    drawTwoTilings()
    copyToOnScreen(createOffscreenCanvas())
}

export function redrawCanvas() {
    const canvas = document.getElementById("canvas");
    const fillCanvas = document.getElementById("fill-canvas")
    const invisCanvas = document.getElementById("invis-canvas")
    const tilingCanvas = document.getElementById("tiling-canvas")

    // console.log('offset ' + offsetY)
    if (offsetY > topSecondTiling()) {
        drawTwoTilings()
        tilingCanvas.getContext("2d").clearRect(0, 0, window.innerWidth, window.innerHeight * 5);
        copyToOnScreen(createOffscreenCanvas())
        offsetY = 0;
    }
    // canvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight);
    // invisCanvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight);
    // tilingCanvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight);
    // fillCanvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight);

    // set the canvas to the size of the window
    // canvas.width = invisCanvas.width = tilingCanvas.width = fillCanvas.width = window.innerWidth;
    // canvas.height = invisCanvas.height = tilingCanvas.height = fillCanvas.height = window.innerHeight;
    //
    // invisCanvas.getContext("2d").translate(0, -offsetY)
    // tilingCanvas.getContext("2d").translate(0, -offsetY)
    // canvas.getContext("2d").translate(0, -offsetY)
    // fillCanvas.getContext("2d").translate(0, -offsetY)

    canvas.style.transform = `translate(0,-${offsetY}px)`;
    fillCanvas.style.transform = `translate(0,-${offsetY}px)`;
    tilingCanvas.style.transform = `translate(0,-${offsetY}px)`;
    invisCanvas.style.transform = `translate(0,-${offsetY}px)`;


    // redrawStrokes();
    // redrawActiveTiles();
    // redrawTilings();
    // redrawGlow();
}

export function triggerScroll() {
    autoScrollOn = !autoScrollOn
}

export function redrawCanvas2() {
    // drawTwoTilings()
    const tilingCanvas = document.getElementById("tiling-canvas")

    // tilingCanvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight*9);
    copyToOnScreen(createOffscreenCanvas())

    // const tilingCanvas = document.getElementById("tiling-canvas")

    // if (offsetY > getYMin()[1]){
    //     console.log('h')
    //     tilingCanvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight*4);
    //     copyToOnScreen(createOffscreenCanvas())
    //     offsetY = 0;
    //
    // }

}