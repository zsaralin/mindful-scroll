
import {drawTwoTilings, refreshTilings, refreshTilings2, topSecondTiling} from "../Tiling/Tiling2";

let offsetY = 0; //distance from origin
let autoScroll = false;
const FIFTH_WINDOW = window.innerHeight * 4 / 5;
let autoScrollOn = true;


export let limitScroll = 0;

export function refreshPage(){
    refreshTilings2()
    copyToOnScreen(document.getElementById('off-canvas'));
}

export function doScroll(currY, prevY) {
    // limitScroll = tilingArrLength() <= 2 ? 0 : (sumArrayPrev() - LINE_WIDTH)
    if (offsetY - (currY - prevY) >= limitScroll) {
        offsetY -= (currY - prevY);
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

function copyToOnScreen(offScreenCanvas) {
    var onScreenContext = document.getElementById('tiling-canvas').getContext('2d');
    onScreenContext.drawImage(offScreenCanvas, 0, 0);
}

export function setUpCanvas(){
    drawTwoTilings()
    copyToOnScreen(document.getElementById('off-canvas'));
}

export function redrawCanvas() {
    const canvas = document.getElementById("canvas");
    const fillCanvas = document.getElementById("fill-canvas")
    const invisCanvas = document.getElementById("invis-canvas")
    const tilingCanvas = document.getElementById("tiling-canvas")
    if (offsetY > topSecondTiling()) {
        drawTwoTilings()
        tilingCanvas.getContext("2d").clearRect(0, 0, window.innerWidth, window.innerHeight * 5);
        copyToOnScreen(document.getElementById('off-canvas'));
        offsetY = 0;
    }

    [canvas, fillCanvas, tilingCanvas, invisCanvas].forEach(canvas => {
        canvas.style.transform = `translate(0,-${offsetY}px)`;
    });


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
    copyToOnScreen(document.getElementById('off-canvas'));

    // const tilingCanvas = document.getElementById("tiling-canvas")

    // if (offsetY > getYMin()[1]){
    //     console.log('h')
    //     tilingCanvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight*4);
    //     copyToOnScreen(createOffscreenCanvas())
    //     offsetY = 0;
    //
    // }

}

