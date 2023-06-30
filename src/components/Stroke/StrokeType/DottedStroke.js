import {hslToRgb} from "../../Effects/ColorTheory";
import {getLineWidth, setLineWidth} from "../StrokeWidth";
import {findTile1, redrawStrokes, redrawTileStrokes, strokeArr} from "./StrokeArr";
import {getBoundsTile} from "../../Tiling/TilingBounds";
import {getDragging, setDragging} from "./TransparentStroke";
import {redrawDots, redrawTileDots} from "../Dot/DotArr";
import {getPathWithId, getTileWithId} from "../../Tiling/TilingPathDict";
import {getTile} from "../../Tiling/Tiling2";
import {startDot} from "../Dot/DotType";
import {getOffSmall, overlapOffset, smallOffset} from "../../Tiling/Tiling3";

let dottedStrokes = {}

export function drawDottedStroke(id, x0, y0, x1, y1, theColor, theLineWidth, offset, context) {
    let dragging = getDragging()
    if (!dragging) {
        if (dottedStrokes[id] === undefined) {
            dottedStrokes[id] = []
        }
        dottedStrokes[id].push([{x: x0, y: y0, smallOff: smallOffset}]);
        setDragging(true)
        refreshDotted(id)
        return
    }
    dottedStrokes[id][dottedStrokes[id].length - 1].push({
        x: x0,
        y: y0,
        col: theColor,
        lw: theLineWidth,
        smallOff: smallOffset,
    }); // Append point to current path.
    refreshDotted(id);
}

export function refreshDotted(id, refresh) {
    const ctx = document.getElementById('top-canvas').getContext("2d");
    ctx.fillStyle = document.getElementById('fill-canvas').getContext("2d").fillStyle.toString() === "rgba(0, 0, 0, 0)" ? "white" : document.getElementById('fill-canvas').getContext("2d").fillStyle ;
    // ctx.fill(getTileWithId(id).path)
    ctx.save()
    ctx.translate(0, -smallOffset)
    const tile = getTileWithId(id)
    ctx.fillStyle = "white"
    ctx.fill(tile.path)
    if(tile.filled || refresh){
        ctx.fillStyle = tile.fillColor
        ctx.fill(tile.path)
    }
    ctx.restore()
    redrawDottedStrokesTile(id)
}

export function redrawDottedStrokes() {
    for (const id in dottedStrokes) {
            const paths = dottedStrokes[id];
            paths.forEach((path, index) => {
                path.forEach((i) => {
                    if (i.smallOff === 0) {
                        i.y = i.y + overlapOffset;
                        i.smallOff = overlapOffset
                    } else {
                        delete dottedStrokes[id];
                        return; // Move to the next path
                    }
                });
            });
        }
}

export function redrawDottedStrokesTile(tileId, offsetY = 0) {
    const ctx = document.getElementById('top-canvas').getContext('2d');
    const tile = findTile1(tileId, offsetY, dottedStrokes);
    const strokes = dottedStrokes[tileId];
    if (!strokes) return;
    for (const path of strokes) {
        // if (offsetY !== 0 && path.y < offsetY) return;
        if (path.length < 2) return; // Need at least two points to draw a line.
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y - offsetY);
        for (const {x, y, col, lw} of path.slice(1)) {
            ctx.strokeStyle = col;
            ctx.lineWidth = lw ;
            ctx.setLineDash([1, 25]);
            ctx.lineTo(x, y - offsetY);
            // ctx.stroke();
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

export function drawDottedDot(id, x0, y0, x1, y1, theColor, theLineWidth, offset, context) {
    if (dottedStrokes[id] === undefined) {
        dottedStrokes[id] = []
    }
    dottedStrokes[id].push([{x: x0, y: y0}]);
    dottedStrokes[id][dottedStrokes[id].length - 1].push({
        x: x0 + 1,
        y: y0 + 1,
        col: theColor,
        lw: getLineWidth()
    }); // Append point to current path.
    refreshDotted(id);
}