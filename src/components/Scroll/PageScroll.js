import {drawBottomTiling, drawTwoTilings, refreshTilings, refreshTilings2, topSecondTiling} from "../Tiling/Tiling2";
import {redrawStrokes} from "../Stroke/StrokeType/StrokeArr";
import {redrawActiveTiles, stopWatercolor} from "../Effects/Watercolor";
import {setInternalOffset} from "../Tile/CompleteTile";
import {BETWEEN_SPACE, paperCol, SCROLL_DELTA, SCROLL_DIST, TOP_PAGE_SPACE} from "../Constants";
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
import {redrawCanvasB} from "../BasicVersion/AddShapes";
import {hideBubble} from "../Bubble/Bubble2";
import {redrawActiveNeigh} from "../Effects/NeighTiles";
import {off} from "uikit/src/js/util";

export let limitScroll = 0;
let tilingC;
let invisC;
let topC;
let fillC;
let wrap;

export function doScroll(currY, prevY) {
    // limitScroll = tilingArrLength() <= 2 ? 0 : (sumArrayPrev() - LINE_WIDTH)
    const off = getOffsetY()
    if (off - (currY - prevY) >= limitScroll) {
        // setOffsetY(off - (currY - prevY))
        if(basicVersion){
            setOffsetY(off - (currY - prevY))
            redrawCanvasB()
            // setOffsetY(off - (currY - prevY))
        } else{
            setOffsetY(off - (currY - prevY))
            redrawCanvas()
            // .then((data) => {
            //     if (data !== false) {
            //         setOffsetY(off - (currY - prevY))
            //     }
            // })
    }
    } else {
        setOffsetY(limitScroll)
    }
    // if (isAutoScrollActive) {
    //     endAutoScroll()
    //     logAutoScrollEnd(currY)
    // }
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

export const scrollBackAmount = 600;
const whiteSpace = 600;
let refreshSpot;

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

export function updateOffCanvasWrapper() {
    if (thirdStep) {
        updateOffCanvas()
        // updateOffCanvasHelper()
    }
}

function updateCanvas() {
    const topCtx = topC.getContext('2d');
    topCtx.drawImage(newTop, 0, 0)
    drawn = false;
}

function updateCanvas2() {
    const fillCtx = fillC.getContext('2d');
    fillCtx.drawImage(newFill, 0, 0)

}

function updateCanvas0() {
    const topCtx = topC.getContext('2d');
    // topCtx.fillStyle = "red"
    topCtx.clearRect(0, 0, fillC.width, fillC.height - 0);
    // topCtx.height = refreshSpot + window.innerHeight;

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

export function initCanv() {
    fillC = document.getElementById('fill-canvas');
    topC = document.getElementById('top-canvas');
    invisC = document.getElementById('invis-canvas');
    tilingC = document.getElementById('tiling-canvas');
    wrap = document.getElementById("wrapper")
    refreshSpot = top + offsetI - 100;
}

export const redrawCanvas = async () => {
    const offsetY = getOffsetY()
    if (!firstStep && offsetY > (refreshSpot * (1 / 4))) {
        firstStep = true;

        newInvis = document.createElement('canvas');
        newTiling = document.createElement('canvas');

        newInvis.width = newTiling.width = invisC.width;
        newInvis.height = newTiling.height = refreshSpot + window.innerHeight + 120 + BETWEEN_SPACE //invisC.height;

        const newInvisCtx = newInvis.getContext('2d');
        const newTilingCtx = newTiling.getContext('2d');

        const drawTiling = () => {
            return new Promise((resolve) => {
                newTilingCtx.drawImage(tilingC, 0, -(refreshSpot - scrollBackAmount));
                resolve();
            });
        };

        const drawInvis = () => {
            return new Promise((resolve) => {
                newInvisCtx.drawImage(invisC, 0, -(refreshSpot - scrollBackAmount));
                resolve();
            });
        };

        // Measure the execution time for parallel approach
        Promise.all([drawTiling(), drawInvis()]).then(() => {
            return
            // Code to execute after both drawImage operations are complete
        });
    }
    if (!thirdStep && offsetY >= (refreshSpot * (3 / 4)) && !drawn) {
        updateOffCanvas()
        thirdStep = true;
    }
    // if (!fourthStep && offsetY >= (refreshSpot - 50)){
    //     // console.log('heyyy2')
    //     updateOffCanvasHelper()
    //     fourthStep = true;
    // }
    if (offsetY >= (refreshSpot)) {
        // prevOffsetY += offsetY
        // console.log('redrawing')
        // updateCanvas(),
        // clearAndDraw('invis-canvas', newInvis);
        // clearAndDraw('tiling-canvas', newTiling);
        // drawSecondTiling();}
        // const topCtx = topC.getContext('2d');
        // fillCtx.clearRect(0, 0, fillC.width, fillC.height);
        // topCtx.clearRect(0, 0, fillC.width, fillC.height);
        // fillCtx.drawImage(newFill, 0, 0)
        // topCtx.clearRect(0, 0, fillC.width, fillC.height);
        // setOffsetY(refreshSpot);
        // wrap.style.transform = `translate(0,-${refreshSpot}px)`
        Promise.all([
            updateCanvas0Async(),
            updateCanvas2Async(),
            updateCanvasAsync(),
            // updateCanvas2Async(),
            // clearAndDrawAsync('invis-canvas', newInvis),
            // clearAndDrawAsync('tiling-canvas', newTiling),
            // drawSecondTilingAsync()
        ])
            .then(() => {
                setOffsetY(whiteSpace + offsetI);
                wrap.style.transform = `translate(0,-${whiteSpace + offsetI}px)`
                clearAndDraw('invis-canvas', newInvis)
                clearAndDraw('tiling-canvas', newTiling)
                drawSecondTiling()


                drawSecondTilingHelper()
                redrawAnim()
                redrawTransparentStrokes()
                redrawDottedStrokes()
                // redrawActiveTiles()
                // redrawActiveNeigh()

                firstStep = false;
                secondStep = false;
                thirdStep = false;
                fourthStep = false;
                // drawSecondTilingHelper()

                // var rectangle = document.getElementById("gradRectangle");
                // rectangle.style.top = 0 + "px";
                // rectangle.style.width = topC.width + "px";
                // rectangle.style.height = (whiteSpace - scrollBackAmount - 1 + offsetI) + scrollBackAmount/2 + "px";
                // const position = offsetI === 0 ? '25%' : '70%'
                // rectangle.style.background = "linear-gradient(to bottom, white " + position + ", rgba(255,255,255,.1)";

                const tilingCtx = tilingC.getContext('2d');
                const rectangleTop = 0;
                const rectangleWidth = topC.width;
                const rectangleHeight = offsetI + 300;
                const gr = tilingCtx.createLinearGradient(0, rectangleTop, 0, rectangleHeight);
                gr.addColorStop(0, 'white');
                const position = offsetI === 0 ? .5: .7;
                gr.addColorStop(position, 'white');
                gr.addColorStop(1,'rgba(255,255,255,0)');

                // tilingCtx.fillStyle = "white";
                // tilingCtx.fillRect(0, rectangleTop, rectangleWidth, rectangleHeight);
                tilingCtx.fillStyle = gr;
                tilingCtx.fillRect(0, rectangleTop, rectangleWidth, rectangleHeight);

                offsetI = scrollBackAmount;
                refreshSpot = top + offsetI - 100;

                redrawActiveTiles()
                redrawActiveNeigh()

                return false
            })
            .catch((error) => {
            });

    } else {
        wrap.style.transform = `translate(0,-${offsetY}px)`;
        // moveEffect(refreshed, offsetY, prevOffsetY)}
    }
}

let i = 1;

export const updateOffCanvas = () => {
    console.log('updating')
    newFill = document.createElement('canvas');
    newTop = document.createElement('canvas');
    newFill.width = fillC.width;
    newFill.height = refreshSpot + window.innerHeight //+ 600 //fillC.height;
    newTop.width = fillC.width;
    newTop.height = refreshSpot + window.innerHeight//fillC.height;
    const newFillCtx = newFill.getContext('2d');
    const newTopCtx = newTop.getContext('2d');

    const h = refreshSpot + window.innerHeight * 2;

    const drawFillImage = () => {
        return new Promise((resolve) => {
            newFillCtx.fillStyle = "white";
            newFillCtx.fillRect(0, 0, fillC.width, fillC.height);
            newFillCtx.drawImage(fillC, 0, refreshSpot - whiteSpace - offsetI, fillC.width, h, 0, 0, fillC.width, h);
            resolve();
        });
    };

    const drawTopImage = () => {
        return new Promise((resolve) => {
            // newTopCtx.fillStyle = "red"
            // newTopCtx.fillRect(0, refreshSpot - whiteSpace - offsetI - scrollBackAmount, fillC.width, h, 0, 0, fillC.width, h);
                newTopCtx.drawImage(topC, 0, refreshSpot - whiteSpace - offsetI, fillC.width, h, 0, 0, fillC.width, h);
            resolve();
        });
    };

    drawn = false;
    Promise.all([drawFillImage(), drawTopImage()])
        .then(() => {
            drawn = true;
            return
        });
};
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
    hideBubble()
    // hideColourPreview()
    // console.log(ySpeed)
    if ((ySpeed < 40 || !isSlowScrollOn()) && d === SCROLL_DIST) {
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