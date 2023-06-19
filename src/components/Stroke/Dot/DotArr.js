import {getLineWidth} from "../StrokeWidth";
import {getCurrColor} from "../Color/StrokeColor";
import {drawStroke, drawStrokeUnder} from "../DrawStroke";
import {drawShrinkingStroke} from "../StrokeType/ShrinkingStroke";
import {setDotType, startDot} from "./DotType";
import {findTile, pushStroke, redrawTileStrokes, strokeArr, strokeArrUnder} from "../StrokeType/StrokeArr";
import {getOffsetY} from "../../Scroll/Offset";
import {refreshStrokes} from "../StrokeType/TransparentStroke";
import {getTile} from "../../Tiling/Tiling2";


export function pushDot(id, x0, y0, x1, y1, col, lw, type) {
    const newDot = {
        x0,
        y0,
        x1,
        y1,
        color: col,
        lineWidth: lw,
        type: type,
        stroke: false
    };
    strokeArr[id] = strokeArr[id] || [];
    strokeArr[id].push(newDot);
}

export function pushDotUnder(tile, x0, y0, x1, y1) {
    const newStroke = {
        x0,
        y0,
        x1,
        y1,
        color: getCurrColor(),
        lineWidth: getLineWidth(),
        stroke: false
    };
    strokeArrUnder[tile.id] = strokeArrUnder[tile.id] || [];
    strokeArrUnder[tile.id].push(newStroke);
}

export function redrawDots(offsetY) {
    for (let id in strokeArrUnder) {
        let arr = strokeArrUnder[id]
        arr.forEach(dot => {
            setDotType(dot.type)
            startDot(id, dot.x0, dot.y0 - offsetY, dot.x1, dot.y1 - offsetY, dot.lineWidth, dot.color);
        })
    }
    for (let id in strokeArr) {
        redrawTileDots(id, offsetY)
    }
    // dotArr = {};
    // dotArrUnder = {};
}

export function redrawTileDots(id, offsetY) {
    const ctx = document.getElementById('invis-canvas').getContext("2d");
    let currTile;
    if (!offsetY) offsetY = 0
    else {
        currTile = findTile(id)
    }
    const arr = strokeArr[id]
    arr?.forEach(dot => {
        if (offsetY !== 0) {
            offsetY = getOffsetY();
            if (currTile) pushDot(currTile, dot.x0, dot.y0 - offsetY, dot.x1, dot.y1 - offsetY, (dot.color), dot.lineWidth, dot.type)
        }
        startDot(id, dot.x0, dot.y0 - offsetY, dot.x1, dot.y1 - offsetY, (dot.color), dot.lineWidth, dot.type)
    })
    if (offsetY !== 0) {
        delete strokeArr[id]
    }
}

export function redrawTileDotsI(tile, offsetY, invert) {
    let invertFn = invert
    let arr = strokeArrUnder[tile.id]
    arr?.forEach(dot => {
        drawStrokeUnder(dot.x0, dot.y0, dot.x1, dot.y1, invertFn(dot.color), dot.lineWidth);
    })
    arr = strokeArr[tile.id]
    arr?.forEach(dot => {
        drawStroke(dot.x0, dot.y0, dot.x1, dot.y1, invertFn(dot.color), dot.lineWidth)
    })
}

export function drawJustDot(tile) {
    let offsetY = 0
    const arr = strokeArr[tile.id]
    if (arr) {
        const dot = arr[arr.length - 1]
        if(dot) startDot(tile.id, dot.x0, dot.y0 - offsetY, dot.x1, dot.y1 - offsetY, (dot.color), dot.lineWidth, tile.dotType)
    }

}

export function removeLastDot(tile) {
    let arr = strokeArr[tile.id]
    if(arr){
    for (let i = arr.length - 1; i >= 0; i--) {
        if (!arr[i].stroke) {
            strokeArr[tile.id].pop();
            // redrawTileStrokes(tile.id);
            return;
        }
    }}
}