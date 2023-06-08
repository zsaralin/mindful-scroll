import {hslToRgb} from "../../Effects/ColorTheory";
import {getLineWidth} from "../StrokeWidth";
import {getBoundsTile} from "../../Tiling/TilingBounds";
import {redrawTileDots} from "../Dot/DotArr";
import {getPathWithId, getTileWithId} from "../../Tiling/TilingPathDict";
import {getOffsetY} from "../../Scroll/Offset";
import {getTile} from "../../Tiling/Tiling2";
import {findTile, findTile1, redrawTileStrokes} from "./StrokeArr";
import {getOffSmall, smallOffset} from "../../Tiling/Tiling3";

let transStrokes = {}
let dragging = false;

export function drawTransparentDot(id, x0, y0, x1, y1, theColor) {
    // document.getElementById('fill-canvas').getContext("2d").fillStyle = 'rgba(0, 0, 0, 0)'
    if (transStrokes[id] === undefined) transStrokes[id] = []

    transStrokes[id].push([{x: x0, y: y0, smallOff: smallOffset}]);
    const [h, s, l] = theColor.match(/(\d+)/g);
    let rgb = hslToRgb(h, s, l)
    rgb = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .5)`;
    transStrokes[id][transStrokes[id].length - 1].push({
        x: x1,
        y: y1,
        col: rgb,
        lw: getLineWidth(),
        smallOff: smallOffset
    }); // Append point to current path.
    refreshTrans(id);
}

export function drawTransparentStroke(id, x0, y0, x1, y1, theColor, theLineWidth, offset, context) {
    if (!dragging) {
        drawTransparentDot(id, x0, y0, x1, y1, theColor)
        if (transStrokes[id] === undefined) {
            transStrokes[id] = []}
        dragging = true;
        return
    }
    const [h, s, l] = theColor.match(/(\d+)/g);
    let rgb = hslToRgb(h, s, l)
    rgb = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .5)`;
    transStrokes[id][transStrokes[id].length - 1].push({
        x: x0,
        y: y0,
        col: rgb,
        lw: theLineWidth,
        smallOff: smallOffset
    }); // Append point to current path.
    refreshTrans(id);
    // drawHelper(transStrokes[id][transStrokes[id].length - 1])
}

export function refreshTrans(id) {
    const ctx = document.getElementById('top-canvas').getContext("2d");
    let tile = getTileWithId(id)
    ctx.fillStyle = "white"
    ctx.save()
    ctx.translate(0, -smallOffset)
    ctx.fill(getTileWithId(id)?.path)
    if (tile.filled) {
        ctx.fillStyle = `${tile.fillColors.slice(0, -1)}, 0.5)`;
        ctx.fill(getTileWithId(id).path)
    }
    ctx.restore()
    redrawTransStrokesTile(id)
    // ctx.restore()

}

export function setDragging(input) {
    dragging = input
}

export function redrawTransparentStrokes(offsetY) {
    for (const id in transStrokes) {
        const paths = transStrokes[id];
        paths.forEach((path, index) => {
            path.forEach((i) => {
                if (i.smallOff === 0) {
                    i.y = i.y - getOffSmall(0);
                    i.smallOff = getOffSmall(0);
                } else {
                    delete transStrokes[id];
                    return; // Move to the next path
                }
            });
        });
    }
}


export function redrawTransStrokesTile(tileId, offsetY = 0) {
    const currTile = offsetY ? findTile1(tileId, offsetY, transStrokes) : undefined;
    const ctx = document.getElementById('top-canvas').getContext('2d');
    const temp = transStrokes[tileId]?.slice() ?? [];
    temp.forEach(path => {
        if (offsetY !== 0 && path.y0 < offsetY) return;
        if (path.length < 1) return;

        if (offsetY !== 0 && currTile) {
            transStrokes[currTile.id] ??= [];
            transStrokes[currTile.id].push([{x: path[0].x, y: path[0].y - offsetY}]);
        }

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y - offsetY);

        for (const {x, y, col, lw} of path.slice(1)) {
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineTo(x, y - offsetY);

            if (offsetY !== 0 && currTile) {
                transStrokes[currTile.id][transStrokes[currTile.id].length - 1].push({x, y: y - offsetY, col, lw});
            }
        }

        ctx.stroke();
    });

    // redrawTileStrokes(tileId);
    // ctx.restore()
}


export function getDragging() {
    return dragging
}
