import React from "react";
import {getAbsArray} from './Audio.js'
import {getCurrentPathDict, getTilingIndex, sumArray, sumArrayPrev, tilingArrLength} from "./TilingArr";
import {getOffsetY} from "./PageScroll";
import {LINE_WIDTH} from "./ScaleConstants";

let drawings = [];

let lineWidth = LINE_WIDTH
let shortPause;
let longPause;
let colorChange = 15;
let color = getStrokeColor()

export function getStrokeColor() {
    return 'hsl(' + Math.ceil(360 * Math.random()) + ',' + Math.floor((100 - 20 + 1) * Math.random() + 20) + '%,' + Math.floor((90 - 20 + 1) * Math.random() + 20) + '%)'
}

function createShrinkingLine(x1, y1, x2, y2, lineWidth) {
    let endWidth = lineWidth >= 30 ? lineWidth - 10 : lineWidth;
    // calculate direction vector of point 1 and 2
    const directionVectorX = x2 - x1,
        directionVectorY = y2 - y1;
    // calculate angle of perpendicular vector
    const perpendicularVectorAngle = Math.atan2(directionVectorY, directionVectorX) + Math.PI / 2;
    // construct shape
    const path = new Path2D();
    path.arc(x1, y1, lineWidth / 2, perpendicularVectorAngle, perpendicularVectorAngle + Math.PI);
    path.arc(x2, y2, endWidth / 2, perpendicularVectorAngle + Math.PI, perpendicularVectorAngle);
    path.closePath();
    return path;
}

export function drawShrinkingLine(x0, y0, x1, y1, theLineWidth, theColor) {
    let context = document.getElementById('canvas').getContext("2d");
    let line = createShrinkingLine(x0, y0, x1, y1, theLineWidth ? theLineWidth : lineWidth)
    // lineWidth = lineWidth >= 25 ? lineWidth - 5: lineWidth;
    context.fillStyle = theColor ? theColor : color;
    context.fill(line);
}

export function reduceLineWidth() {
    lineWidth = lineWidth >= 30 ? lineWidth - 10 : lineWidth;
}


export function drawStroke(x0, y0, x1, y1, theLineWidth, theColor) {
    let context = document.getElementById('canvas').getContext("2d");
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = theLineWidth ? theLineWidth : lineWidth;
    context.strokeStyle = theColor ? theColor : color;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();

    // let currTile = currTiling['rgb(0,255,0)']
    // let offset = getOffsetY()
    // let tilingCtx = document.getElementById('tiling-canvas').getContext("2d");
    // let currTiling = getCurrentPathDict(y1 + offset)
    // let currTile = currTiling['rgb(0,255,0)']
    // tilingCtx.fillStyle = theColor ? theColor : color;
    // tilingCtx.strokeStyle = 'yellow'
    // // tilingCtx.fill((currTile))
    // let col = context.getImageData(window.innerWidth/2 -75 + 25, 1100 - offset + 125 + 25,100, 100)
    //
    // // console.log(col.data.filter(v => v === 0).length/col.data.length )
    // if (col.data.filter(v => v === 0).length/col.data.length === 0){
    //     tilingCtx.fill(currTile)
    //     tilingCtx.stroke(currTile)
    // }
    // tilingCtx.putImageData(col, 115,115)
    // console.log(col.data.toString())
}

export function getFillRatio(y1, invisCol) {
    let offset = getOffsetY()
    let currTiling = getCurrentPathDict(getTilingIndex(y1 + offset))
    let currTile = currTiling['rgb(' + invisCol.substring(0, invisCol.length - 4).trim() + ')']

    let ctx = document.getElementById('canvas').getContext("2d");
    let invisCtx = document.getElementById('invis-canvas').getContext("2d");

    let tileDim = currTile.tile

    let fillRatio = [0, 0] // [filledPixels, totalPixels]
    let startX = tileDim[0] - 30;
    let startY = tileDim[2] - 30;
    let endX = tileDim[1] + 30;
    let endY = tileDim[3] + 30
    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            if (invisCtx.getImageData(x, y, 1, 1).data.toString().trim() === invisCol?.trim()) {
                fillRatio[1]++;
                // if (ctx.getImageData(x, y, 1, 1).data.toString().trim() !== "0,0,0,0") {
                //     console.log(hslToRgb(color).toString())
                console.log('after + ' + ctx.getImageData(x, y, 1, 1).data.toString().trim().substring(0, ctx.getImageData(x, y, 1, 1).data.toString().trim().length - 4))
                //     console.log('color '  + ctx.getImageData(x, y, 1, 1).data.toString().trim())
                // }
                // console.log(rgbToHsl(ctx.getImageData(x, y, 1, 1).data.toString().trim()))
                if (ctx.getImageData(x, y, 1, 1).data.toString().trim().substring(-4) === hslToRgb(color).toString()) {
                    fillRatio[0]++
                }
            }
        }
    }
    if (fillRatio[0] / fillRatio[1] > .97) {
        ctx.fill(currTile.path)
    }
    console.log(fillRatio[0] / fillRatio[1])
}

