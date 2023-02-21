
import {drawTwoTilings, refreshTilings, refreshTilings2, topSecondTiling} from "../Tiling/Tiling2";
import {redrawStrokes, redrawStrokesNewPage} from "../Stroke/StrokeArr";
import {redrawCompleteTiles} from "../Tile/CompleteTileArr";
import {redrawActiveTiles} from "../Effects/Watercolor";
import {setInternalOffset} from "../Tile/CompleteTile";

let offsetY = 0; //distance from origin
let autoScroll = false;
const FIFTH_WINDOW = window.innerHeight * 4 / 5;
let autoScrollOn = true;


export let limitScroll = 0;

export function refreshPage(){ // used when change tile width and size
    refreshTilings2()
    copyToOnScreen(document.getElementById('off-canvas'));
    redrawStrokes()
    redrawCompleteTiles()
    redrawActiveTiles()

}

export function doScroll(currY, prevY) {
    // limitScroll = tilingArrLength() <= 2 ? 0 : (sumArrayPrev() - LINE_WIDTH)
    if (offsetY - (currY - prevY) >= limitScroll) {
        offsetY -= (currY - prevY);
        totOffsetY -= currY - prevY
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
        console.log('h')
        autoScroll = true;
        let timesRun = 0;
        autoScroll = setInterval(function () {
            timesRun += 1;
            offsetY += 1;
            totOffsetY += 1;
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
export function getTotOffset() {
    return totOffsetY
}

function copyToOnScreen(offScreenCanvas) {
    let tilingCanv = document.getElementById('tiling-canvas').getContext('2d');
    tilingCanv.drawImage(offScreenCanvas, 0, 0);
}

export function setUpCanvas(){
    drawTwoTilings()
    copyToOnScreen(document.getElementById('off-canvas'));
}

let totOffsetY = 0;
export function redrawCanvas() {
    const canvas = document.getElementById("canvas");
    const fillCanvas = document.getElementById("fill-canvas")
    const invisCanvas = document.getElementById("invis-canvas")
    const tilingCanvas = document.getElementById("tiling-canvas")
    if (offsetY > topSecondTiling() + 0) {
        [tilingCanvas, invisCanvas, canvas, fillCanvas].forEach(canvas => {
            canvas.style.transform = `translate(0,-${0}px)`;
        });
        // console.log('generating new Page')
        drawTwoTilings()
        copyToOnScreen(document.getElementById('off-canvas'));
        redrawStrokesNewPage(offsetY)
        redrawCompleteTiles(offsetY)
        redrawActiveTiles(offsetY)
        offsetY = 0;
        // [tilingCanvas, invisCanvas, canvas, fillCanvas].forEach(canvas => {
        //     canvas.style.transform = `translate(0,-${offsetY}px)`;
        // });

    }
    else {
        [tilingCanvas, invisCanvas, canvas, fillCanvas].forEach(canvas => {
            canvas.style.transform = `translate(0,-${offsetY}px)`;
        });
        // [fillCanvas].forEach(canvas => {
        //     canvas.style.transform = `translate(0,-${totOffsetY}px)`;
        // });
    }

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
    //     tilingCanvas.getContext("2d").clearRect(0,0,window.innerWidth, window.innerHeight*4);
    //     copyToOnScreen(createOffscreenCanvas())
    //     offsetY = 0;
    //
    // }

}

