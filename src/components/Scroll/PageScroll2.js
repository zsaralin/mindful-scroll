import {getOffsetY, setOffsetY} from "./Offset";
import {drawSecondTiling, drawSecondTilingHelper, top} from "../Tiling/Tiling3";
import {redrawAnim} from "../Tile/FillTile/FillAnim";
import {redrawTransparentStrokes} from "../Stroke/StrokeType/TransparentStroke";
import {redrawDottedStrokes} from "../Stroke/StrokeType/DottedStroke";

let tilingC;
let invisC;
let topC;
let fillC;
let wrap;
let rectangle;

let refreshSpot;
let offsetI = 0;
const scrollBackAmount = 150;
const whiteSpace = 400;

let firstStep = false;
let secondStep = false;
let thirdStep = false;
let fourthStep = false;

let newTiling;
let newInvis;
let newFill;
let newTop;

export function initCanv(){
    fillC = document.getElementById('fill-canvas');
    topC = document.getElementById('top-canvas');
    invisC = document.getElementById('invis-canvas');
    tilingC = document.getElementById('tiling-canvas');
    wrap = document.getElementById("wrapper")
    rectangle = document.getElementById("gradRectangle");
    refreshSpot = top + offsetI - 100;
}

export const redrawCanvas = () => {
    const offsetY = getOffsetY()
    if (!firstStep && offsetY > (refreshSpot *(1/4))) {
        drawOffTiling()
        firstStep = true;
    }
    if (!thirdStep && offsetY >= (refreshSpot * (3 / 4)) && !drawn) {
        updateOffCanvas()
        thirdStep = true;
    }
    if (!fourthStep && offsetY >= (refreshSpot - 50)) {
        updateOffCanvasHelper()
        fourthStep = true;
    }
    if (offsetY >= (refreshSpot)) {
        const topCtx = topC.getContext('2d');
        topCtx.clearRect(0, 0, fillC.width, fillC.height);
        Promise.all([
            // updateCanvas0Async(),
            updateCanvas2Async(),
            updateCanvasAsync(),
            // updateCanvas2Async(),
            // clearAndDrawAsync('invis-canvas', newInvis),
            // clearAndDrawAsync('tiling-canvas', newTiling),
            // drawSecondTilingAsync()
        ])
            .then(() => {
                clearAndDraw('invis-canvas', newInvis)
                clearAndDraw('tiling-canvas', newTiling)
                drawSecondTiling()
                drawSecondTilingHelper()

                setOffsetY(whiteSpace + offsetI);
                wrap.style.transform = `translate(0,-${whiteSpace + offsetI}px)`

                redrawAnim()
                redrawTransparentStrokes()
                redrawDottedStrokes()
                resetFlags()
                setUpGradient()

                offsetI = 400;
                refreshSpot = top + offsetI - 100;
            })
            .catch((error) => {
            });

    } else {
        wrap.style.transform = `translate(0,-${offsetY}px)`;
    }
}
export const updateOffCanvas = () => {
    newFill = document.createElement('canvas');
    newTop = document.createElement('canvas');
    newFill.width = fillC.width;
    newFill.height = fillC.height;
    newTop.width = fillC.width;
    newTop.height = fillC.height;
    const newFillCtx = newFill.getContext('2d');
    const newTopCtx = newTop.getContext('2d');
    newFillCtx.fillStyle = 'white';
    newFillCtx.fillRect(0, 0, fillC.width, fillC.height);

    const h = refreshSpot + window.innerHeight;

    const drawFillImage = () => {
        return new Promise((resolve) => {
            newFillCtx.drawImage(fillC, 0, refreshSpot - whiteSpace - offsetI, fillC.width, h, 0, 0, fillC.width, h);
            resolve();
        });
    };

    const drawTopImage = () => {
        return new Promise((resolve) => {
            newTopCtx.drawImage(topC, 0, refreshSpot - whiteSpace - offsetI, fillC.width, h, 0, 0, fillC.width, h);
            resolve();
        });
    };

    drawn = false;
    Promise.all([drawFillImage(), drawTopImage()])
        .then(() => {
            drawn = true;
        });
};

function drawOffTiling(){
    newInvis = document.createElement('canvas');
    newTiling = document.createElement('canvas');

    newInvis.width = newTiling.width = invisC.width;
    newInvis.height = newTiling.height = invisC.height;

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


function resetFlags() {
    firstStep = false;
    secondStep = false;
    thirdStep = false;
    fourthStep = false;
}

function setUpGradient() {
    rectangle.style.cssText = `
      top: 0px;
      width: ${topC.width}px;
      height: ${whiteSpace - scrollBackAmount - 1 + offsetI + scrollBackAmount}px;
      background: linear-gradient(to bottom, white ${offsetI === 0 ? '65%' : '85%'}, rgba(255,255,255,.1));
    `;
}