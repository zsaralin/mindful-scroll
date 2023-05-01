import {makeRandomTiling, drawTiling} from './TilingGenerator'
import {getTilingPathDict} from './TilingPathDict'
import {getRandomShape} from "../Tile/Shape";
import {getBoundsTiling} from "./TilingBounds";
import {getOffsetY} from "../Scroll/Offset";
import {SHAPE_COLOR, TOP_PAGE_SPACE} from "../Constants";
import { v4 as uuidv4 } from 'uuid';
import {getGrid, getTilingProp, minMaxTile,} from "./TilingProperties";
import {getColourPal, getRandomHSV} from "../Stroke/Color/StrokeColor";
import {ditherTiling} from "./DitherTiling";

let thisBottom; // bottom of current tiling
let nextTop; // top of next tiling
const SPACE = 0//500; // space between tilings
const TOP_SPACE = 75;
let pathArr = [] //array of path dict for each tiling
let tilingArr = [] //array of tilings

let offsetX, offsetY;
let tiling2;
let xMin, xMax, yMin, yMax;
let numTilings = 0;

export function topSecondTiling() { //top of second tiling
    return nextTop;
}

function helperTiling(t) {
    [xMin, xMax, yMin, yMax] = getBoundsTiling(t);
    offsetX = -(xMin - (window.innerWidth - xMax)) / 2;

    if (!tiling2) {
        offsetY = -yMin + TOP_SPACE;
    } else {
        offsetY = thisBottom - yMin;
    }

    let tiling = {segArr: [], pathDict: {}, grid: []}
    tiling.segArr = t
    tiling.pathDict = getTilingPathDict(t, offsetX, offsetY);
    tiling.grid = getGrid(tiling.pathDict)
    tiling.bounds = [xMin, xMax, yMin, yMax]

    const [midSeg, vert, orien] = getTilingProp(tiling.pathDict);
    tiling.midSeg = midSeg;
    tiling.vert = vert;
    tiling.orien = orien;
    tiling.colourPal = [];
    // tilingArr.push(tiling)
    pathArr.push(tiling);
}

export function addTwoTilings(oldTilingArr) {
    pathArr = []
    tilingArr = []
    if (!tiling2) {
        let tiling1 = makeRandomTiling(oldTilingArr?.[0] ?? '');
        tiling1.order = numTilings;
        numTilings ++;
        tilingArr.push(tiling1)
        helperTiling(tiling1);
        // drawShape(yMin, yMax, pathArr[0].pathDict, oldTilingArr ? [shapePath, dimension] : null);
        thisBottom = yMax + offsetY + SPACE

    } else { // use information from second tiling
        initTiling(tiling2)
        // drawShape(yMin - TOP_PAGE_SPACE, yMax, pathArr[0].pathDict)
        thisBottom = yMax - yMin + SPACE + TOP_PAGE_SPACE
    }
    tiling2 = makeRandomTiling(oldTilingArr ? oldTilingArr[1] : '');
    tilingArr.push(tiling2)

    helperTiling(tiling2)
    nextTop = thisBottom //top of curr tiling is bottom of tilingBottom
}

function initTiling(segArr){
    let tiling = {segArr: [], pathDict: {}, grid: [], order: 0}
    tiling.segArr = segArr
    tiling.pathDict = getTilingPathDict(segArr, offsetX, -yMin + TOP_PAGE_SPACE);
    tiling.grid = getGrid(tiling.pathDict)
    tiling.minMaxWH = minMaxTile(tiling.pathDict)
    tiling.bounds = getBoundsTiling(segArr)
    const [midSeg, vert, orien] = getTilingProp(tiling.pathDict);
    tiling.midSeg = midSeg;
    tiling.vert = vert;
    tiling.orien = orien;
    tiling.colourPal = getColourPal();
    tiling2.order = numTilings;
    numTilings ++;
    pathArr.push(tiling);
    tilingArr.push(tiling)
}

let shapePath, dimension;
function drawShape(yMin, yMax, pathDict, shape = null) {
    // console.log(' LOOK IEEEE ' + pathDict)
    if (shape == null) {
        [shapePath, dimension] = getRandomShape(!tiling2 ? yMax - yMin + TOP_SPACE : yMax - yMin + 40);
    }
    // console.log(SHAPE_COLOR  + ' COLOR GIR')
    pathDict[SHAPE_COLOR] = {
        path: shapePath,
        bounds: dimension,
        filled: false,
        firstCol: 'white',
        inPath: [],
        id : uuidv4(),
        colors: [],
        allColors: [],
        segArr : undefined,
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
    const canvasIds = ['off-canvas', 'canvas', 'tiling-canvas', 'invis-canvas' ,'fill-canvas', 'top-canvas'];

    canvasIds.forEach(id => {
        const canvas = document.getElementById(id);
        canvas.getContext("2d").clearRect(0, 0, window.innerWidth, window.innerHeight * 5);
        if(id === 'fill-canvas'  || id === "canvas" || id === "top-canvas"){
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = "transparent"
            ctx.lineJoin = ctx.lineCap = "round"
        ctx.fillRect(0, 0, canvas.width, canvas.height )
        }
    });

    // stopWatercolor();
}

export function drawTwoTilings(tilingArr) {
    clearCanvas()
    addTwoTilings(tilingArr)
    pathArr.forEach(tiling => {
        drawTiling(tiling)
        // ditherTiling(6, tiling.pathDict)
    });

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
        let currTiling = pathArr[(getTilingIndex2(y1 + getOffsetY()))].pathDict
        return currTiling['rgb(' + invisCol.substring(0, invisCol.length - 4) + ')']
    }
}

export function getTiling(y1, invisCol) {
    if (invisCol) {
        return pathArr[(getTilingIndex2(y1 + getOffsetY()))]
    }
}