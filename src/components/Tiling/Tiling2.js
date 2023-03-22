import {makeRandomTiling, drawTiling} from './TilingGenerator'
import {getTilingPathDict} from './TilingPathDict'
import {getRandomShape} from "../Tile/Shape";
import {getBoundsTiling, getRows} from "./TilingBounds";
import {getOffsetY} from "../Scroll/Offset";
import {SHAPE_COLOR, TOP_PAGE_SPACE} from "../Constants";
import { v4 as uuidv4 } from 'uuid';

import {getCurrentPathDict, getTilingIndex, sumArray, tilingArrLength} from "./TilingArr";
import {stopWatercolor} from "../Effects/Watercolor";
import {redrawStrokes} from "../Stroke/StrokeArr";
import {
    getAdjacentTiles, getGrid, getGrid2,
    getNeighbouringTiles,
    getNeighbourTiles, getOrienTiles,
    getRowCol, getTileMiddle,
    setMidpointDict
} from "./TilingProperties";
import {getRandomHSV} from "../Stroke/StrokeColor";

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
    pathArr.push(tiling);


    // let [top, bottom, left, right] = getRowCol(pathDict)
    // for(let i = 0; i< left.length ; i++){
    //     let tile = left[i]
    //     const ctx = document.getElementById('top-canvas').getContext("2d");
    //     ctx.fillStyle = 'red'
    //     ctx.fill(tile.path)
    // }
    // for(let i = 0; i< right.length ; i++){
    //     let tile = right[i]
    //     const ctx = document.getElementById('top-canvas').getContext("2d");
    //     ctx.fillStyle = 'red'
    //     ctx.fill(tile.path)
    // }
    // setMidpointDict(pathDict)
    // let neigh = getOrienTiles(Object.values(pathDict)[15])
    // let neigh = getGrid(pathDict)
    // console.log('UMMM ' + neigh)
    // let neigh = getNeighbouringTiles( Object.values(pathDict)[15], pathDict);
    // const ctx = document.getElementById('top-canvas').getContext("2d");
    // ctx.fillStyle = 'red'
    // ctx.fill(Object.values(pathDict)[0].path)
    // for(let i = 0; i< neigh.length ; i++){
        // let tile = neigh[i]
        // const ctx = document.getElementById('top-canvas').getContext("2d");
        // ctx.fillStyle = 'red'
        // ctx.fill(tile?.path)
    // }
    // console.log(neigh.length)
    // ctx.fillStyle = 'yellow'
    // ctx.fill(Object.values(pathDict)[15].path)
}

export function addTwoTilings(oldTilingArr) {
    pathArr = []
    tilingArr = []
    if (!tiling2) {
        let tiling1 = makeRandomTiling(oldTilingArr ? oldTilingArr[0] : '');
        helperTiling(tiling1);
        drawShape(yMin, yMax, pathArr[0].pathDict, oldTilingArr ? [shapePath, dimension] : null);
        thisBottom = yMax + offsetY + SPACE

    } else { // use information from second tiling
        initTiling(tiling2)
        drawShape(yMin - TOP_PAGE_SPACE, yMax, pathArr[0].pathDict)
        thisBottom = yMax - yMin + SPACE + TOP_PAGE_SPACE
    }
    tiling2 = makeRandomTiling(oldTilingArr ? oldTilingArr[1] : '');

    helperTiling(tiling2)
    nextTop = thisBottom //top of curr tiling is bottom of tilingBottom
}

function initTiling(segArr){
    let tiling = {segArr: [], pathDict: {}, grid: []}
    tiling.segArr = segArr
    tiling.pathDict = getTilingPathDict(segArr, offsetX, -yMin + TOP_PAGE_SPACE);
    tiling.grid = getGrid(tiling.pathDict)
    pathArr.push(tiling);
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
        id : uuidv4(),
        colors: [],
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
    // clearCanvas();

    pathArr.forEach(tiling => {
        drawTiling(tiling.pathDict)
    });
    console.log(pathArr.length)

    // let neigh = getOrienTiles(Object.values(pathDict)[15])
    // let pathDict = pathArr[0]
    // if(pathArr.length === 2){
    //     let pathDict = pathArr[0]

        // let neigh = getGrid(pathDict)
    // let neigh = getGrid(pathDict)
    //
    // // console.log('UMMM ' + neigh)
    //
    // for(let i=0;i<neigh.length;i++) {
    //     let row = neigh[i]
    //     const ctx = document.getElementById('top-canvas').getContext("2d");
    //     ctx.fillStyle = getRandomHSV()
    //     for (let j = 0; j < row.length -1; j+=2) {
    //         let tile = getTileMiddle([row[j], row[j+1]])
    //         tile.forEach(function(i) {
    //             ctx.fill(i?.path)
    //         });
    //
    //     }
        // let tile = getTileMiddle(neigh[0])
        // console.log(tile)
        // ctx.fill(tile?.path)
    // }

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