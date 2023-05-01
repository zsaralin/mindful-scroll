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
import {redrawTransparentStrokes} from "../Stroke/TransparentStroke";
import {redrawDottedStrokes} from "../Stroke/DottedStroke";
import {gsap} from "gsap";


export let limitScroll = 0;

let overlay = false;
let scrollFade = false;

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
let prevOffsetY = 0;
let refreshed = false;
export const redrawCanvas = async () => {
    const canvas = document.getElementById("canvas");
    const fillCanvas = document.getElementById("fill-canvas")
    const invisCanvas = document.getElementById("invis-canvas")
    const tilingCanvas = document.getElementById("tiling-canvas")
    const topCanvas = document.getElementById("top-canvas")

    const dots = document.getElementById("dots")

    let offsetY = getOffsetY()
    if (offsetY > topSecondTiling() - TOP_PAGE_SPACE + 200) {
        // await delay(.5);
        drawTwoTilings()
        copyToOnScreen(document.getElementById('off-canvas'));
        redrawStrokes(offsetY)
        redrawCompleteTiles(offsetY)
        redrawActiveTiles(offsetY)
        redrawTransparentStrokes(offsetY)
        redrawDottedStrokes(offsetY)
        redrawBlur(offsetY)
        prevOffsetY = offsetY
        setOffsetY(200)
        refreshed = true;
        // oldOffset = 0


    } else {
        [invisCanvas, canvas, fillCanvas, tilingCanvas, topCanvas, dots].forEach(canvas => {
            canvas.style.transform = `translate(0,-${offsetY}px)`;
        });
        if (scrollFade) {
            let hiddenBottom = document.getElementById("hiddenBottom")
            let hiddenTop = document.getElementById("hiddenTop")
            if (done) {
                if (refreshed) {
                    oldOffset -= prevOffsetY;
                    refreshed = false;
                }
                gsap.killTweensOf('#hiddenTop, #hiddenBottom')
                let twoPercentInPixels = (2 / 100) * window.innerHeight;
                hiddenBottom.style.bottom = -(window.innerHeight + oldOffset - twoPercentInPixels) + 'px';
                hiddenBottom.style.opacity = 1;
                hiddenTop.style.bottom = (window.innerHeight - oldOffset - twoPercentInPixels) + 'px';
                hiddenTop.style.opacity = 1;
                done = true;
            }
            hiddenBottom.style.transform = `translate(0,-${offsetY}px)`;
            hiddenTop.style.transform = `translate(0,-${offsetY}px)`;
            gsap.to('#hiddenTop, #hiddenBottom', {opacity: 0, delay: .5, duration: 10, ease: "Expo.easeNone"})

            done0 = false;
        }
    }
}
let done0 = true;


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
    // redrawStrokes(0)
    // redrawCompleteTiles()
    // redrawActiveTiles()
}

let d = SCROLL_DIST

export function startScroll(ySpeed, prevCursorY, cursorY) {

    if ((ySpeed < 10 || !isSlowScrollOn()) && d === SCROLL_DIST) {
        if (overlay) {
            if (cursorY < prevCursorY) {
                gsap.to("#overlayBottom", {opacity: 1, duration: 2})
            } else if (cursorY > prevCursorY) {
                gsap.to("#overlayTop", {opacity: 1, duration: 2})
            }
        }

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

let done = true;
let oldOffset = 0

export function endScroll() {
    if (overlay) {
        gsap.to("#overlayBottom, #overlayTop", {
            opacity: 0, duration: 5, onComplete: function () {
                gsap.set("#overlayBottom, #overlayTop", {opacity: 0});
            }
        })
    }
    done = true;
    if (scrollFade) {
        gsap.to('#hiddenTop, #hiddenBottom', {
            opacity: 0, duration: 3, ease: "Expo.easeNone", onComplete: () => {
                gsap.killTweensOf('#hiddenTop, #hiddenBottom')
            }
        })
        oldOffset = getOffsetY();
    }

    d = SCROLL_DIST
}