import {getCurrColor} from "../Stroke/StrokeColor";
import {hsl2Rgb} from "./FillRatio";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {getTileWidth} from "../Tiling/TileWidth";
import {getStrokeArr, getStrokeArrUnder, pushStrokeUnder, redrawBlurryStrokes} from "../Stroke/StrokeArr";
import {drawStrokeUnder} from "../Stroke/Stroke";
import {fillEachPixel, fillFirstColour} from "../Tile/CompleteTile";

let blurryArr = {}

export function drawBlurryStroke(x0, y0, x1, y1, theLineWidth, theColor, context) {
    context = document.getElementById('canvas').getContext("2d");
    let rgbaColor = theColor;
    if (rgbaColor.charAt(0) === 'h') {
        rgbaColor = hsl2Rgb(rgbaColor)
        rgbaColor = `rgba(${rgbaColor.join(",")},${1})`
    }
    let r = theLineWidth ? theLineWidth : getLineWidth();
    context.beginPath();
    var radialGradient = context.createRadialGradient(x0, y0, 0, x1, y1, r);
    radialGradient.addColorStop(0, rgbaColor);
    radialGradient.addColorStop(.5, rgbaColor.slice(0, rgbaColor.length - 2) + '0.3)');

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

export function redrawBlur(offsetY){
    for (let tile in blurryArr) {
        console.log('i')
        let arr = blurryArr[tile]
        arr.forEach(stroke => {
            drawBlurryStroke(stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, stroke.lineWidth, stroke.color);
        })
    }
}