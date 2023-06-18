import {drawTiling, makeRandomTiling} from "./TilingGenerator";
import {getBoundsTiling, getBoundsTiling2} from "./TilingBounds";
import {getTilingPathDict} from "./TilingPathDict";
import {getGrid, getTilingProp} from "./TilingProperties";
import {setTiling} from "./SortingHat";
import {getOffsetY} from "../Scroll/Offset";
import {clearCanvas, drawTwoTilings, getTilingIndex2} from "./Tiling2";
import {prevOffsetY} from "../Scroll/PageScroll";
import {TOP_PAGE_SPACE, BETWEEN_SPACE, SHAPE_COLOR} from "../Constants";
import {getFillInfo, getFillType} from "./SortingHat/TilingFillType";
import {checkOverlap} from "./TilingPath";
import {getRandomShape} from "../BasicVersion.js";
import {v4 as uuidv4} from "uuid";
import {basicVersion} from "./SortingHat/CompleteTile2";

export let bottom; // bottom of current tiling
export let top; // top of next tiling
let pathArr = [] //array of path dict for each tiling

let offsetX, offsetY;
let xMin, xMax, yMin, yMax;
export let tilingsDrawn = 0;

export let secondDrawn = false;

export let smallOffset = 0;

export function drawTwo(pathArrI) {
    firstTiling(pathArrI?.[0]?.segArr)
    secondTiling(pathArrI?.[1]?.segArr, 0)
    // checkOverlap( pathArr[0].pathDict,  pathArr[1].pathDict)
    // let newYmin = getBoundsTiling2(pathArr[1].pathDict)[2]
    // top = newYmin

    pathArr.forEach(tiling => {
        drawTiling(tiling)
        tiling.fillInfo = getFillInfo()
        // setTiling(tiling)
        // ditherTiling(6, tiling.pathDict)
    });
}

export function getOffSmall(i) {
    if (!secondDrawn) return 0
    console.log('is ' + currI)
    if(currI === 0){
        smallOffset = -overlapOffset - oldOverlapOffset
    }else if(currI === 1){
        smallOffset = -overlapOffset
    } else{
        smallOffset = 0;
    }
    return smallOffset
}

function toTiling(t) {
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
    return tiling
}

export function firstTiling(inputArr) {
    pathArr = []
    if(basicVersion) {
        const shape = getRandomShape(0)
        const pathDict = {}
        pathDict[SHAPE_COLOR] = {
            path: shape[0],
            bounds: shape[1],
            filled: false,
            firstCol: 'white',
            inPath: [],
            id: uuidv4(),
            colors: [],
            allColors: [],
            segArr: undefined,
        };
        const tiling = {pathDict: pathDict}
        tiling.colourPal = [];
        pathArr.push(tiling);
        [xMin, xMax, yMin, yMax] = shape[1]
        bottom = window.innerHeight + 400 - 400;
    }
    else{
        let t = makeRandomTiling(inputArr);
        [xMin, xMax, yMin, yMax] = getBoundsTiling(t);
        offsetX = -(xMin - (window.innerWidth - xMax)) / 2;
        offsetY = -yMin + TOP_PAGE_SPACE ;
        pathArr.push(toTiling(t));
        bottom = yMax - yMin + TOP_PAGE_SPACE //+ BETWEEN_SPACE
        top = bottom
    }
    tilingsDrawn++;
}

