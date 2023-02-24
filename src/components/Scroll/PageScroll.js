import {drawTwoTilings, refreshTilings, refreshTilings2, topSecondTiling} from "../Tiling/Tiling2";
import {redrawStrokes, redrawStrokesNewPage} from "../Stroke/StrokeArr";
import {redrawCompleteTiles} from "../Tile/CompleteTileArr";
import {redrawActiveTiles} from "../Effects/Watercolor";
import {setInternalOffset} from "../Tile/CompleteTile";
import {SCROLL_DELTA, SCROLL_DIST, TOP_PAGE_SPACE} from "../Constants";
import {endAutoScroll, isAutoScrollActive} from "./AutoScroll";
import {getOffsetY, setOffsetY} from "./Offset";
import {isSlowScrollOn} from "./SlowScroll";
import {getOffsetTop} from "@mui/material";

let isRedrawCanv = false;

export let limitScroll = 0;

export function doScroll(currY, prevY) {
    // limitScroll = tilingArrLength() <= 2 ? 0 : (sumArrayPrev() - LINE_WIDTH)
    if (isRedrawCanv) {
        // setTimeout(function () {
        //     doScroll()
        // }, 500);
    } else if (getOffsetY() - (currY - prevY) >= limitScroll) {
        setOffsetY(getOffsetY()-(currY-prevY))
        console.log(isRedrawCanv)
        if(!isRedrawCanv) redrawCanvas();

    } else {
        setOffsetY(limitScroll)
    }
    if (isAutoScrollActive) endAutoScroll()
}

export function redrawCanvas() {
    // isRedrawCanv = true;
    const canvas = document.getElementById("canvas");
    const fillCanvas = document.getElementById("fill-canvas")
    const invisCanvas = document.getElementById("invis-canvas")
    const tilingCanvas = document.getElementById("tiling-canvas")
    let offsetY = getOffsetY()
    // console.log(offsetY)
    if (offsetY > topSecondTiling() - TOP_PAGE_SPACE - 10) {
        isRedrawCanv = true;
        // setOffsetY(0)

        // [tilingCanvas, invisCanvas, canvas, fillCanvas].forEach(canvas => {
        //     canvas.style.transform = `translate(0,-${-200}px)`;
        // });
        drawTwoTilings()
        copyToOnScreen(document.getElementById('off-canvas'));
        redrawStrokesNewPage(offsetY)
        redrawCompleteTiles(offsetY)
        redrawActiveTiles(offsetY)

        // [tilingCanvas, invisCanvas, canvas, fillCanvas].forEach(canvas => {
        //     canvas.style.transform = `translate(0,-${0}px)`;
        // });
        setOffsetY(0)
        isRedrawCanv = false;

    } else {
        [invisCanvas, canvas, fillCanvas, tilingCanvas, ].forEach(canvas => {
            canvas.style.transform = `translate(0,-${offsetY}px)`;
        });
    }
    isRedrawCanv = false;
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
    redrawStrokes()
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

export function endScroll(){
    d = SCROLL_DIST
}