import {makeRandomTiling, drawTiling} from './TilingGenerator'
import {getTilingPathDict} from './TilingPathDict'
import {getRandomShape} from "../Tile/Shape";
import {getBoundsTiling} from "./TilingBounds";
import {getOffsetY} from "../PageScroll";
import {SHAPE_COLOR} from "../Constants";
import {getCurrentPathDict, getTilingIndex, sumArray, tilingArrLength} from "./TilingArr";
import {stopWatercolor} from "../Effects/Watercolor";

let thisBottom; // bottom of current tiling
let nextTop; // top of next tiling
const SPACE = 500; // space between tilings
const TOP_SPACE = 75;
let pathArr = [] //array of path dict for each tiling
let offsetX, offsetY;
let tiling2;
let xMin, xMax, yMin, yMax;

export function topSecondTiling() { //top of second tiling
    return nextTop;
}

function helperTiling(t) {
    let pathDict;
    [xMin, xMax, yMin, yMax] = getBoundsTiling(t);
    offsetX = -(xMin - (window.innerWidth - xMax)) / 2;

    if (!tiling2) {
        offsetY = -yMin + TOP_SPACE;
    } else {
        offsetY = thisBottom - yMin;
    }

    pathDict = getTilingPathDict(t, offsetX, offsetY);
    pathArr.push(pathDict);
}

export function addTwoTilings() {
    pathArr = []

    if (!tiling2) {
        let tiling1 = makeRandomTiling();
        helperTiling(tiling1);
        drawRandomShape(yMin, yMax, pathArr[0]);
        thisBottom = yMax + offsetY + SPACE

    } else { // use information from second tiling
        let pathDict = getTilingPathDict(tiling2, offsetX, -yMin);
        pathArr.push(pathDict);
        drawRandomShape(yMin, yMax, pathArr[0])
        thisBottom = yMax - yMin + SPACE
    }
    tiling2 = makeRandomTiling();
    helperTiling(tiling2)
    nextTop = thisBottom //top of curr tiling is bottom of tilingBottom
}

function drawRandomShape(yMin, yMax, pathDict) {
    let shapePath, dimension;
    [shapePath, dimension] = getRandomShape(!tiling2 ? yMax - yMin + TOP_SPACE : yMax - yMin + 40)
    pathDict[SHAPE_COLOR] = {
        path: shapePath,
        tile: dimension,
        filled: false,
    };
}

function clearCanvas() {
    const canvasIds = ['off-canvas', 'invis-canvas', 'canvas', 'fill-canvas'];

    canvasIds.forEach(id => {
        const canvas = document.getElementById(id);
        canvas.getContext("2d").clearRect(0, 0, window.innerWidth, window.innerHeight * 5);
    });

    stopWatercolor();
}

export function drawTwoTilings() {
    addTwoTilings()
    clearCanvas()
    pathArr.forEach(path => drawTiling(path));
}


export function getTilingIndex2(y) {
    if (y < thisBottom) return 0
    return 1
    // for (let i = 0; i < 2; i++) {
    //     if (tilingBottom.length > 0 && y >= tilingTop[i] && y <= tilingBottom[i] + tilingBottom[i - 1] - tilingTop[i]) {
    //         return i
    //     } else if (y >= tilingTop[i] && y <= tilingBottom[i]) {
    //         return i
    //     }
    // }
}

export function getTile(y1, invisCol) {
    if (invisCol) {
        let currTiling = pathArr[(getTilingIndex2(y1 + getOffsetY()))]
        return currTiling['rgb(' + invisCol.substring(0, invisCol.length - 4) + ')']
    }
}