let oldOffset = [0]
export let  q  = 0;
export function secondTiling(inputArr, offset) {
    if(basicVersion) {
        const finOffset = offset !== undefined ? offset : 400;
        const shape = getRandomShape(bottom)
        const pathDict = {}
        pathDict[SHAPE_COLOR] = {
            path: shape[0],
            bounds: shape[1],
            filled: false,
            firstCol: 'white',
            inPath: [],
            id: uuidv4(),
            colors: [],
            allColors: [],
            segArr: undefined,
        };
        const tiling = {pathDict: pathDict}
        tiling.colourPal = [];
        pathArr.push(tiling);
        [xMin, xMax, yMin, yMax] = shape[1]
        offsetY = yMax //+ BETWEEN_SPACE
        top = yMin;
        bottom = window.innerHeight*2 + finOffset - 400;
    }
    else{
    const finOffset = offset !== undefined ? offset : 400;
    top = bottom + BETWEEN_SPACE //+ finOffset ;
    let t = makeRandomTiling(inputArr);
    [xMin, xMax, yMin, yMax] = getBoundsTiling(t);
    offsetX = -(xMin - (window.innerWidth - xMax)) / 2;
    offsetY = bottom - yMin + finOffset + BETWEEN_SPACE
    if (oldOffset.length < 2) {
        oldOffset.push(offsetY + yMin);
    } else {
        oldOffset.shift();
        oldOffset.push(offsetY + yMin);
    }
    tilingsDrawn++;
    pathArr.push(toTiling(t))
    if (pathArr.length === 4) {
        pathArr.shift()
    }
    bottom = yMax - yMin + TOP_PAGE_SPACE + finOffset
}}
let counter = 0;
let oldoldOverlap = 0;
let oldOverlapOffset = 0
export let overlapOffset = 0;
export function drawSecondTiling() {

    // let x = pathArr[pathArr.length - 2].bounds[3] - pathArr[pathArr.length - 2].bounds[2] ;//+ pathArr[pathArr.length-2].bounds[2];
    // if (counter < 2) {
    //     x -= 400;
    //     counter++;
    // }
    // x += BETWEEN_SPACE + TOP_PAGE_SPACE// - 100;
    oldoldOverlap = oldOverlapOffset;
    oldOverlapOffset = overlapOffset
    overlapOffset = -(top - 400 - 100) //+ BETWEEN_SPACE//-(pathArr[pathArr.length - 2].bounds[3] - pathArr[pathArr.length - 1].bounds[2])
    secondTiling()
}

export function drawSecondTilingHelper(){
    checkOverlap( pathArr[pathArr.length - 2].pathDict,  pathArr[pathArr.length - 1].pathDict, overlapOffset)
    top = getBoundsTiling2(pathArr[pathArr.length - 1].pathDict)[2] - 400
    drawTiling(pathArr[pathArr.length - 1])
    pathArr[pathArr.length - 1].fillInfo = getFillInfo()
    secondDrawn = true;
}

export function tilingIndex(y) {
    if (y < top - TOP_PAGE_SPACE) return 0
    return 1
}

// used scaledY
export function getTile(y, invisCol) {
    if (invisCol) {
        for(let i=0;i<pathArr.length;i++){
            const currTiling = pathArr[i].pathDict
            const tile = currTiling['rgb(' + invisCol.substring(0, invisCol.length - 4) + ')']
            if(tile !== undefined){
                return tile
            }
        }
        console.log('DID NOT GET TILE'
        )
        // let currTiling = pathArr[(tilingIndex(y + getOffsetY()))].pathDict//pathArr[(tilingIndex(y))].pathDict
        // return currTiling['rgb(' + invisCol.substring(0, invisCol.length - 4) + ')']
    }
}

let currI = 0;
export function getTiling(y, invisCol) {
    if (invisCol) {
        for(let i=0;i<pathArr.length;i++){
            const ret = pathArr[i]
            const currTiling = pathArr[i].pathDict
            const tile = currTiling['rgb(' + invisCol.substring(0, invisCol.length - 4) + ')']
            if(tile !== undefined){
                currI = i;
                return ret
            }
        }
    }
}

export function refreshTilings() {
    clearCanvas()
    drawTwo(pathArr)
    // firstTiling(pathArr[0]?.segArr)
    // secondTiling(pathArr[1]?.segArr)
    // pathArr.forEach(tiling => {
    //     drawTiling(tiling)
    //     setTiling(tiling)
    //     // ditherTiling(6, tiling.pathDict)
    // });}
}