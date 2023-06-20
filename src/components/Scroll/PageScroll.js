import {drawBottomTiling, drawTwoTilings, refreshTilings, refreshTilings2, topSecondTiling} from "../Tiling/Tiling2";
import {redrawStrokes} from "../Stroke/StrokeType/StrokeArr";
import {redrawCompleteTiles} from "../Tile/CompleteTileArr";
import {redrawActiveTiles} from "../Effects/Watercolor";
import {setInternalOffset} from "../Tile/CompleteTile";
import {BETWEEN_SPACE, SCROLL_DELTA, SCROLL_DIST, TOP_PAGE_SPACE} from "../Constants";
import {endAutoScroll, isAutoScrollActive} from "./AutoScroll";
import {getOffsetY, setOffsetY} from "./Offset";
import {isSlowScrollOn} from "./SlowScroll";
import {getOffsetTop} from "@mui/material";
import {redrawBlur} from "../Effects/Blur";
import {redrawTransparentStrokes} from "../Stroke/StrokeType/TransparentStroke";
import {redrawDottedStrokes} from "../Stroke/StrokeType/DottedStroke";
import {gsap} from "gsap";
import {endEffect, moveEffect, startEffect} from "./ScrollEffect";
import {redrawDots} from "../Stroke/Dot/DotArr";
import {hideColourPreview} from "../Bubble/Bubble";
import {bottom, drawSecondTiling, drawSecondTilingHelper, drawTwo, q, secondTiling, top} from "../Tiling/Tiling3";
import {activeFillAnim, redrawAnim, stopAnim} from "../Tile/FillTile/FillAnim";
import {basicVersion} from "../Tiling/SortingHat/CompleteTile2";
import {getTileWidth} from "../Tiling/TileWidth";

export let limitScroll = 0;
let tilingC;
let invisC;
let topC;
let fillC;

export function doScroll(currY, prevY) {
    // limitScroll = tilingArrLength() <= 2 ? 0 : (sumArrayPrev() - LINE_WIDTH)
    const off = getOffsetY()
    if (off - (currY - prevY) >= limitScroll) {
        // setOffsetY(off - (currY - prevY))
        redrawCanvas().then(
            setOffsetY(off - (currY - prevY))
    )
    } else {
        setOffsetY(limitScroll)
    }
    if (isAutoScrollActive) endAutoScroll()
}

const delay = ms => new Promise(res => setTimeout(res, ms));

export let prevOffsetY = 0;
let refreshed = false;

export function setRefreshed(i) {
    refreshed = i
}

let newInvis;
let newTiling;
let newFill;
let newTop;

let offsetI = 0;
let firstStep = false;
let secondStep = false;
let thirdStep = false;
let fourthStep = false;

const scrollBackAmount = 150;
const whiteSpace = 400;

export const updateCanvasOld = (canvasId, refreshSpot) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const newCtx = newCanvas.getContext('2d');
    const h = window.innerHeight + whiteSpace
    newCtx.drawImage(canvas, 0, refreshSpot - whiteSpace - offsetI, newCanvas.width, h, 0, 0, canvas.width, h)
    // console.log('1 ' + h)
    // ctx.clearRect(0, 0, canvas.width, canvas.height );
    // ctx.drawImage(newCanvas, 0, 0, newCanvas.width, h, 0,0,newCanvas.width, h)
};

let drawn = false;

export function getStrokesTop() {
    return (top + offsetI - 100 - whiteSpace);
}
export function updateOffCanvasWrapper(){
    if(thirdStep){
        updateOffCanvas()
        updateOffCanvasHelper()
    }
}
export const updateOffCanvas = () => {
    const refreshSpot = top + offsetI - 100;
    console.log('updated')
    newFill = document.createElement('canvas');
    // newTop = document.createElement('canvas');
    newFill.width = fillC.width;
    newFill.height = fillC.height;
    const newFillCtx = newFill.getContext('2d');
    // const newTopCtx = newTop.getContext('2d');
    // Set the fill color to white
    newFillCtx.fillStyle = 'white';
    newFillCtx.fillRect(0, 0, fillC.width, fillC.height);

    const h = refreshSpot + window.innerHeight //+ 400

    newFillCtx.drawImage(fillC, 0, refreshSpot - whiteSpace - offsetI, fillC.width, h, 0, 0, fillC.width, h)
    // newTopCtx.drawImage(topC, 0, refreshSpot - 400 - offsetI, fillC.width, h, 0, 0, fillC.width, h)

    drawn = true;
}

