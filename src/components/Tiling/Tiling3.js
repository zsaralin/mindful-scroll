import {drawTiling, makeRandomTiling} from "./TilingGenerator";
import {getBoundsTiling} from "./TilingBounds";
import {getTilingPathDict} from "./TilingPathDict";
import {getGrid, getTilingProp} from "./TilingProperties";
import {setTiling} from "./SortingHat";
import {getOffsetY} from "../Scroll/Offset";
import {clearCanvas, drawTwoTilings, getTilingIndex2} from "./Tiling2";
import {prevOffsetY} from "../Scroll/PageScroll";
import {TOP_PAGE_SPACE} from "../Constants";
import {getFillInfo, getFillType} from "./SortingHat/TilingFillType";

export let bottom; // bottom of current tiling
export let top; // top of next tiling
const SPACE = 150; // space between tilings
const TOP_SPACE = 75;
let pathArr = [] //array of path dict for each tiling

let offsetX, offsetY;
let xMin, xMax, yMin, yMax;
export let tilingsDrawn = 0;

export let secondDrawn = false;

export let smallOffset = 0;

export function drawTwo(pathArrI) {
    firstTiling(pathArrI?.[0]?.segArr)
    secondTiling(pathArrI?.[1]?.segArr)
    pathArr.forEach(tiling => {
        drawTiling(tiling)
        tiling.fillInfo = getFillInfo()
        // setTiling(tiling)
        // ditherTiling(6, tiling.pathDict)
    });
}

export function getOffSmall(i) {
    if (!secondDrawn) return 0
    smallOffset = i === 0 ? oldOffset[0] : 0
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
    offsetY = -yMin + TOP_SPACE;
    pathArr.push(toTiling(t));
    bottom = yMax - yMin + TOP_SPACE + SPACE
    top = bottom

    tilingsDrawn++;
}

let oldOffset = [0]

export function secondTiling(inputArr) {
    top = bottom + SPACE
    let t = makeRandomTiling(inputArr);
    [xMin, xMax, yMin, yMax] = getBoundsTiling(t);
    offsetX = -(xMin - (window.innerWidth - xMax)) / 2;
    offsetY = bottom - yMin
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
    bottom = yMax - yMin + SPACE

}

export function drawSecondTiling() {
    secondTiling()
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