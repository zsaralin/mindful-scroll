import React from "react";
import {getAbsArray} from './Audio.js'
import {tilingArrLength} from "./TilingArr";

let drawings = [];
let points = []
let lineWidth = 50;
let shortPause;
let longPause;
let colorChange = 15;
let color = getStrokeColor()

export function getStrokeColor() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')';
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
}

export function drawPoint(x0, y0, theColor) {
    let context = document.getElementById('canvas').getContext("2d");
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.beginPath();
    context.fillStyle = theColor ? theColor : color;
    context.arc(x0, y0, 25, 0, 2 * Math.PI);
    context.fill()
}

export function pushPoint(x0, y0) {
    points.push({
        x0: x0,
        y0: y0,
        color: color,
        lineWidth: lineWidth
    })
}

export function removeLastPoint() {
    // points.pop()
}

export function pushStroke(x0, y0, x1, y1) {
    drawings.push({
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        color: color,
        lineWidth: lineWidth
    })
}

export function redrawStrokes(offsetX, offsetY) {
    for (let i = 0; i < drawings.length; i++) {
        const line = drawings[i];
        let x0 = toScreen(line.x0, offsetX)
        let y0 = toScreen(line.y0, offsetY)
        let x1 = toScreen(line.x1, offsetX)
        let y1 = toScreen(line.y1, offsetY)

        if (y0 >= 0 && y0 <= window.innerHeight || y1 >= 0 && y1 <= window.innerHeight) { // if in browser window
            drawStroke(x0, y0, x1, y1, line.lineWidth, line.color);
        }
        let limitScroll = tilingArrLength() <= 2 ? 0 : (2000 * (tilingArrLength() - 2))
        if (line.y0 <= limitScroll) {
            drawings.splice(i, 1)
        }
        // (1450 * (tilingArrLength() - 2) + window.innerHeight - 5))
    }
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        let x0 = toScreen(point.x0, offsetX)
        let y0 = toScreen(point.y0, offsetY)
        if (y0 >= 0 && y0 <= window.innerHeight) { // if in browser window
            drawStroke(x0, y0, point.lineWidth, point.color);
        }
    }
}

function toScreen(point, offset) {
    return (point) - offset;
}

// changes color after a 2s pause, or changes hue slightly after a 500ms pause
export function colorDelay(input) {
    stopColorChange()
    var rgb = color.match(/\d+/g);
    var i = Math.floor(Math.random() * rgb.length)
    if (parseInt(rgb[i]) + colorChange < 0) {
        colorChange = 15;
    } else if (parseInt(rgb[i]) + colorChange > 255) {
        colorChange = -15;
    }
    rgb[i] = parseInt(rgb[i]) + colorChange;
    shortPause = setTimeout(function () {
        color = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
    }, 500);

    longPause = setTimeout(function () {
        color = getStrokeColor();
    }, 2000);
}

// triggered onMouseDown / onTouchStart
export function stopColorChange() {
    clearTimeout(shortPause)
    clearTimeout(longPause)
}

export function setLineWidth(speedArr) {
    let speed = getAbsArray(speedArr)
    if ((speed[0] > 10 || speed[1] > 10) && lineWidth > 20) {
        lineWidth -= 1;
    } else if (lineWidth < 80) {
        lineWidth += 0.1;
    }
    // return lineWidth;
}

export function resetLineWidth() {
    lineWidth = 50;
}

export function getCurrColor() {
    return color
}