function updateOffCanvasHelper(){
    const refreshSpot = top + offsetI - 100;
    const h = refreshSpot + window.innerHeight //+ 400
    newTop = document.createElement('canvas');
    newTop.width = fillC.width;
    newTop.height = fillC.height;
    const newTopCtx = newTop.getContext('2d');
    newTopCtx.drawImage(topC, 0, refreshSpot - whiteSpace - offsetI, fillC.width, h, 0, 0, fillC.width, h)
}

function updateCanvas() {

    // const fillCtx = fillC.getContext('2d');
    const topCtx = topC.getContext('2d');
    // fillCtx.clearRect(0, 0, fillC.width, fillC.height);
    // topCtx.clearRect(0, 0, fillC.width, fillC.height);
    // fillCtx.drawImage(newFill, 0, 0)
    topCtx.clearRect(0, 0, fillC.width, fillC.height);
    topCtx.drawImage(newTop, 0, 0)
    drawn = false;
}

function updateCanvas2() {
    const fillCtx = fillC.getContext('2d');
    fillCtx.drawImage(newFill, 0, 0)

}

function updateCanvas0() {
    const topCtx = topC.getContext('2d');
    topCtx.clearRect(0, 0, fillC.width, fillC.height);

}

const clearAndDraw = (canvasId, image) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, whiteSpace - scrollBackAmount + offsetI);
};
const updateCanvasAsync = () => {
    return new Promise((resolve, reject) => {
        updateCanvas();
        resolve();
    });
};
const updateCanvas2Async = () => {
    return new Promise((resolve, reject) => {
        updateCanvas2();
        resolve();
    });
};
const updateCanvas0Async = () => {
    return new Promise((resolve, reject) => {
        updateCanvas0();
        resolve();
    });
};

const clearAndDrawAsync = (canvasId, image) => {
    return new Promise((resolve, reject) => {
        clearAndDraw(canvasId, image);
        resolve();
    });
};

const drawSecondTilingAsync = () => {
    return new Promise((resolve, reject) => {
        drawSecondTiling();
        resolve();
    });
};

export function initializeCanv() {
    fillC = document.getElementById('fill-canvas');
    topC = document.getElementById('top-canvas');
    invisC = document.getElementById('invis-canvas');
    tilingC = document.getElementById('tiling-canvas');
}

