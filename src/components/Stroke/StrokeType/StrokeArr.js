import {getLineWidth} from "../StrokeWidth";
import {drawBlurryStroke, drawStroke, drawStrokeUnder} from "../DrawStroke";
import {drawShrinkingStroke} from "./ShrinkingStroke";
import {getCurrColor} from "../Color/StrokeColor";
import {redrawActiveTiles} from "../../Effects/Watercolor";
import {invert, invertHue} from "../../Effects/ColorTheory";
import {drawClover} from "../Dot/DrawDot";
import {pushDot, redrawTileDots} from "../Dot/DotArr";
import {setStrokeType, startStroke} from "./StrokeType";
import {drawTransStroke, getTransIndex, redrawTransStrokesTile, refreshStrokes} from "./TransparentStroke";
import {redrawDottedStrokesTile} from "./DottedStroke";
import {getTile} from "../../Tiling/Tiling2";
import {getOffsetY} from "../../Scroll/Offset";
import {TOP_PAGE_SPACE} from "../../Constants";
import {startDot} from "../Dot/DotType";
import {getTileWithId} from "../../Tiling/TilingPathDict";

export let strokeArr = {}
export let strokeArrUnder = {}

export function pushStroke(id, x0, y0, x1, y1, col, lw, type) {
    const newStroke = {
        x0,
        y0,
        x1,
        y1,
        color: col,
        lineWidth: lw,
        type: type,
        stroke: true,
    };
    strokeArr[id] = strokeArr[id] || [];
    strokeArr[id].push(newStroke);
}

export function pushShrinkingLine(tile, x0, y0, x1, y1, col, type) {
    const newStroke = {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        color: col,
        lineWidth: getLineWidth(),
        endWidth: getLineWidth() - 5,
        type: type,
        stroke: true,
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

export function pushStrokeUnder(tile, x0, y0, x1, y1, col, lw, type) {
    const newStroke = {
        x0,
        y0,
        x1,
        y1,
        color: col,
        lineWidth: lw,
        type: type,
        stroke: true
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
        let strokeType = getTileWithId(tileId).strokeType
        console.log('fillTye + ' + strokeType)
        if (strokeType === "reg" || strokeType === "fuzzy") redrawTileStrokes(tileId, offsetY)
        else if (strokeType === "transparent") redrawTransStrokesTile(tileId, offsetY)
        else if (strokeType === "dotted") redrawDottedStrokesTile(tileId, offsetY)
    }
        strokeArr = {};
    strokeArrUnder = {};
}

export function redrawTileStrokes(id, offsetY) {
    let currTile;
    if (!offsetY) offsetY = 0;
    else {
        currTile = findTile(id ,offsetY)
    }
    const arr = strokeArr[id]
    // if tile.strokeType === transparent
    // redrawTransStrokesTile(id,offsetY)
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            const stroke = arr[i]
            if (stroke.y0 > offsetY ) {
                if (!stroke.stroke) {
                    startDot(id, stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color), stroke.lineWidth, stroke.type)
                    if(currTile) pushDot(currTile.id, stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color), stroke.lineWidth, stroke.type)
                }
                else if (stroke.type === "reg" || stroke.type === "fuzzy"){
                    // if (stroke.type === "transparent") {
                    //     drawTransStroke(id, stroke.transIndex, offsetY)
                        // return
                    // } else if (stroke.type === "dotted") {
                    //     redrawDottedStrokesTile(id, offsetY)
                        // return
                    // }
                    if (stroke.endWidth) {
                        if (offsetY !== 0 && currTile) {
                            pushShrinkingLine(currTile.id, stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color), stroke.type)
                            drawShrinkingStroke(stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color), stroke.lineWidth, stroke.type)
                            delete strokeArr[id][i]

                        }
                    } else {

                        if (offsetY !== 0) {

                            if (currTile) {

                                pushStroke(currTile.id, stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color), stroke.lineWidth, stroke.type)
                                startStroke(id, stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color), stroke.lineWidth, stroke.type)

                                delete strokeArr[id][i]
                            }
                        }
                        // startStroke(id, stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, (stroke.color), stroke.lineWidth, stroke.type)

                    }
                }
            }
        }
        if (offsetY !== 0) {
            delete strokeArr[id];
        }
    }
}

export function redrawTileStrokesI(id, invert) {
    let invertFn = invert
    let arr = strokeArrUnder[id]
    arr?.forEach(stroke => {
        drawStrokeUnder(stroke.x0, stroke.y0, stroke.x1, stroke.y1, invertFn(stroke.color), stroke.lineWidth);
    })
    arr = strokeArr[id]
    console.log('arr ' + arr)
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

export function findTile(id, offsetY) {
    const arr = strokeArr[id]
    let currTile;
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            const stroke = arr[i]
            const ctx = document.getElementById('invis-canvas').getContext("2d");
            const invisCol = ctx.getImageData(stroke.x0, stroke.y0 - offsetY, 1, 1).data.toString()
            currTile = getTile(stroke.y0 - offsetY, invisCol)
            if (currTile) return currTile
        }
    }
    console.log('DID NOT GET TILE')
}


export function findTile1(id, offsetY, strokeArr){
    const arr = strokeArr[id]
    let currTile;
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            const stroke = arr[i][0]
            const ctx = document.getElementById('invis-canvas').getContext("2d");
            const invisCol = ctx.getImageData(stroke.x, stroke.y - offsetY, 1, 1).data.toString()
            currTile = getTile(stroke.y - offsetY, invisCol)
            if (currTile) return currTile
        }
        console.log('DID NOT GET TILE')

    }
}

