import {getCurrColor} from "../Stroke/Color/StrokeColor";
import {hsl2Rgb} from "./FillTile/FillRatio";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {getTileWidth} from "../Tiling/TileWidth";
import {getStrokeArr, getStrokeArrUnder, pushStrokeUnder, redrawBlurryStrokes} from "../Stroke/StrokeArr";
import {drawStroke, drawStrokeUnder} from "../Stroke/DrawStroke";
import {fillEachPixel} from "./FillTile/FillGaps";

let blurryArr = {}

export function blurryHelper(x0, y0, x1, y1, theColor, theLineWidth, context) {
    context = document.getElementById('top-canvas').getContext("2d");
    let rgbaColor = theColor;
    if (typeof rgbaColor === 'string' && rgbaColor.charAt(0) === 'h') {
        rgbaColor = hsl2Rgb(rgbaColor)
        rgbaColor = `rgba(${rgbaColor.join(",")},${1})`
    }
    let r = theLineWidth ? theLineWidth : getLineWidth();
    context.beginPath();
    var radialGradient = context.createRadialGradient(x0, y0, 0, x0 + 1, y0 + 1, r-8);
    radialGradient.addColorStop(0, rgbaColor);
    radialGradient.addColorStop(.2, rgbaColor.slice(0, rgbaColor.length - 2) + '0.2)');
    radialGradient.addColorStop(1, rgbaColor.slice(0, rgbaColor.length - 2) + '0)');
    context.fillStyle = radialGradient;
    context.fillRect(x0 - r, y0 - r, 150, 150);
    context.closePath();
}

export function blurTile(tile) {
    let strokesUnder = getStrokeArrUnder()[tile.id]
    let strokes = getStrokeArr()[tile.id]
    if (strokesUnder) {
        strokesUnder.forEach(stroke => {
            drawBlurryStroke(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.lineWidth, stroke.color)
            pushStroke(tile, stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.lineWidth, stroke.color)
        })
    }
    strokes.forEach(stroke => {
        drawBlurryStroke(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.lineWidth, stroke.color)
        pushStroke(tile, stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.lineWidth, stroke.color)

    })
}

export function fillAndBlur(tile) {
    fillEachPixel(tile)
    blurTile(tile)
}

function pushStroke(tile, x0, y0, x1, y1, theLineWidth, theColor) {
    const newStroke = {
        x0,
        y0,
        x1,
        y1,
        color: theColor,
        lineWidth: theLineWidth,
    };
    blurryArr[tile.id] = blurryArr[tile.id] || [];
    blurryArr[tile.id].push(newStroke);
}

export function redrawBlur(offsetY) {
    for (let tile in blurryArr) {
        console.log('i')
        let arr = blurryArr[tile]
        arr.forEach(stroke => {
            drawBlurryStroke(stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, stroke.lineWidth, stroke.color);
        })
    }
}

export function drawBlurryStroke(x0, y0, x1, y1, theColor, theLineWidth, context) {

    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const xStep = (x0 < x1) ? 1 : -1;
    const yStep = (y0 < y1) ? 1 : -1;
    let x = x0;
    let y = y0;

    if (dx > dy) {
        let error = dx / 2;
        while (x !== x1) {
            blurryHelper(x,y,x,y, theColor, theLineWidth)
            error -= dy;
            if (error < 0) {
                y += yStep;
                error += dx;
            }
            x += xStep;
        }
    } else {
        let error = dy / 2;
        while (y !== y1) {
            blurryHelper(x,y,x,y, theColor, theLineWidth)
            error -= dx;
            if (error < 0) {
                x += xStep;
                error += dy;
            }
            y += yStep;
        }
    }
}