export const redrawCanvas = async () => {
    const wrap = document.getElementById("wrapper")
    const offsetY = getOffsetY()
    const refreshSpot = top + offsetI - 100;
    if (!firstStep && offsetY > (refreshSpot / 2)) {
        console.log('first step')
        firstStep = true;
        // const invisC = document.getElementById('invis-canvas');
        // const tilingC = document.getElementById('tiling-canvas');
        newTiling = document.createElement('canvas');
        newTiling.width = invisC.width;
        newTiling.height = invisC.height;
        const newTilingCtx = newTiling.getContext('2d');
        newTilingCtx.drawImage(tilingC, 0, -(refreshSpot - scrollBackAmount));
    }
    if(!secondStep && offsetY > (refreshSpot * (3/4))){
        console.log('first .2 step')
        secondStep = true;
        newInvis = document.createElement('canvas');
        newInvis.width = invisC.width;
        newInvis.height = invisC.height;
        const newInvisCtx = newInvis.getContext('2d');
        newInvisCtx.drawImage(invisC, 0, -(refreshSpot - scrollBackAmount));

    }
    if (!thirdStep && offsetY >= (refreshSpot - 250) && !drawn){
        console.log('heyyy')
        updateOffCanvas()
        thirdStep = true;
    }
    if (!fourthStep && offsetY >= (refreshSpot - 50)){
        console.log('heyyy2')
        updateOffCanvasHelper()
        fourthStep = true;
    }
    if (offsetY >= (refreshSpot)) {
        prevOffsetY += offsetY
        console.log('redrawing')
        // updateCanvas(),
        // clearAndDraw('invis-canvas', newInvis);
        // clearAndDraw('tiling-canvas', newTiling);
        // drawSecondTiling();}
        Promise.all([
            // updateCanvas0Async(),
            updateCanvas2Async(),

            updateCanvasAsync(),
            // updateCanvas2Async(),
            clearAndDrawAsync('invis-canvas', newInvis),
            clearAndDrawAsync('tiling-canvas', newTiling),
            // drawSecondTilingAsync()
        ])
            .then(() => {
                drawSecondTiling()
                drawSecondTilingHelper()

                setOffsetY(whiteSpace + offsetI);
                wrap.style.transform = `translate(0,-${whiteSpace + offsetI}px)`
                // drawSecondTilingHelper()
                redrawAnim()
                redrawTransparentStrokes()
                redrawDottedStrokes()
                firstStep = false;
                secondStep = false;
                thirdStep = false;
                fourthStep = false;
                // drawSecondTilingHelper()

                var rectangle = document.getElementById("gradRectangle");
                rectangle.style.top = 0 + "px";
                rectangle.style.width = topC.width + "px";
                rectangle.style.height = (whiteSpace - scrollBackAmount - 1 + offsetI) + scrollBackAmount + "px";
                const position = offsetI === 0 ? '65%' : '85%'
                rectangle.style.background = "linear-gradient(to bottom, white " + position + ", rgba(255,255,255,.1)";
                offsetI = 400;

            })
            .catch((error) => {
            });

    } else {
        wrap.style.transform = `translate(0,-${offsetY}px)`;
        // moveEffect(refreshed, offsetY, prevOffsetY)}
    }
}

let i = 1;

export const redrawCanvas2 = async () => {
    const wrap = document.getElementById("wrapper")
    let offsetY = getOffsetY()
    if (offsetY > (top - TOP_PAGE_SPACE) + prevOffsetY) {
        const canvas = document.getElementById('top-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, prevOffsetY, canvas.width, top - TOP_PAGE_SPACE);
        const canvas1 = document.getElementById('fill-canvas');
        const ctx1 = canvas1.getContext('2d');
        ctx1.clearRect(0, prevOffsetY, canvas.width, top - TOP_PAGE_SPACE);
        const canvas2 = document.getElementById('tiling-canvas');
        const ctx2 = canvas2.getContext('2d');
        ctx2.clearRect(0, prevOffsetY, canvas.width, top - TOP_PAGE_SPACE);
        i++;
        prevOffsetY += offsetY
        drawSecondTiling();


    } else {
        wrap.style.transform = `translate(0,-${offsetY}px)`;
        // moveEffect(refreshed, offsetY, prevOffsetY)}
    }
}

let d = SCROLL_DIST

export function startScroll(ySpeed, prevCursorY, cursorY) {
    // startEffect(prevCursorY, cursorY)
    hideColourPreview()
    // console.log(ySpeed)
    if ((ySpeed < 50 || !isSlowScrollOn()) && d === SCROLL_DIST) {
        requestAnimationFrame(() => {
            doScroll(cursorY, prevCursorY);
        });
    } else {
        if (cursorY < prevCursorY) {
            d > 0 ? d -= SCROLL_DELTA * d : d = 0
            requestAnimationFrame(() => {
                doScroll(prevCursorY - d, prevCursorY);
            });
        } else if (cursorY > prevCursorY) {
            d > 0 ? d -= SCROLL_DELTA * d : d = 0
            requestAnimationFrame(() => {
                doScroll(prevCursorY + d, prevCursorY);
            });
        }
    }
}


export function endScroll() {
    d = SCROLL_DIST
}