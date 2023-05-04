import {getLineWidth} from "./StrokeWidth";
import {drawBlurryStroke, drawStroke, drawStrokeUnder} from "./DrawStroke";
import {drawShrinkingStroke} from "./ShrinkingStroke";
import {getCurrColor} from "./Color/StrokeColor";
import {redrawActiveTiles} from "../Effects/Watercolor";
import {invert, invertHue} from "../Effects/ColorTheory";
import {drawClover} from "./Dot/DrawDot";
import {pushDot, redrawTileDots} from "./Dot/DotArr";
import {setStrokeType, startStroke} from "./StrokeType";
import {redrawTransStrokesTile, refreshStrokes} from "./TransparentStroke";
import {redrawDottedStrokesTile} from "./DottedStroke";
import {getTile} from "../Tiling/Tiling2";
import {getOffsetY} from "../Scroll/Offset";

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

export function pushStroke(tile, x0, y0, x1, y1, col, lw, type) {
    const newStroke = {
        x0,
        y0,
        x1,
        y1,
        color: col,
        lineWidth: lw,
        type: type
    };
    strokeArr[tile.id] = strokeArr[tile.id] || [];
    strokeArr[tile.id].push(newStroke);
}

export function pushStrokeUnder(tile, x0, y0, x1, y1, col, lw, type) {
    const newStroke = {
        x0,
        y0,
        x1,
        y1,
        color: col,
        lineWidth: lw,
        type: type

    };
    strokeArrUnder[tile.id] = strokeArrUnder[tile.id] || [];
    strokeArrUnder[tile.id].push(newStroke);
}

export function redrawStrokes(offsetY) {
    for (let tile in strokeArrUnder) {
        let arr = strokeArrUnder[tile]
        arr.forEach(stroke => {
            setStrokeType(stroke.type)
            drawStrokeUnder(stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, stroke.lineWidth, stroke.color);
        })
    }
    for (let tileId in strokeArr) {
        redrawTileStrokes(tileId, offsetY)
    }
    // strokeArr = {};
    // strokeArrUnder = {};
}

export function redrawTileStrokes(id, offsetY) {
    if(!offsetY) offsetY = 0;
    let arr = strokeArr[id]
    console.log('arr is ' + arr)
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            console.log('i i s ' + i )
            let stroke = arr[i]
            if (stroke.y0 > offsetY) {

                if (stroke.type === "transparent") {
                    redrawTransStrokesTile(id, offsetY)
                    return
                } else if (stroke.type === "dotted") {
                    redrawDottedStrokesTile(id, offsetY)
                    return
                }
                if (stroke.endWidth) {
                    drawShrinkingStroke(stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color), stroke.lineWidth, stroke.type)
                } else {
                    if(offsetY !== 0) {
                        let ctx = document.getElementById('invis-canvas').getContext("2d");
                        offsetY = getOffsetY();
                        let invisCol = ctx.getImageData(stroke.x0, stroke.y0 - offsetY, 1, 1).data.toString()
                        let currTile = getTile(stroke.y0 - offsetY, invisCol)
                        pushStroke(currTile, stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color), stroke.lineWidth, stroke.type)
                    }
                    startStroke(id, stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color), stroke.lineWidth, stroke.type)

            }}
        }
    }
}

export function redrawTileStrokesI(tile, offsetY, invert) {
    let invertFn = invert
    let arr = strokeArrUnder[tile.id]
    arr?.forEach(stroke => {
        drawStrokeUnder(stroke.x0, stroke.y0, stroke.x1, stroke.y1, invertFn(stroke.color), stroke.lineWidth);
    })
    arr = strokeArr[tile.id]
    arr?.forEach(stroke => {
        if (stroke.endWidth) {
            drawShrinkingStroke(stroke.x0, stroke.y0, stroke.x1, stroke.y1, invertFn(stroke.color), stroke.lineWidth)
        } else {
            drawStroke(stroke.x0, stroke.y0, stroke.x1, stroke.y1, invertFn(stroke.color), stroke.lineWidth)
        }
    })
}

export function getStrokeArr() {
    return strokeArr;
}

export function getStrokeArrUnder() {
    return strokeArrUnder;
}