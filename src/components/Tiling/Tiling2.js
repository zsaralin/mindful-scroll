import {makeRandomTiling, drawTiling} from './TilingGenerator'
import {getTilingPathDict} from './TilingPathDict'
import {getRandomShape} from "../Tile/Shape";
import {getBoundsTiling} from "./TilingBounds";
import {getOffsetY} from "../Scroll/Offset";
import {SHAPE_COLOR, TOP_PAGE_SPACE} from "../Constants";
import {getCurrentPathDict, getTilingIndex, sumArray, tilingArrLength} from "./TilingArr";
import {stopWatercolor} from "../Effects/Watercolor";
import {redrawStrokes} from "../Stroke/StrokeArr";

let thisBottom; // bottom of current tiling
let nextTop; // top of next tiling
const SPACE = 500; // space between tilings
const TOP_SPACE = 75;
let pathArr = [] //array of path dict for each tiling
let tilingArr = [] //array of tilings

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

    tilingArr.push(t)
}

export function addTwoTilings(oldTilingArr) {
    pathArr = []
    tilingArr = []
    if (!tiling2) {
        let tiling1 = makeRandomTiling(oldTilingArr ? oldTilingArr[0] : '');
        helperTiling(tiling1);
        drawShape(yMin, yMax, pathArr[0], oldTilingArr ? [shapePath, dimension]: null);
        thisBottom = yMax + offsetY + SPACE

    } else { // use information from second tiling
        let pathDict = getTilingPathDict(tiling2, offsetX, -yMin + TOP_PAGE_SPACE);
        pathArr.push(pathDict);
        tilingArr.push(tiling2)

        drawShape(yMin - TOP_PAGE_SPACE, yMax, pathArr[0])
        thisBottom = yMax - yMin + SPACE + TOP_PAGE_SPACE
    }
    tiling2 = makeRandomTiling(oldTilingArr ? oldTilingArr[1] : '');
    helperTiling(tiling2)
    nextTop = thisBottom //top of curr tiling is bottom of tilingBottom
}

let shapePath, dimension;
function drawShape(yMin, yMax, pathDict, shape = null) {
    if (shape == null) {
        [shapePath, dimension] = getRandomShape(!tiling2 ? yMax - yMin + TOP_SPACE : yMax - yMin + 40);
    }
    pathDict[SHAPE_COLOR] = {
        path: shapePath,
        tile: dimension,
        filled: false,
        firstCol: 'white',
        inPath: [],
    };
}

// function drawShape(shapePath, dimension, pathDict) {
//     pathDict[SHAPE_COLOR] = {
//         path: shapePath,
//         tile: dimension,
//         filled: false,
//         firstCol: 'white',
//         inPath: [],
//     };
// }

export function clearCanvas() {
    const canvasIds = ['off-canvas', 'canvas', 'tiling-canvas', 'invis-canvas' ,'fill-canvas'];

    canvasIds.forEach(id => {
        const canvas = document.getElementById(id);
        canvas.getContext("2d").clearRect(0, 0, window.innerWidth, window.innerHeight * 5);
    });

    // stopWatercolor();
}

export function drawTwoTilings(tilingArr) {
    clearCanvas()

    addTwoTilings(tilingArr)
    // clearCanvas();

    pathArr.forEach(path => drawTiling(path));


}

export function refreshTilings() {
    clearCanvas()
    tiling2 = undefined;
    drawTwoTilings()
}

export function refreshTilings2() {
    clearCanvas()
    tiling2 = undefined;
    drawTwoTilings(tilingArr)
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