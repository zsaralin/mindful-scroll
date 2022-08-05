import {makeRandomTiling, getYBounds, drawTiling, fillTiling, getSegArr, getXBounds, fillTile2} from './TilingGenerator'

import Delaunator from 'delaunator';
import {getRandomShape} from "./Shape";
import {random} from "mathjs";
import {getCurrColor} from "./Stroke";
// sets transition value to 0.95 or 1.05 for segments with len == 2

let tilingArr = []
let yMinArr = []
let yMaxArr = []
let pathArr = [] //array of path dict for each tiling

let vert = [];
let nextVert;


let fillTileArr = []

export function sumArray() {
    // const yMaxSum = yMaxArr.reduce(
    //     (previousValue, currentValue) => previousValue + currentValue, 0);
    // return yMaxSum ;
    return yMaxArr.length > 0 ? yMaxArr[yMaxArr.length - 1] : 0
}

export function sumArrayPrev() {
    return yMaxArr.length > 0 ? yMaxArr[yMaxArr.length - 3] : 0
}

export function addToTilingArr() {
    let x = makeRandomTiling()
    let tiling = x.tiling;
    let edges = x.edges
    // tilingArr.push({tiling: tiling, edges: edges, transition: getRandomTransition()})
    let [yMin, yMax] = getYBounds(sumArray())
    let [xMin, xMax] = getXBounds()

    // while (yMin !== 0){
    //     x = tilingObject.makeRandomTiling()
    //     tiling = x.tiling; edges = x.edges
    //     yMin = tilingObject.getYBounds(x.tiling, x.edges)[0]
    // }
    // if (yMinArr.length > 0 && yMin < yMaxArr[yMaxArr.length-1]){
    //     yMaxArr[yMaxArr.length - 1] = yMaxArr[yMaxArr.length - 1] + (yMaxArr[yMaxArr.length-1]-yMin)}
    tilingArr.push({tiling: tiling, edges: edges})

    const pathDict = drawTiling(-(xMin - (window.innerWidth - xMax)) / 2, yMaxArr.length > 0 ? yMaxArr[yMaxArr.length - 1] + (yMaxArr[yMaxArr.length - 1] - yMin) : -yMin + 75)
    drawRandomShape(yMin, yMax, pathDict)

    // const [topVert, bottomVert] = tilingObject.findBottom(tiling, edges, yMin , yMax  , sumArray())
    // if (tilingArr.length === 1){
    //     nextVert = bottomVert;
    // }
    // else{
    //     vert.push(nextVert.concat(topVert))
    //     nextVert = bottomVert
    // }
    if (yMaxArr.length > 0) {
        yMinArr.push(yMin + (yMaxArr[yMaxArr.length - 1] - yMin));
        yMaxArr.push(yMax + (yMaxArr[yMaxArr.length - 1] - yMin) + 300)
    } else {
        yMinArr.push(yMin)
        yMaxArr.push(yMax - yMin + 400)
    }
    pathArr.push(pathDict);
}

export function redrawTilings(offsetY) {
    // var tilingCanvas = document.getElementById('tiling-canvas');
    // var tilingCtx = tilingCanvas.getContext('2d');
    // tilingCtx.fillStyle = "red"; //white transparent canvas

    // let q = tilingArr.length > 2 ? tilingArr.length - 2 : 0
    let q = 0;
    for (let i = q; i < tilingArr.length; i++) {
        if (vert.length >= 1 && vert[i] !== undefined) {
            // console.log(vert[i].toString())
            // console.log('inside of what here ' + JSON.stringify(vert[i]))
            const delaunay = Delaunator.from(vert[i])
            // console.log('trianlges ' + (delaunay.triangles))
            // console.log('triangles ' + delaunay.toString() )
            fillTiling(pathArr[i], delaunay.triangles, vert[i])
        } else {
            fillTiling(pathArr[i])
        }
        //     tilingCtx.fillRect(700, yMaxArr[i], 500, 9 )
        // tilingCtx.fillRect(50, yMinArr[i], 500, 9 )
    }
    for (let i =0;i<fillTileArr.length;i++){
        var tilingCanvas = document.getElementById('tiling-canvas');
        var tilingCtx = tilingCanvas.getContext('2d');
        // console.log('tile path ' + fillTileDict[i])
        let object = fillTileArr[i]
        tilingCtx.fillStyle = object.color
        tilingCtx.fill(new Path2D(object.path))
        tilingCtx.stroke(new Path2D(object.path))
        tilingCtx.closePath() }
    if (activeTile){
            var grd = tilingCtx.createRadialGradient(activeTile.x, activeTile.y, 25, activeTile.x , activeTile.y , activeTile.r2);
            grd.addColorStop(0, activeTile.color);
            grd.addColorStop(.5, "white");
            tilingCtx.fillStyle = grd
            tilingCtx.fill(new Path2D(activeTile.path))
            tilingCtx.stroke(new Path2D(activeTile.path))
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

let activeTile ;
export function fillTile(x, y, invisCol, r2) {
    let currColor = getCurrColor();
    var tilingCanvas = document.getElementById('tiling-canvas');
    var tilingCtx = tilingCanvas.getContext('2d');
    let currTiling = getCurrentPathDict(y)
    let currTile = currTiling['rgb(' + invisCol.slice(0, -4) + ')']
    let fillCol = setInterval(function () {
        r2++
        var grd = tilingCtx.createRadialGradient(x, y, 25, x , y , r2);
        grd.addColorStop(0, currColor);
        grd.addColorStop(.5, "white");
        tilingCtx.fillStyle = grd
        tilingCtx.fill(currTile)
        tilingCtx.stroke(currTile)
        console.log(r2)
        // if(r2> 26) fillTileArr.pop()
        // fillTileArr.push(
        //     {path: currTile,
        //         color: currColor,
        //         r2: r2, x: x, y: y
        //     }
        // )
        activeTile = {path: currTile,
                    color: currColor,
                    r2: r2, x: x, y: y
                }
        if (r2 > 1000){
            clearInterval(fillCol)
            // fillTileArr.pop()
            activeTile = null;
            fillTileArr.push(
                {path: currTile,
                    color: currColor}
            )
        }
    }, 10)
}

function getCurrentPathDict(y) {
    for (let i = 0; i < tilingArrLength(); i++) {
        if (yMaxArr.length > 0 && y >= yMinArr[i] && y <= yMaxArr[i] + yMaxArr[i - 1] - yMinArr[i]) {
            return pathArr[i];
        } else if (y >= yMinArr[i] && y <= yMaxArr[i] - yMinArr[i] + 75) {
            return pathArr[i];
        }
    }
}