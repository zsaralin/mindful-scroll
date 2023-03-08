import {drawTwoTilings, refreshTilings, refreshTilings2, topSecondTiling} from "../Tiling/Tiling2";
import {redrawStrokes} from "../Stroke/StrokeArr";
import {redrawCompleteTiles} from "../Tile/CompleteTileArr";
import {redrawActiveTiles} from "../Effects/Watercolor";
import {setInternalOffset} from "../Tile/CompleteTile";
import {SCROLL_DELTA, SCROLL_DIST, TOP_PAGE_SPACE} from "../Constants";
import {endAutoScroll, isAutoScrollActive} from "./AutoScroll";
import {getOffsetY, setOffsetY} from "./Offset";
import {isSlowScrollOn} from "./SlowScroll";
import {getOffsetTop} from "@mui/material";
import {redrawBlur} from "../Effects/Blur";


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

export const redrawCanvas = async () => {
    const canvas = document.getElementById("canvas");
    const fillCanvas = document.getElementById("fill-canvas")
    const invisCanvas = document.getElementById("invis-canvas")
    const tilingCanvas = document.getElementById("tiling-canvas")
    let offsetY = getOffsetY()
    if (offsetY > topSecondTiling() - TOP_PAGE_SPACE) {
        // await delay(.5);
        drawTwoTilings()
        copyToOnScreen(document.getElementById('off-canvas'));
        redrawStrokes(offsetY)
        // redrawCompleteTiles(offsetY)
        // redrawActiveTiles(offsetY)
        redrawBlur(offsetY)
        setOffsetY(0)
    } else {
        [invisCanvas, canvas, fillCanvas, tilingCanvas,].forEach(canvas => {
            canvas.style.transform = `translate(0,-${offsetY}px)`;
        });
    }
}


function copyToOnScreen(offScreenCanvas) {
    let tilingCanv = document.getElementById('tiling-canvas').getContext('2d');
    tilingCanv.drawImage(offScreenCanvas, 0, 0);
}

export function setUpCanvas() {
    drawTwoTilings()
    copyToOnScreen(document.getElementById('off-canvas'));
}

export function refreshPage() { // used when change tile width and size
    refreshTilings2()
    copyToOnScreen(document.getElementById('off-canvas'));
    redrawStrokes(0)
    redrawCompleteTiles()
    redrawActiveTiles()
}

let d = SCROLL_DIST

export function startScroll(ySpeed, prevCursorY, cursorY) {
    if ((ySpeed < 10 || !isSlowScrollOn()) && d === SCROLL_DIST) {
        doScroll(cursorY, prevCursorY);
    } else {
        if (cursorY < prevCursorY) {
            d > 0 ? d -= SCROLL_DELTA * d : d = 0
            doScroll(prevCursorY - d, prevCursorY);
        } else if (cursorY > prevCursorY) {
            d > 0 ? d -= SCROLL_DELTA * d : d = 0
            doScroll(prevCursorY + d, prevCursorY);
        }
    }
}

export function endScroll() {
    d = SCROLL_DIST
}