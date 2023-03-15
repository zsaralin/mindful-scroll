import {hslToRgb} from "../Effects/ColorTheory";
import {getLineWidth} from "./StrokeWidth";
import {redrawStrokes, redrawTileStrokes} from "./StrokeArr";
import {getBoundsTile} from "../Tiling/TilingBounds";

let transStrokes = {}
let dragging = false;

export function drawTransparentDot(currTile, x0, y0, x1, y1, theColor){
    if (transStrokes[currTile.id] === undefined) transStrokes[currTile.id] = []
    transStrokes[currTile.id].push([{x: x0, y: y0}]);
    const [h, s, l] = theColor.match(/(\d+)/g);
    let rgb = hslToRgb(h, s, l)
    rgb = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .5)`;
    transStrokes[currTile.id][transStrokes[currTile.id].length - 1].push({x: x1, y: y1, col: rgb, lw: getLineWidth()}); // Append point to current path.
    console.log('lengh ' + transStrokes[currTile.id].length)
    refresh(currTile);
}

export function drawTransparentStroke(currTile, x0, y0, x1, y1, theColor, theLineWidth, offset, context) {
    if (!dragging) {
        if (transStrokes[currTile.id] === undefined) {
            transStrokes[currTile.id] = []
            transStrokes[currTile.id].push([{x: x0, y: y0}]);
        }
        else {
            transStrokes[currTile.id][transStrokes[currTile.id].length - 1].push({x: x0, y: y0});
        }
        dragging = true;
        return
    }
    const [h, s, l] = theColor.match(/(\d+)/g);
    let rgb = hslToRgb(h, s, l)
    rgb = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .5)`;
    transStrokes[currTile.id][transStrokes[currTile.id].length - 1].push({x: x0, y: y0, col: rgb, lw: getLineWidth()}); // Append point to current path.
    refresh(currTile);
}

function refresh(currTile) {
    const ctx = document.getElementById('top-canvas').getContext("2d");
    ctx.fillStyle = "white"
    ctx.fill(currTile.path)
    refreshStrokes(currTile.id)
    redrawTileStrokes(currTile) // redraw solid strokes
}

export function setDragging(input) {
    dragging = input
}

export function redrawTransparentStrokes(offsetY) {
    for (const id in transStrokes) {
        refreshStrokes(id, offsetY)
    }
}

function refreshStrokes(tileId, offsetY){
    if(!offsetY) offsetY = 0
    const ctx = document.getElementById('top-canvas').getContext("2d");
    for (var i = 0; i < transStrokes[tileId].length; ++i) {
        var path = transStrokes[tileId][i];

        if (path.length < 1)
            continue; // Need at least two points to draw a line.

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y - offsetY);
        for (var j = 1; j < path.length; ++j) {
            ctx.strokeStyle = path[j].col;
            ctx.lineWidth = path[j].lw
            ctx.lineTo(path[j].x, path[j].y - offsetY);
        }
        ctx.stroke();
    }
}

export function getDragging(){
    return dragging
}
