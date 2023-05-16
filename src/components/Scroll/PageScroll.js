import {drawBottomTiling, drawTwoTilings, refreshTilings, refreshTilings2, topSecondTiling} from "../Tiling/Tiling2";
import {redrawStrokes} from "../Stroke/StrokeType/StrokeArr";
import {redrawCompleteTiles} from "../Tile/CompleteTileArr";
import {redrawActiveTiles} from "../Effects/Watercolor";
import {setInternalOffset} from "../Tile/CompleteTile";
import {SCROLL_DELTA, SCROLL_DIST, TOP_PAGE_SPACE} from "../Constants";
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
import {drawSecondTiling, drawTwo, secondTiling, top} from "../Tiling/Tiling3";
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
export const redrawCanvas = async () => {
    const wrap = document.getElementById("wrapper")
    let offsetY = getOffsetY()
    if (offsetY > top - TOP_PAGE_SPACE) {
        // await delay(.1);
        prevOffsetY += offsetY
        const canvasIds = ['tiling-canvas', 'invis-canvas', 'fill-canvas', 'top-canvas'];
        // Create a single buffer canvas outside the loop
        const buffer = document.createElement('canvas');
        buffer.width = window.innerWidth;
        buffer.height = window.innerHeight * 4;
        const bufferCtx = buffer.getContext('2d');

// Create an array of promises for the canvas operations
        const promises = canvasIds.map(id => {
            const canvas = document.getElementById(id);
            const ctx = canvas.getContext('2d');
            return new Promise(resolve => {
                if(id !== 'tiling-canvas') bufferCtx.clearRect(0, 0, buffer.width, buffer.height);
                bufferCtx.drawImage(canvas, 0, -offsetY);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(buffer, 0, 0);
                resolve();
                bufferCtx.clearRect(0, 0, buffer.width, buffer.height);
                if(id === 'tiling-canvas') drawSecondTiling()
            });
        });

// Wait for all promises to resolve
        await Promise.all(promises);
        // drawSecondTiling();
        await delay(.5);

// Perform the actions after all promises have resolved
//         drawSecondTiling();
        setOffsetY(0);
        // drawSecondTiling();

// refreshed = true;
// redrawAnim();
        // drawSecondTiling()
        // setOffsetY(0)
        // refreshed = true;
        // redrawAnim()
    } else {
        // if(!redrawing){
        wrap.style.transform = `translate(0,-${offsetY}px)`;
        // moveEffect(refreshed, offsetY, prevOffsetY)}
    }
}



let d = SCROLL_DIST

export function startScroll(ySpeed, prevCursorY, cursorY) {
    startEffect(prevCursorY, cursorY)
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
    endEffect()
    d = SCROLL_DIST
}