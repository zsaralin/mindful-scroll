import React from "react";
import {getAbsArray} from './Audio.js'
import {getCurrentPathDict, sumArray, tilingArrLength} from "./TilingArr";
import {getOffsetY} from "./PageScroll";

let drawings = [];

let lineWidth = 5;
let shortPause;
let longPause;
let colorChange = 15;
let color = getStrokeColor()

export function getStrokeColor() {
    return 'hsl(' + Math.ceil(360*Math.random()) + ',' + Math.floor((100-20+1) * Math.random() + 20) + '%,'  + Math.floor((90-20+1) * Math.random() + 20) + '%)'
}

function createShrinkingLine(x1, y1, x2, y2, lineWidth) {
    let endWidth = lineWidth >= 30 ? lineWidth - 10: lineWidth;
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
    let line = createShrinkingLine(x0, y0, x1, y1, theLineWidth ? theLineWidth: lineWidth)
    // lineWidth = lineWidth >= 25 ? lineWidth - 5: lineWidth;
    context.fillStyle = theColor ? theColor : color;
    context.fill(line);
}

export function reduceLineWidth(){
    lineWidth = lineWidth >= 30 ? lineWidth - 10: lineWidth;
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
            let limitScroll = tilingArrLength() <= 2 ? 0 : (2000 * (tilingArrLength() - 2))
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

const toHSLObject = hslStr => {
    const [hue, saturation, lightness] = hslStr.match(/\d+/g).map(Number);
    return { hue, saturation, lightness };
};

// changes color after a 2s pause, or changes hue slightly after a 500ms pause
export function colorDelay() {
    stopColorChange()
    let hsvArr = color.match(/\d+/g)
    if (hsvArr[0] + colorChange < 0){
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
        lineWidth += 0.1; }
}

export function resetLineWidth() {
    lineWidth = 5;
    // endWidth = 50;
}

export function getCurrColor() {
    return color
}