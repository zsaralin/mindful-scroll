import {getRandomShape} from "./GetShape";
import {addShape} from "../Tiling/TilingPathDict";
import {bottom, tilingsDrawn, top} from "../Tiling/Tiling3";

let xMin, xMax, yMin, yMax;
let pathArr = []
let shapesDrawn = 0;
export function drawShape(offsetY){
    const shape = getRandomShape(offsetY)
    const pathDict = addShape(shape)
    const tiling = {pathDict: pathDict}
    tiling.colourPal = [];
    tiling.i = shapesDrawn;
    pathArr.push(tiling);
    [xMin, xMax, yMin, yMax] = shape[1]
    top = yMin;
}

export function drawTwoShapes(){
    drawShape(0)
    drawShape(window.innerHeight)
}