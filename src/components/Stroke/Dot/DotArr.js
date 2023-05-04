import {getLineWidth} from "../StrokeWidth";
import {getCurrColor} from "../Color/StrokeColor";
import {drawStroke, drawStrokeUnder} from "../DrawStroke";
import {drawShrinkingStroke} from "../ShrinkingStroke";
import {setDotType, startDot} from "./DotType";
import {findTile, pushStroke, redrawTileStrokes} from "../StrokeArr";
import {getOffsetY} from "../../Scroll/Offset";
import {refreshStrokes} from "../TransparentStroke";
import {getTile} from "../../Tiling/Tiling2";

let dotArr = {}
let dotArrUnder = {}


export function pushDot(tile, x0, y0, x1, y1, col, lw, type) {
    const newDot = {
        x0,
        y0,
        x1,
        y1,
        color: col,
        lineWidth: lw,
        type: type
    };
    dotArr[tile.id] = dotArr[tile.id] || [];
    dotArr[tile.id].push(newDot);
}

export function pushDotUnder(tile, x0, y0, x1, y1) {
    const newStroke = {
        x0,
        y0,
        x1,
        y1,
        color: getCurrColor(),
        lineWidth: getLineWidth(),
    };
    dotArrUnder[tile.id] = dotArrUnder[tile.id] || [];
    dotArrUnder[tile.id].push(newStroke);
}

export function redrawDots(offsetY) {
    for (let id in dotArrUnder) {
        let arr = dotArrUnder[id]
        arr.forEach(dot => {
            setDotType(dot.type)
            startDot(id, dot.x0, dot.y0 - offsetY, dot.x1, dot.y1 - offsetY, dot.lineWidth, dot.color);
        })
    }
    for (let id in dotArr) {
        redrawTileDots(id, offsetY)
    }
    // dotArr = {};
    // dotArrUnder = {};
}

export function redrawTileDots(id, offsetY) {
    const ctx = document.getElementById('invis-canvas').getContext("2d");
    let currTile;
    if(!offsetY) offsetY = 0
    else{
        currTile = findTile(id)
    }
    const arr = dotArr[id]
    arr?.forEach(dot => {
        if(offsetY !== 0) {
            offsetY = getOffsetY();
            if(currTile) pushDot(currTile, dot.x0, dot.y0 - offsetY, dot.x1, dot.y1 - offsetY, (dot.color), dot.lineWidth, dot.type)
        }
        startDot(id, dot.x0, dot.y0 - offsetY, dot.x1, dot.y1 - offsetY, (dot.color), dot.lineWidth, dot.type)
    })
    if(offsetY !== 0){
        delete dotArr[id]
    }
}

export function redrawTileDotsI(tile, offsetY, invert) {
    let invertFn = invert
    let arr = dotArrUnder[tile.id]
    arr?.forEach(dot => {
        drawStrokeUnder(dot.x0, dot.y0, dot.x1, dot.y1, invertFn(dot.color), dot.lineWidth);
    })
    arr = dotArr[tile.id]
    arr?.forEach(dot => {
        drawStroke(dot.x0, dot.y0, dot.x1, dot.y1, invertFn(dot.color), dot.lineWidth)
    })
}

export function getDotArr() {
    return dotArr;
}

export function getDotArrUnder() {
    return dotArrUnder;
}

export function drawJustDot(tile) {
    const ctx = document.getElementById('top-canvas').getContext("2d");
    ctx.fillStyle = "white"
    ctx.fill(tile.path)
    console.log('EBFOREEE' + tile.id)
    redrawTileStrokes(tile.id)
    // refreshStrokes(tile, offset)
    redrawTileDots(tile.id)
}

export function removeLastDot(tile) {
    dotArr[tile.id].pop()

}