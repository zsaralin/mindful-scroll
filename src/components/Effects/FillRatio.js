import {getOffsetY} from "../Scroll/PageScroll";
import {getCurrColor} from "../Stroke/StrokeColor";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {useState} from "react";

import {FILL_RATIO} from "../Constants";

let BB_PADDING = 35; // bounding box padding
let fillMin = FILL_RATIO
let strokeCanvas = 'top-canvas'

function getTotalPixels(currTile) {
    let tileDim = currTile.bounds
    let startX = tileDim[0] - BB_PADDING;
    let startY = tileDim[2] - BB_PADDING;
    let endX = tileDim[1] + BB_PADDING;
    let endY = tileDim[3] + BB_PADDING;

    for (let x = startX; x < endX; x += 5) {
        for (let y = startY; y < endY; y += 5) {
            if (isCircleInPath(currTile.path, x, y)) {
                currTile.inPath.push([x, y])
            }
        }
    }
    console.log('TOTAL PIXELS ' + currTile.bounds)

    return currTile.inPath.length
}

export function isCircleInPath(path, x, y, lineWidth) {
    let ctx = document.getElementById(strokeCanvas).getContext("2d");
    let r = lineWidth ? lineWidth / 1.5 : getLineWidth() / 4
    if (ctx.isPointInPath(path, x, y) && ctx.isPointInPath(path, x + r, y + r) && ctx.isPointInPath(path, x + r, y - r) && ctx.isPointInPath(path, x - r, y - r) && ctx.isPointInPath(path, x - r, y + r)) return true
    return false
}

export function getFillRatio(currTile) {
    let ctx = document.getElementById(strokeCanvas).getContext("2d")
    let fillRatio = [0, currTile.inPath.length === 0 ? getTotalPixels(currTile) : currTile.inPath.length] // [filledPixels, totalPixels]
    currTile.inPath.forEach(i => {
        if (ctx.getImageData(i[0], i[1], 1, 1).data.toString() !== '0,0,0,0' && ctx.getImageData(i[0], i[1], 1, 1).data.toString() !== '255,255,255,255') {
            fillRatio[0]++
        }
    })
    return fillRatio[0] / fillRatio[1]
}

export function getFillRatio2(currTile) {
    let ctx = document.getElementById(strokeCanvas).getContext("2d");
    let fillRatio = [0, currTile.inPath.length === 0 ? getTotalPixels(currTile) : currTile.inPath.length] // [filledPixels, totalPixels]
    currTile.inPath.forEach(i => {
        if (ctx.getImageData(i[0], i[1], 1, 1).data.toString() !== '0,0,0,0' && ctx.getImageData(i[0], i[1], 1, 1).data.toString() !== '255,255,255,255') {
            fillRatio[0]++
        }
    })
    return fillRatio[0] / fillRatio[1]
}

function isColorMatch(col0, col1) {
    let h0 = col0[0];
    let h1 = col1[0];
    let s0 = col0[1];
    let s1 = col1[1];
    let l0 = col0[2];
    let l1 = col1[2];
    if ((h0 >= h1 - 1 && h0 <= h1 + 1) && (s0 >= s1 - 1 && s0 <= s1 + 1) && (l0 >= l1 - 1 && l0 <= l1 + 1)) {
        return true;
    }
    return false;
}

function hslStrToArr(hsl) {
    return hsl.match(/\d+/g).map(Number);
}

export function hsl2Rgb(hslStr) {
    let hsl = hslStrToArr(hslStr)
    let h = hsl[0] / 360;
    let s = hsl[1] / 100;
    let l = hsl[2] / 100
    // console.log('l ' + h)
    var r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export const changeFillMin = (event: Event, newValue: number) => {
    fillMin = newValue / 100
};

export function getFillMin() {
    return fillMin
}