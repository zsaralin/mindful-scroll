import {getOffsetY} from "../../Scroll/Offset";
import {getCurrColor} from "../../Stroke/Color/StrokeColor";
import {getLineWidth} from "../../Stroke/StrokeWidth";
import {useState} from "react";

import {FILL_RATIO, TOP_CANV} from "../../Constants";
import {smallOffset} from "../../Tiling/Tiling3";

let BB_PADDING = 35; // bounding box padding
let fillMin = FILL_RATIO
let strokeCanvas = TOP_CANV

export function getTotalPixelsFast(currTile){
        let tileDim = currTile.bounds
        let startX = tileDim[0] - BB_PADDING;
        let startY = tileDim[2] - BB_PADDING;
        let endX = tileDim[1] + BB_PADDING;
        let endY = tileDim[3] + BB_PADDING;

        const centerX = (tileDim[0] + tileDim[1]) / 2;
        const centerY = (tileDim[2] + tileDim[3]) / 2;
        const radius = (tileDim[1] - tileDim[0]) / 2 + BB_PADDING;

        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                if (distance <= radius && isCircleInPath(currTile.path, x, y)) {
                    currTile.inPath.push([x, y]);
                }
            }
        }
        return currTile.inPath.length
}

export function getTotalPixelsSlow(currTile) {
    const tileDim = currTile.bounds;
    const startX = tileDim[0] - BB_PADDING;
    const startY = tileDim[2] - BB_PADDING;
    const endX = tileDim[1] + BB_PADDING;
    const endY = tileDim[3] + BB_PADDING;

    const centerX = (tileDim[0] + tileDim[1]) / 2;
    const centerY = (tileDim[2] + tileDim[3]) / 2;
    const radius = (tileDim[1] - tileDim[0]) / 2 + BB_PADDING;

    let totalPixels = 0;

    for (let currentY = startY; currentY <= endY; currentY++) {
        for (let currentX = startX; currentX <= endX; currentX++) {
            const distance = Math.sqrt((currentX - centerX) ** 2 + (currentY - centerY) ** 2);
            if (distance <= radius && isCircleInPath(currTile.path, currentX, currentY)) {
                currTile.inPath.push([currentX, currentY]);
                totalPixels++;
            }
        }
    }
    return totalPixels;

}

export function isCircleInPath(path, x, y, lineWidth) {
    let ctx = document.getElementById(strokeCanvas).getContext("2d");
    let r = lineWidth ? lineWidth / 1.5 : getLineWidth() / 4
    if (ctx.isPointInPath(path, x, y) && ctx.isPointInPath(path, x + r, y + r) && ctx.isPointInPath(path, x + r, y - r) && ctx.isPointInPath(path, x - r, y - r) && ctx.isPointInPath(path, x - r, y + r)) return true
    return false
}
export function getFillRatio(currTile, offS, canv) {
    let ctx = document.getElementById(canv).getContext("2d");
    let fillRatio = [0, currTile.inPath.length === 0 ? getTotalPixelsSlow(currTile)/2 : currTile.inPath.length/2];
    let subsetSize = Math.ceil(currTile.inPath.length / 2); // Half of currTile.inPath length

    let shuffledIndices = shuffleArray(Array.from(Array(currTile.inPath.length).keys())); // Generate shuffled indices

    for (let i = 0; i < subsetSize; i++) {
        let index = shuffledIndices[i];
        let pixelData = ctx.getImageData(currTile.inPath[index][0], currTile.inPath[index][1] - offS, 1, 1).data;
        let isTransparent = pixelData[0] === 0 && pixelData[1] === 0 && pixelData[2] === 0;
        let isOpaque = pixelData[0] === 255 && pixelData[1] === 255 && pixelData[2] === 255;

        if (!isTransparent && !isOpaque) {
            fillRatio[0]++;
        }
    }

    return fillRatio[0] / fillRatio[1];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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