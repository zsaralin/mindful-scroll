import {getLineWidth} from "./StrokeWidth";
import {drawBlurryStroke, drawStroke, drawStrokeUnder} from "./DrawStroke";
import {drawShrinkingStroke} from "./ShrinkingStroke";
import {getCurrColor} from "./Color/StrokeColor";
import {getOffsetY, limitScroll} from "../Scroll/PageScroll";
import {redrawActiveTiles} from "../Effects/Watercolor";
import {invert, invertHue} from "../Effects/ColorTheory";
import {drawClover} from "./Dot/DrawDot";
import {pushDot, redrawTileDots} from "./Dot/DotArr";

let strokeArr = {}
let strokeArrUnder = {}

export function pushShrinkingLine(tile, x0, y0, x1, y1, theColor) {
    const newStroke = {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        color: theColor,
        lineWidth: getLineWidth(),
        endWidth: getLineWidth() - 5
    }
    strokeArr[tile.id] = strokeArr[tile.id] || [];
    strokeArr[tile.id].push(newStroke);
}

// removes mistake strokes during two-finger scroll
export function removeLastStroke(touch0, touch1, offsetY) {
    const x0 = touch0.pageX;
    const y0 = touch0.pageY;
    const x1 = touch1.pageX;
    const y1 = touch1.pageY;
    if (strokeArr.length > 0) {
        let lastP = strokeArr[strokeArr.length - 1]
        if ((lastP.x0 === x0 && lastP.y0 === y0 + offsetY) ||
            ((lastP.x1 === x1 && lastP.y1 === y1 + offsetY))) {
            strokeArr.pop()
        }
    }
}

export function redrawDot(tile, offset){
    const ctx = document.getElementById('top-canvas').getContext("2d");
    ctx.fillStyle = "white"
    ctx.fill(tile.path)

    console.log(strokeArr[tile.id].length)
    let last = strokeArr[tile.id].pop()

    pushDot(tile,last.x0, last.y0, last.x1, last.y1, last.color, "clover")
    redrawTileStrokes(tile.id, offset)
    redrawTileDots(tile.id, offset)
}

export function pushStroke(tile, x0, y0, x1, y1, col) {
    const newStroke = {
        x0,
        y0,
        x1,
        y1,
        color: col,
        lineWidth: getLineWidth(),
    };
    strokeArr[tile.id] = strokeArr[tile.id] || [];
    strokeArr[tile.id].push(newStroke);
}

export function pushStrokeUnder(tile, x0, y0, x1, y1) {
    const newStroke = {
        x0,
        y0,
        x1,
        y1,
        color: getCurrColor(),
        lineWidth: getLineWidth(),
    };
    strokeArrUnder[tile.id] = strokeArrUnder[tile.id] || [];
    strokeArrUnder[tile.id].push(newStroke);
}

export function redrawStrokes(offsetY) {
    for (let tile in strokeArrUnder) {
        let arr = strokeArrUnder[tile]
        arr.forEach(stroke => {
            drawStrokeUnder(stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, stroke.lineWidth, stroke.color);
        })
    }
    for (let tile in strokeArr) {
        redrawTileStrokes(tile, offsetY)
    }
    // strokeArr = [];
    // strokeArrUnder = [];
}

export function redrawTileStrokes(tile, offsetY) {
    let arr = strokeArr[tile]
    arr?.forEach(stroke => {
            if (stroke.endWidth) {
                drawShrinkingStroke(stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color),stroke.lineWidth)
            } else drawStroke(stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color),stroke.lineWidth)
    })
}

export function redrawTileStrokesI(tile, offsetY, invert) {
    let invertFn  = invert
    let arr = strokeArrUnder[tile.id]
        arr?.forEach(stroke => {
            drawStrokeUnder(stroke.x0, stroke.y0 , stroke.x1, stroke.y1 , invertFn(stroke.color),stroke.lineWidth);
        })
    arr = strokeArr[tile.id]
    arr?.forEach(stroke => {
        if (stroke.endWidth) {
            drawShrinkingStroke(stroke.x0, stroke.y0 , stroke.x1, stroke.y1 , invertFn(stroke.color),stroke.lineWidth)
        } else {
            drawStroke(stroke.x0, stroke.y0 , stroke.x1, stroke.y1 , invertFn(stroke.color),stroke.lineWidth)
        }
    })
}

export function getStrokeArr() {
    return strokeArr;
}

export function getStrokeArrUnder() {
    return strokeArrUnder;
}