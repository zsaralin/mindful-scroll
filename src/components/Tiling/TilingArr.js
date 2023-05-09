import {makeRandomTiling, drawTiling} from './TilingGenerator'
import {getTilingPathDict} from './TilingPathDict'
import {getRandomShape} from "../Tile/Shape";
import {getBoundsTiling} from "./TilingBounds";
import {getOffsetY} from "../Scroll/Offset";
import {SHAPE_COLOR} from "../Constants";
import { v4 as uuidv4 } from 'uuid';

let tilingArr = []
let yMinArr = []
let yMaxArr = []
let pathArr = [] //array of path dict for each tiling

export function getYMin() {
    return yMinArr;
}

export function sumArray() {
    return yMaxArr.length > 0 ? yMaxArr[yMaxArr.length - 1] : 0
}

export function sumArrayPrev() {
    return yMaxArr.length > 0 ? yMaxArr[yMaxArr.length - 3] : 0
}

export function addToTilingArr() {
    let tiling = makeRandomTiling()
    let [xMin, xMax, yMin, yMax] = tiling.bounds; //getBoundsTiling(tiling)
    yMin += sumArray();
    yMax += sumArray();

    let offsetX = -(xMin - (window.innerWidth - xMax)) / 2;
    let pathDict = getTilingPathDict(tiling, offsetX,
        yMaxArr.length > 0 ? yMaxArr[yMaxArr.length - 1] + (yMaxArr[yMaxArr.length - 1] - yMin) : -yMin + 75)

    drawRandomShape(yMin, yMax, pathDict)

    if (yMaxArr.length > 0) {
        yMinArr.push(yMin + (yMaxArr[yMaxArr.length - 1] - yMin));
        yMaxArr.push(yMax + (yMaxArr[yMaxArr.length - 1] - yMin) + 500)
    } else {
        yMinArr.push(yMin)
        yMaxArr.push(yMax - yMin + 500)
    }
    tilingArr.push(tiling)
    pathArr.push(pathDict);
}

export function redrawTilings() {
    let q = tilingArr.length > 2 ? tilingArr.length - 2 : 0 // limit scroll to current and previous tiling
    // let q = 0;
    for (let i = q; i < tilingArr.length; i++) {
        // for (let i = q; i < 1; i++) {
        drawTiling(tilingArr[i])
    }
}

export function tilingArrLength() {
    return tilingArr.length
}

function drawRandomShape(yMin, yMax, pathDict) {
    let shapePath;
    let dimension;
    if (yMaxArr.length > 0) {
        [shapePath, dimension] = getRandomShape(yMax + yMaxArr[yMaxArr.length - 1] - yMin)
    } else {
        [shapePath, dimension] = getRandomShape(yMax - yMin + 75)
    }
    pathDict[SHAPE_COLOR] = {
        path: shapePath,
        tile: dimension,
        filled : false,
        firstCol : 'white',
        inPath : [],
        id : uuidv4(),
        colors: [],
        allColors: [],
    };
}

export function getCurrentPathDict(i) {
    return pathArr[i]
}

export function getTilingIndex(y) {
    console.log('how long ' + tilingArrLength())
    for (let i = 0; i < tilingArrLength(); i++) {
        console.log('y ' + y + ' yMinArr ' + yMinArr[i] + 'ymaxarr ' + (yMaxArr[i] + yMaxArr[i - 1] - yMinArr[i]))
        if (yMaxArr.length > 0 && y >= yMinArr[i] && y <= yMaxArr[i] + yMaxArr[i - 1] - yMinArr[i]) {
            return i
        } else if (y >= yMinArr[i] && y <= yMaxArr[i]) {
            return i
        }
    }
}


export function getOldTile(y1, invisCol) {
    if (invisCol) {

        let currTiling = getCurrentPathDict(getTilingIndex(y1 + getOffsetY()))
        if(currTiling) {
            return currTiling['rgb(' + invisCol.substring(0, invisCol.length - 4) + ')']
        }
    }
}