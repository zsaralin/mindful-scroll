import React from "react";
import {getCurrentPathDict, getTilingIndex} from "../TilingArr";
import {getOffsetY} from "../PageScroll";
import {getLineWidth} from "./StrokeWidth";
import {getCurrColor} from "./StrokeColor";

export function drawStroke(x0, y0, x1, y1, theLineWidth, theColor) {
    let context = document.getElementById('canvas').getContext("2d");
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = theLineWidth ? theLineWidth : getLineWidth();
    context.strokeStyle = theColor ? theColor : getCurrColor();
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
}

export function getFillRatio(y1, invisCol) {
    let ctx = document.getElementById('canvas').getContext("2d");
    let invisCtx = document.getElementById('invis-canvas').getContext("2d");
    let currTiling = getCurrentPathDict(getTilingIndex(y1 + getOffsetY()))
    let currTile = currTiling['rgb(' + invisCol.substring(0, invisCol.length - 4).trim() + ')']
    let tileDim = currTile.tile

    let fillRatio = [0, 0] // [filledPixels, totalPixels]
    let startX = tileDim[0] - 30;
    let startY = tileDim[2] - 30;
    let endX = tileDim[1] + 30;
    let endY = tileDim[3] + 30

    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            if (invisCtx.getImageData(x, y, 1, 1).data.toString().trim() === invisCol.trim()) {
                fillRatio[1]++;
                if (isColorMatch(ctx.getImageData(x, y, 1, 1).data,hslToRgb(getCurrColor()))){
                    fillRatio[0]++
                }
            }
        }
    }
    if (fillRatio[0] / fillRatio[1] > .9) {
        ctx.fillStyle = getCurrColor()
        ctx.fill(currTile.path)
    }
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

function hslStrToArr(str){
    str = str.substring(4, str.length - 1).replaceAll('%','')
    return str.split(',').map(Number);
}

function hslToRgb(str){
    let hsl = hslStrToArr(str)
    let h = hsl[0]/360; let s = hsl[1]/100; let l = hsl[2]/100
    // console.log('l ' + h)
    var r, g, b;

    if(s === 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}