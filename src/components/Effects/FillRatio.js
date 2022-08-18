import {getCurrentPathDict, getTile, getTilingIndex} from "../Tiling/TilingArr";
import {getOffsetY} from "../PageScroll";
import {getCurrColor} from "../Stroke/StrokeColor";
import {pushCompleteTile} from "./Watercolor";

export function getFillRatio(y1, invisCol) {
    let ctx = document.getElementById('canvas').getContext("2d");
    let invisCtx = document.getElementById('invis-canvas').getContext("2d");
    let currTile = getTile(y1, invisCol)
    let tileDim = currTile.tile

    let fillRatio = [0, 0] // [filledPixels, totalPixels]
    let startX = tileDim[0] - 30;
    let startY = tileDim[2] - 30;
    let endX = tileDim[1] + 30;
    let endY = tileDim[3] + 30

    for (let x = startX; x < endX; x = x + 10) {
        for (let y = startY; y < endY; y = y + 10) {
            if (invisCtx.getImageData(x, y - getOffsetY(), 1, 1).data.toString().trim() === invisCol.trim()) {
                fillRatio[1]++;
                if (isColorMatch(ctx.getImageData(x, y - getOffsetY(), 1, 1).data, hslToRgb(getCurrColor()))) {
                    fillRatio[0]++
                }
            }
        }
    }
    return fillRatio[0] / fillRatio[1]
}

export function completeTile(y1, invisCol) {
    let currTile = getTile(y1, invisCol)
    let ctx = document.getElementById('canvas').getContext("2d");
    ctx.fillStyle = getCurrColor()
    ctx.fill(currTile.path)
    pushCompleteTile(currTile.path, getCurrColor())
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

function hslStrToArr(str) {
    str = str.substring(4, str.length - 1).replaceAll('%', '')
    return str.split(',').map(Number);
}

function hslToRgb(str) {
    let hsl = hslStrToArr(str)
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