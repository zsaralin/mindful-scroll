import {getRandomShape, shapeType} from "./GetShape";
import {addShape} from "../Tiling/TilingPathDict";
import {bottom, pathArr, secondDrawn, tilingsDrawn, top} from "../Tiling/Tiling3";
import {drawTiling} from "../Tiling/TilingGenerator";
import {getOffsetY, setOffsetY} from "../Scroll/Offset";
import {getFillInfo} from "../Tiling/SortingHat/TilingFillType";
import {generateColourPal} from "../Stroke/Color/ColourPalette";
import {logTiling} from "../Logging/LogTilling";

let xMin, xMax, yMin, yMax;
let shapesDrawn = 0;
let newInvis;
let newTiling;
let firstStep = false;
let secondStep = false;
export let secondDrawnB = false;

let numShapes = 0;

export function drawShape(offsetY){
    const shape = getRandomShape(offsetY)
    const pathDict = addShape(shape)
    const tiling = {pathDict: pathDict}
    tiling.colourPal = generateColourPal()
    tiling.i = shapesDrawn;
    tiling.offset = [0, offsetY]
    pathArr.push(tiling);
    [xMin, xMax, yMin, yMax] = shape[1]
    tiling.fillInfo = getFillInfo()
    tiling.i = numShapes;
    numShapes++;
    if (pathArr.length === 7) {
        pathArr.shift()
    }
    drawTiling(tiling)

    logTiling(tiling.i, "null", shape[1], tiling.offset, tiling.colourPal,
        tiling.fillInfo, shapeType)
    // top = yMin;
}

const offset = 0
export function drawTwoShapes(){
    drawShape(-offset)
    drawShape(window.innerHeight/2-offset)
    drawShape(window.innerHeight-offset)
    drawShape(window.innerHeight*1.5-offset)

}

let scrollBackOff = 0;
let refresh = window.innerHeight + scrollBackOff
let scrollBack = 400//window.innerHeight/2;

export let oldOverlapB = 0;
export let overlapB = 0;
export function redrawCanvasB(){
    const offsetY = getOffsetY()
    const wrap = document.getElementById("wrapper")
    if(!firstStep && offsetY > refresh/2){
        firstStep = true;
        const invisC = document.getElementById('invis-canvas');
        const tilingC = document.getElementById('tiling-canvas');
        newInvis = document.createElement('canvas');
        newTiling = document.createElement('canvas');

        newInvis.width = newTiling.width = invisC.width;
        newInvis.height = newTiling.height = invisC.height;

        const invisCtx = newInvis.getContext('2d');
        const tilingCtx = newTiling.getContext('2d');

        invisCtx.drawImage(invisC, 0, -(refresh- scrollBack ));
        tilingCtx.drawImage(tilingC, 0, -(refresh-scrollBack));
    }
    else if(offsetY > refresh){
        const canvas = document.getElementById('top-canvas');
        const ctx = canvas.getContext('2d');

        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        const newCtx = newCanvas.getContext('2d');
        newCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(newCanvas, 0, refresh - scrollBack, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

        const clearAndDraw = (canvasId, image) => {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0,0);
        };
        var rectangle = document.getElementById("gradRectangle");
        rectangle.style.top = 0 + "px";
        rectangle.style.width = canvas.width + "px";
        rectangle.style.height = (scrollBack) + "px";
        const position = '75%'
        rectangle.style.background = "linear-gradient(to bottom, white " + position + ", rgba(255,255,255,.1)";
        setOffsetY(scrollBack);
        wrap.style.transform = `translate(0,-${scrollBack}px)`
        clearAndDraw('invis-canvas', newInvis);
        clearAndDraw('tiling-canvas', newTiling);

        firstStep = false;
        secondStep = false;

        drawShape(refresh + scrollBack - scrollBackOff)
        drawShape( refresh+window.innerHeight/2  + scrollBack- scrollBackOff)

        oldOverlapB = overlapB;
        overlapB = -(refresh - scrollBack);

        scrollBackOff = scrollBack
        refresh = window.innerHeight + scrollBack

        secondDrawnB = true;


        // drawShape(refresh+window.innerHeight)
    }
    else {
        wrap.style.transform = `translate(0,-${offsetY}px)`;
        // moveEffect(refreshed, offsetY, prevOffsetY)}
    }

}