import {hslToRgb} from "../Effects/ColorTheory";
import {getLineWidth} from "./StrokeWidth";
import {redrawStrokes, redrawTileStrokes} from "./StrokeArr";
import {getBoundsTile} from "../Tiling/TilingBounds";
import {getDragging, setDragging} from "./TransparentStroke";
import {redrawDots, redrawTileDots} from "./Dot/DotArr";

let dottedStrokes = {}

export function drawDottedStroke(currTile, x0, y0, x1, y1, theColor, theLineWidth, offset, context) {
    let dragging = getDragging()
    if (!dragging) {
        if (dottedStrokes[currTile.id] === undefined) {
            dottedStrokes[currTile.id] = []
        }
        dottedStrokes[currTile.id].push([{x: x0, y: y0}]);
        setDragging(true)
        refresh(currTile)
        return
    }
    dottedStrokes[currTile.id][dottedStrokes[currTile.id].length - 1].push({
        x: x0,
        y: y0,
        col: theColor,
        lw: getLineWidth()
    }); // Append point to current path.
    refresh(currTile);
}

function refresh(currTile, offsetY) {
    const ctx = document.getElementById('top-canvas').getContext("2d");
    ctx.fillStyle = "white"
    ctx.fill(currTile.path)
    redrawDottedStrokesTile(currTile.id, offsetY)
    redrawTileStrokes(currTile) // redraw solid strokes
    redrawTileDots(currTile, offsetY)
}

export function redrawDottedStrokes(offsetY) {
    for (const id in dottedStrokes) {
        redrawDottedStrokesTile(id, offsetY)
    }
}

export function redrawDottedStrokesTile(tileId, offsetY) {
    if (!offsetY) offsetY = 0
    const ctx = document.getElementById('top-canvas').getContext("2d");
    if (dottedStrokes[tileId]) {
        for (var i = 0; i < dottedStrokes[tileId].length; ++i) {
            var path = dottedStrokes[tileId][i];

            if (path.length < 1)
                continue; // Need at least two points to draw a line.

            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y - offsetY);
            for (var j = 1; j < path.length; ++j) {
                ctx.strokeStyle = path[j].col;
                ctx.lineWidth = path[j].lw
                ctx.setLineDash([1, 25]);
                ctx.lineTo(path[j].x, path[j].y - offsetY);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}
