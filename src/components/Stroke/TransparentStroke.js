import {hslToRgb} from "../Effects/ColorTheory";
import {getLineWidth} from "./StrokeWidth";
import {redrawStrokes, redrawTileStrokes} from "./StrokeArr";
import {getBoundsTile} from "../Tiling/TilingBounds";
import {redrawTileDots} from "./Dot/DotArr";
import {getPathWithId} from "../Tiling/TilingPathDict";

let transStrokes = {}
let dragging = false;

export function drawTransparentDot(id, x0, y0, x1, y1, theColor) {
    if (transStrokes[id] === undefined) transStrokes[id] = []
    transStrokes[id].push([{x: x0, y: y0}]);
    const [h, s, l] = theColor.match(/(\d+)/g);
    let rgb = hslToRgb(h, s, l)
    rgb = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .5)`;
    transStrokes[id][transStrokes[id].length - 1].push({x: x1, y: y1, col: rgb, lw: getLineWidth()}); // Append point to current path.
    console.log('lengh ' + transStrokes[id].length)
    refresh(id);
}

export function drawTransparentStroke(id, x0, y0, x1, y1, theColor, theLineWidth, offset, context) {
    if (!dragging) {
        drawTransparentDot(id, x0, y0, x1, y1, theColor)
        if (transStrokes[id] === undefined) {
            transStrokes[id] = []
            transStrokes[id].push([{x: x0, y: y0}]);
        } else {
            transStrokes[id][transStrokes[id].length - 1].push({x: x0, y: y0});
        }
        dragging = true;
        return
    }
    const [h, s, l] = theColor.match(/(\d+)/g);
    let rgb = hslToRgb(h, s, l)
    rgb = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .5)`;
    transStrokes[id][transStrokes[id].length - 1].push({x: x0, y: y0, col: rgb, lw: theLineWidth}); // Append point to current path.
    refresh(id);
}

function refresh(id) {
    const ctx = document.getElementById('top-canvas').getContext("2d");
    ctx.fillStyle = "white"
    ctx.fill(getPathWithId(id))
    redrawTransStrokesTile(id)
    redrawTileStrokes(id) // redraw solid strokes
    redrawTileDots(id)
}

export function setDragging(input) {
    dragging = input
}

export function redrawTransparentStrokes(offsetY) {
    for (const id in transStrokes) {
        redrawTransStrokesTile(id, offsetY)
    }
}

export function redrawTransStrokesTile(tileId, offsetY) {
    if (!offsetY) offsetY = 0
    const ctx = document.getElementById('top-canvas').getContext("2d");
    if (transStrokes[tileId]) {
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
}

export function getDragging() {
    return dragging
}
