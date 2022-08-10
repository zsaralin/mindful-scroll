import {makeRandomTiling, getYBounds, drawTiling, fillTiling, getXBounds} from './TilingGenerator'

import {getRandomShape} from "./Shape";

let tilingArr = []
let yMinArr = []
let yMaxArr = []
let pathArr = [] //array of path dict for each tiling

export function sumArray() {
    return yMaxArr.length > 0 ? yMaxArr[yMaxArr.length - 1] : 0
}

export function sumArrayPrev() {
    return yMaxArr.length > 0 ? yMaxArr[yMaxArr.length - 3] : 0
}

export function addToTilingArr() {
    let x = makeRandomTiling()
    let tiling = x.tiling;
    let edges = x.edges
    let [yMin, yMax] = getYBounds(sumArray())
    let [xMin, xMax] = getXBounds()

    let pathDict = drawTiling(-(xMin - (window.innerWidth - xMax)) / 2, yMaxArr.length > 0 ? yMaxArr[yMaxArr.length - 1] + (yMaxArr[yMaxArr.length - 1] - yMin) : -yMin + 75)
    while (pathDict === false) {
        x = makeRandomTiling()
        tiling = x.tiling;
        edges = x.edges;
        [yMin, yMax] = getYBounds(sumArray());
        [xMin, xMax] = getXBounds();
        pathDict = drawTiling(-(xMin - (window.innerWidth - xMax)) / 2, yMaxArr.length > 0 ? yMaxArr[yMaxArr.length - 1] + (yMaxArr[yMaxArr.length - 1] - yMin) : -yMin + 75);
    }
    tilingArr.push({tiling: tiling, edges: edges})

    drawRandomShape(yMin, yMax, pathDict)
    if (yMaxArr.length > 0) {
        yMinArr.push(yMin + (yMaxArr[yMaxArr.length - 1] - yMin));
        yMaxArr.push(yMax + (yMaxArr[yMaxArr.length - 1] - yMin) + 400)
    } else {
        yMinArr.push(yMin)
        yMaxArr.push(yMax - yMin + 500)
    }
    pathArr.push(pathDict);
}

export function redrawTilings() {
    let q = tilingArr.length > 2 ? tilingArr.length - 2 : 0 // limit scroll to current and previous tiling
    // let q = 0;
    for (let i = q; i < tilingArr.length; i++) {
        fillTiling(pathArr[i])
    }
}

export function tilingArrLength() {
    return tilingArr.length
}

function drawRandomShape(yMin, yMax, pathDict) {
    let shapePath;
    if (yMaxArr.length > 0) {
        shapePath = getRandomShape(yMax + yMaxArr[yMaxArr.length - 1] - yMin)
    } else {
        shapePath = getRandomShape(yMax - yMin + 75)
    }
    pathDict['255,0,0'] = shapePath;
}

export function getCurrentPathDict(y) {
    for (let i = 0; i < tilingArrLength(); i++) {
        if (yMaxArr.length > 0 && y >= yMinArr[i] && y <= yMaxArr[i] + yMaxArr[i - 1] - yMinArr[i]) {
            return pathArr[i];
        } else if (y >= yMinArr[i] && y <= yMaxArr[i] - yMinArr[i] + 75) {
            return pathArr[i];
        }
    }
}