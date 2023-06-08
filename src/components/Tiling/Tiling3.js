import {drawTiling, makeRandomTiling} from "./TilingGenerator";
import {getBoundsTiling} from "./TilingBounds";
import {getTilingPathDict} from "./TilingPathDict";
import {getGrid, getTilingProp} from "./TilingProperties";
import {setTiling} from "./SortingHat";
import {getOffsetY} from "../Scroll/Offset";
import {clearCanvas, drawTwoTilings, getTilingIndex2} from "./Tiling2";
import {prevOffsetY} from "../Scroll/PageScroll";
import {TOP_PAGE_SPACE, BETWEEN_SPACE} from "../Constants";
import {getFillInfo, getFillType} from "./SortingHat/TilingFillType";
import {checkOverlap} from "./TilingPath";

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
    console.log('before ' + Object.keys(pathArr[ 1].pathDict).length)
    checkOverlap( pathArr[0].pathDict,  pathArr[1].pathDict)
    console.log('after ' + Object.keys(pathArr[ 1].pathDict).length)

    pathArr.forEach(tiling => {
        drawTiling(tiling)
        tiling.fillInfo = getFillInfo()
        // setTiling(tiling)
        // ditherTiling(6, tiling.pathDict)
    });
}

export function getOffSmall(i) {
    if (!secondDrawn) return 0
    smallOffset = i === 0 ? oldOffset[0] - 425: 0
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
    let t = makeRandomTiling(inputArr);

    [xMin, xMax, yMin, yMax] = getBoundsTiling(t);
    offsetX = -(xMin - (window.innerWidth - xMax)) / 2;
    offsetY = -yMin + TOP_PAGE_SPACE ;
    pathArr.push(toTiling(t));
    bottom = yMax - yMin + TOP_PAGE_SPACE //+ BETWEEN_SPACE
    top = bottom

    tilingsDrawn++;
}

let oldOffset = [0]

export function secondTiling(inputArr, offset) {
    const finOffset = offset !== undefined ? offset : 400;
    top = bottom + BETWEEN_SPACE //+ finOffset ;
    let t = makeRandomTiling(inputArr);
    [xMin, xMax, yMin, yMax] = getBoundsTiling(t);
    offsetX = -(xMin - (window.innerWidth - xMax)) / 2;
    offsetY = bottom - yMin + finOffset + BETWEEN_SPACE
    console.log(oldOffset)
    if (oldOffset.length < 2) {
        oldOffset.push(offsetY + yMin);
    } else {
        oldOffset.shift();
        oldOffset.push(offsetY + yMin);
    }
    tilingsDrawn++;
    pathArr.push(toTiling(t))
    if (pathArr.length === 3) {
        pathArr.shift()
    }
    bottom = yMax - yMin + TOP_PAGE_SPACE + finOffset

}

export function drawSecondTiling() {
    secondTiling()
    console.log('before ' + Object.keys(pathArr[pathArr.length - 1].pathDict).length)
    // checkOverlap( pathArr[pathArr.length - 2].pathDict,  pathArr[pathArr.length - 1].pathDict, )
    console.log('after ' + Object.keys(pathArr[pathArr.length - 1].pathDict).length)
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
        let currTiling = pathArr[(tilingIndex(y + getOffsetY()))].pathDict//pathArr[(tilingIndex(y))].pathDict
        return currTiling['rgb(' + invisCol.substring(0, invisCol.length - 4) + ')']
    }
}

export function getTiling(y, invisCol) {
    if (invisCol) {
        return pathArr[(tilingIndex(y + getOffsetY()))]//+ getOffsetY() + prevOffsetY))]
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