import {getLineWidth} from "../StrokeWidth";
import {getCurrColor} from "../Color/StrokeColor";
import {drawStroke, drawStrokeUnder} from "../DrawStroke";
import {drawShrinkingStroke} from "../ShrinkingStroke";
import {setDotType, startDot} from "./DotType";

let dotArr = {}
let dotArrUnder = {}


export function pushDot(tile, x0, y0, x1, y1, col, type) {
    const newDot = {
        x0,
        y0,
        x1,
        y1,
        color: col,
        lineWidth: getLineWidth(),
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
    for (let tile in dotArrUnder) {
        let arr = dotArrUnder[tile]
        arr.forEach(dot => {
            setDotType(dot.type)
            startDot(tile, dot.x0, dot.y0 - offsetY, dot.x1, dot.y1 - offsetY, dot.lineWidth, dot.color);
        })
    }
    for (let tile in dotArr) {
        redrawTileDots(tile, offsetY)
    }
}

export function redrawTileDots(tile, offsetY) {
    let arr = dotArr[tile]
    console.log('LENGTH ' + arr.length)
    arr?.forEach(dot => {
        setDotType(dot.type)
        console.log('TYPE ' + dot.type)
        startDot(tile, dot.x0, dot.y0 , dot.x1, dot.y1, (dot.color),dot.lineWidth)
    })
}

export function redrawTileDotsI(tile, offsetY, invert) {
    let invertFn  = invert
    let arr = dotArrUnder[tile.id]
    arr?.forEach(dot => {
        drawStrokeUnder(dot.x0, dot.y0 , dot.x1, dot.y1 , invertFn(dot.color),dot.lineWidth);
    })
    arr = dotArr[tile.id]
    arr?.forEach(dot => {
            drawStroke(dot.x0, dot.y0 , dot.x1, dot.y1 , invertFn(dot.color),dot.lineWidth)
    })
}

export function getDotArr() {
    return dotArr;
}

export function getDotArrUnder() {
    return dotArrUnder;
}