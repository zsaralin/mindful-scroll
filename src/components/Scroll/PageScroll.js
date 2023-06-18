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

export let limitScroll = 0;


export function doScroll(currY, prevY) {
    // limitScroll = tilingArrLength() <= 2 ? 0 : (sumArrayPrev() - LINE_WIDTH)
    if (getOffsetY() - (currY - prevY) >= limitScroll) {
        setOffsetY(getOffsetY() - (currY - prevY))
        redrawCanvas();

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

let offsetI = 0;
let firstStep = false;
let secondStep = false;
let thirdStep = false;

const scrollBackAmount = 150;

const updateCanvas = (canvasId, refreshSpot) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const newCtx = newCanvas.getContext('2d');
    const h = window.innerHeight + 400
    newCtx.drawImage(canvas, 0, refreshSpot - 400 -offsetI, newCanvas.width, h, 0,0,canvas.width, h)
    // console.log('1 ' + h)
    ctx.clearRect(0, 0, canvas.width, canvas.height );
    // ctx.drawImage(newCanvas, 0, 0, newCanvas.width, h, 0,0,newCanvas.width, h)
};

const clearAndDraw = (canvasId, image) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log('2 ' + (image.height))
    ctx.drawImage(image, 0, 400 - scrollBackAmount + offsetI);
};

export const redrawCanvas = async () => {
    const wrap = document.getElementById("wrapper")
    const offsetY = getOffsetY()
    const refreshSpot = top + offsetI - 100;
    if (!firstStep && offsetY > (refreshSpot / 2)) {
        console.log('HERE1')
        firstStep = true;
        const invisC = document.getElementById('invis-canvas');
        const tilingC = document.getElementById('tiling-canvas');
        newInvis = document.createElement('canvas');
        newTiling = document.createElement('canvas');
        newInvis.width = newTiling.width = invisC.width;
        newInvis.height = newTiling.height = invisC.height;

        const newInvisCtx = newInvis.getContext('2d');
        const newTilingCtx = newTiling.getContext('2d');

        newInvisCtx.drawImage(invisC, 0, -(refreshSpot - scrollBackAmount));
        newTilingCtx.drawImage(tilingC, 0, -(refreshSpot - scrollBackAmount));
    }
    if(!secondStep && offsetY > refreshSpot*(3/4)){
        secondStep = true;
        console.log('hihi')
        const promise1 = updateCanvas('fill-canvas', refreshSpot);
        const promise2 = updateCanvas('top-canvas', refreshSpot);

        Promise.all([promise1, promise2])
            .then(() => {
                // Code to execute after both updateCanvas calls are completed
            })
            .catch((error) => {
                // Handle any errors that occurred during the updateCanvas calls
            });
    }
    if (!thirdStep && offsetY > refreshSpot) {
        thirdStep = true;
        prevOffsetY += offsetY

        const canvasIds = ['fill-canvas', 'top-canvas'];
        // const promises = canvasIds.map(updateCanvas);
        // updateCanvas('fill-canvas', refreshSpot)
        // updateCanvas('top-canvas', refreshSpot)

        clearAndDraw('invis-canvas', newInvis);
        clearAndDraw('tiling-canvas', newTiling);

        drawSecondTiling();

        // await Promise.allSettled(promises).then(() => {
            setOffsetY(400 + offsetI);
            wrap.style.transform = `translate(0,-${400 + offsetI}px)`
            redrawAnim()
            redrawTransparentStrokes()
            redrawDottedStrokes()
            firstStep = false;
            secondStep = false;
            thirdStep = false;

            drawSecondTilingHelper()

            var rectangle = document.getElementById("gradRectangle");
            rectangle.style.top = 0 + "px";
            rectangle.style.width = document.getElementById('top-canvas').width + "px";
            rectangle.style.height = (400 - scrollBackAmount - 1 + offsetI) + scrollBackAmount + "px";
            const position = offsetI === 0 ? '65%' : '85%'
            rectangle.style.background = "linear-gradient(to bottom, white " + position + ", rgba(255,255,255,.1)";

            offsetI = 400;

        // });

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