function strToArr(str){
    str = str.substring(4, str.length - 1).replaceAll('%','')
    return str.split(',').map(Number);
}

function hslToRgb(str){
    let hsl = strToArr(str)
    let h = hsl[0]; let s = hsl[1]/100; let l = hsl[2]/100
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
}

// removes mistake strokes during two-finger scroll
export function removeLastStroke(x0, y0, x1, y1, offsetY) {
    if (drawings.length > 0) {
        let lastP = drawings[drawings.length - 1]
        if (lastP.x0 === x0 && lastP.y0 === y0 + offsetY) {
            drawings.pop()
        } else if (lastP.x1 === x1 && lastP.y1 === y1 + offsetY) {
            drawings.pop();
        }
    }
}

export function pushStroke(x0, y0, x1, y1) {
    drawings.push({
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        color: color,
        lineWidth: lineWidth,
    })
}

export function pushShrinkingLine(x0, y0, x1, y1) {
    drawings.push({
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        color: color,
        lineWidth: lineWidth,
        endWidth: lineWidth - 5
    })
}

export function redrawStrokes(offsetY) {
    for (let i = 0; i < drawings.length; i++) {
        const line = drawings[i];
        let x0 = toScreen(line.x0, 0)
        let y0 = toScreen(line.y0, offsetY)
        let x1 = toScreen(line.x1, 0)
        let y1 = toScreen(line.y1, offsetY)
        if (line.endWidth) {
            drawShrinkingLine(x0, y0, x1, y1, line.lineWidth, line.color);
        } else {
            if (y0 >= 0 && y0 <= window.innerHeight || y1 >= 0 && y1 <= window.innerHeight) { // if in browser window
                drawStroke(x0, y0, x1, y1, line.lineWidth, line.color);
            }
            let limitScroll = tilingArrLength() <= 2 ? 0 : (sumArrayPrev() - LINE_WIDTH)
            if (line.y0 <= limitScroll) {
                drawings.splice(i, 1)
            }
        }
        // (1450 * (tilingArrLength() - 2) + window.innerHeight - 5))
    }
}

function toScreen(point, offset) {
    return (point) - offset;
}

// changes color after a 2s pause, or changes hue slightly after a 500ms pause
export function colorDelay() {
    stopColorChange()
    let hsvArr = color.match(/\d+/g)
    if (hsvArr[0] + colorChange < 0) {
        colorChange = 5;
    } else if (hsvArr[0] + colorChange > 360) {
        colorChange = -5;
    }
    let hue = parseInt(hsvArr[0]) + colorChange;
    shortPause = setTimeout(function () {
        color = 'hsl(' + hue + ',' + hsvArr[1] + '%,' + hsvArr[2] + '%)'
    }, 500);
    longPause = setTimeout(function () {
        color = getStrokeColor();
    }, 2000);
    // var rgb = color.match(/\d+/g);
    // var i = Math.floor(Math.random() * rgb.length)
    // if (parseInt(rgb[i]) + colorChange < 0) {
    //     colorChange = 15;
    // } else if (parseInt(rgb[i]) + colorChange > 255) {
    //     colorChange = -15;
    // }
    // rgb[i] = parseInt(rgb[i]) + colorChange;
    // shortPause = setTimeout(function () {
    //     color = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
    // }, 500);
    //
    // longPause = setTimeout(function () {
    //     color = getStrokeColor();
    // }, 2000);
}

// triggered onMouseDown / onTouchStart
export function stopColorChange() {
    clearTimeout(shortPause)
    clearTimeout(longPause)
}

export function setLineWidth() {
    if (lineWidth < 80) {
        lineWidth += 0.1;
    }
}

export function resetLineWidth() {
    lineWidth = LINE_WIDTH;
    // endWidth = 50;
}

export function getCurrColor() {
    return color
}