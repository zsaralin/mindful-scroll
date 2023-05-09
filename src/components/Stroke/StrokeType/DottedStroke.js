import {hslToRgb} from "../../Effects/ColorTheory";
import {getLineWidth} from "../StrokeWidth";
import {findTile1, redrawStrokes, redrawTileStrokes, strokeArr} from "./StrokeArr";
import {getBoundsTile} from "../../Tiling/TilingBounds";
import {getDragging, setDragging} from "./TransparentStroke";
import {redrawDots, redrawTileDots} from "../Dot/DotArr";
import {getPathWithId, getTileWithId} from "../../Tiling/TilingPathDict";
import {getTile} from "../../Tiling/Tiling2";
import {startDot} from "../Dot/DotType";

let dottedStrokes = {}

export function drawDottedStroke(id, x0, y0, x1, y1, theColor, theLineWidth, offset, context) {
    let dragging = getDragging()
    if (!dragging) {
        if (dottedStrokes[id] === undefined) {
            dottedStrokes[id] = []
        }
        dottedStrokes[id].push([{x: x0, y: y0}]);
        setDragging(true)
        refreshDotted(id)
        return
    }
    dottedStrokes[id][dottedStrokes[id].length - 1].push({
        x: x0,
        y: y0,
        col: theColor,
        lw: getLineWidth()
    }); // Append point to current path.
    refreshDotted(id);
}

export function refreshDotted(id) {
    const ctx = document.getElementById('top-canvas').getContext("2d");
    ctx.fillStyle = document.getElementById('fill-canvas').getContext("2d").fillStyle.toString() === "rgba(0, 0, 0, 0)" ? "white" : document.getElementById('fill-canvas').getContext("2d").fillStyle ;
    // ctx.fill(getTileWithId(id).path)
    const tile = getTileWithId(id)
    ctx.fillStyle = "white"
    ctx.fill(getTileWithId(id).path)
    if(tile.filled){
        ctx.fillStyle = tile.fillColors
        ctx.fill(getTileWithId(id).path)
    }
    redrawDottedStrokesTile(id)
    redrawTileStrokes(id) // redraw solid strokes
}

export function redrawDottedStrokes(offsetY) {
    for (const id in dottedStrokes) {
        redrawDottedStrokesTile(id, offsetY)
    }
}
export function redrawDottedStrokesTile(tileId, offsetY = 0) {
    const ctx = document.getElementById('top-canvas').getContext('2d');
    const tile = findTile1(tileId, offsetY, dottedStrokes);
    const strokes = dottedStrokes[tileId];
    if (!strokes) return;
    for (const path of strokes) {
        // if(!path.stroke){
        //     startDot(tileId, path.x0, path.y0 - offsetY, path.x1, path.y1 - offsetY, (path.color), path.lineWidth, path.type)
        // }
        if (offsetY !== 0 && path.y < offsetY) continue;
        if (path.length < 2) continue; // Need at least two points to draw a line.
        if (offsetY !== 0 && tile) {
            const currStrokes = dottedStrokes[tile.id] ??= [];
            currStrokes.push([{x: path[0].x, y: path[0].y - offsetY}]);
        }
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y - offsetY);
        for (const {x, y, col, lw} of path.slice(1)) {
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.setLineDash([1, 25]);
            ctx.lineTo(x, y - offsetY);
            if (offsetY !== 0 && tile) {
                const currStrokes = dottedStrokes[tile.id];
                currStrokes[currStrokes.length - 1].push({x, y: y - offsetY, col, lw});
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }
    redrawTileStrokes(tileId, offsetY);
}

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
    dottedStrokes[id] = dottedStrokes[id] || [];
    dottedStrokes[id].push(newDot);
}
