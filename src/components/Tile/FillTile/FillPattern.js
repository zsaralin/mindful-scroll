import {pushStrokeUnder} from "../../Stroke/StrokeType/StrokeArr";
import {drawStrokeUnder} from "../../Stroke/DrawStroke";
import {fillTile} from "./FillTile";
import {geStrokeWidth, getLineWidth} from "../../Stroke/StrokeWidth";
import {getTileWidth} from "../../Tiling/TileWidth";
import {getColSections} from "../../Effects/Grid";
import {isCircleInPath} from "./FillRatio";
import {setCols} from "./ColourFn";
import {BB_PADDING} from "../../Constants";
import {getOffsetY} from "../../Scroll/Offset";
import {smallOffset} from "../../Tiling/Tiling3";

export function fillPattern(tile, col0, col1) {
    const ctx = document.getElementById("top-canvas").getContext("2d");
    // let cols = tile.fillColors ? tile.fillColors : (tile.fillColors = setCols(tile));
    const cols = tile.fillColors ? tile.fillColors : setCols(tile, col0, col1)
    let [midX, midY] = findMid(tile)
    fillTile(tile, "input", false, cols[0])
    ctx.save()
    // ctx.clip(tile.path)
    ctx.translate(0,-smallOffset)
    scaledStroke(ctx, tile, cols[0], 30, .5, midX, midY)
    scaledStroke(ctx, tile, cols[1], 70, .4, midX, midY)
    scaledStroke(ctx, tile, cols[2] ? cols[2] : cols[0], 60, .2, midX, midY)

    ctx.restore()
}

function findMid(tile) {
    const midpointX= (Math.min(...tile.inPath.map(p => p[0])) + Math.max(...tile.inPath.map(p => p[0]))) / 2;
    const midpointY= (Math.min(...tile.inPath.map(p => p[1])) + Math.max(...tile.inPath.map(p => p[1]))) / 2;
    return [midpointX, midpointY]
}

function scaledStroke(ctx, tile, col, lw, scale, midX, midY) {
    ctx.save()
    ctx.strokeStyle = col
    ctx.fillStyle = col
    ctx.lineWidth = lw;
    ctx.translate(midX, midY - smallOffset * scale)
    ctx.scale(scale, scale)
    ctx.translate(-midX, -midY+smallOffset);
    ctx.stroke(tile.path)
    ctx.fill(tile.path)
    ctx.restore()
}

export function fillStripesHoriz(tile, backCol, stripeCol) {
    fillTile(tile, "input", false, backCol)
    const ctx = document.getElementById("top-canvas").getContext("2d");
    const ymax = tile.bounds[3]
    const lw = getLineWidth()
    let y = tile.inPath.reduce((min, [x, y]) => y < min ? y : min, Number.POSITIVE_INFINITY) + lw;
    while (y <= ymax + lw) {
        const xmin = Math.min(...tile.inPath.filter(p => p[1] === y).map(p => p[0])) - lw
        const xmax = Math.max(...tile.inPath.filter(p => p[1] === y).map(p => p[0])) + lw
        ctx.beginPath();
        ctx.strokeStyle = stripeCol
        ctx.lineCap = ctx.lineJoin = "flat"
        ctx.lineWidth = lw
        ctx.moveTo(xmin, y - smallOffset);
        ctx.lineTo(xmax, y - smallOffset);
        ctx.stroke();
        y += lw * 1.4;
    }
    ctx.closePath()
}

export function fillStripesVert(tile, backCol, stripeCol) {
    fillTile(tile, "input", false, backCol)
    const ctx = document.getElementById("top-canvas").getContext("2d");
    const xmax = tile.bounds[1]
    const lw = getLineWidth()
    let x = tile.inPath.reduce((min, [x, y]) => x < min ? x : min, Number.POSITIVE_INFINITY) + lw;
    while (x <= xmax) {
        const ymin = Math.min(...tile.inPath.filter(p => p[0] === x).map(p => p[1])) - lw / 4
        const ymax = Math.max(...tile.inPath.filter(p => p[0] === x).map(p => p[1])) + lw / 4
        ctx.beginPath();
        ctx.strokeStyle = stripeCol
        ctx.lineWidth = lw
        ctx.lineCap = ctx.lineJoin = "flat"
        ctx.moveTo(x, ymin);
        ctx.lineTo(x, ymax);
        ctx.stroke();
        x += lw * 1.4;
    }
}

export function fillStripesHorizGrad(tile, col0, col1) {
    fillTile(tile, "first", false)
    // let cols = tile.fillColors ? tile.fillColors : (tile.fillColors = setCols(tile));
    const cols = tile.fillColors ? tile.fillColors : setCols(tile, col0, col1)

    const ctx = document.getElementById("top-canvas").getContext("2d");
    const lw = Math.floor(Math.random() * 21) + 15; // random num between 15 and 35
    let i = 0
    let [xmin, xmax, y, ymax] = tile.bounds
    ctx.save()
    ctx.translate(0, -smallOffset)
    ctx.clip(tile.path)
    const randomN = Math.floor(Math.random() * (lw + 1)); // random num between 0 and lw
    y -= randomN
    while (y <= ymax + lw) {
        ctx.beginPath();
        ctx.strokeStyle = cols[i]
        ctx.lineCap = ctx.lineJoin = "flat"
        ctx.lineWidth = lw
        ctx.moveTo(xmin - lw, y);
        ctx.lineTo(xmax + lw, y)
        ctx.stroke();
        y += lw - 1;
        i > cols.length - 2 ? i = 0 : i++
    }
    ctx.restore()
    ctx.closePath()
}

export function fillStripesVertGrad(tile, col0, col1) {
    fillTile(tile, "first", false)
    // let cols = tile.fillColors ? tile.fillColors : (tile.fillColors = setCols(tile));
    const cols = tile.fillColors ? tile.fillColors : setCols(tile, col0, col1)

    const ctx = document.getElementById("top-canvas").getContext("2d");
    const lw = getLineWidth()
    let [x, xmax, ymin, ymax] = tile.bounds
    let i = 0
    ctx.save()
    ctx.translate(0, -smallOffset)

    ctx.clip(tile.path)
    const randomN = Math.floor(Math.random() * (lw + 1)); // random num between 0 and lw
    x -= randomN
    while (x <= xmax) {
        ctx.beginPath();
        ctx.strokeStyle = cols[i]
        ctx.lineWidth = lw
        ctx.lineCap = ctx.lineJoin = "flat"
        ctx.moveTo(x, ymin);
        ctx.lineTo(x, ymax);
        ctx.stroke();
        x += lw - 1;
        i > cols.length - 2 ? i = 0 : i++
    }
    ctx.restore()
}

// 50+ for horizontal, larger the #, smaller the slope
// [-20,20], omit 0
export function fillStripesDiagonal(tile, slope, col0, col1) {
    const lw = getLineWidth();
    fillTile(tile, "first", false);
    // let cols = tile.fillColors ? tile.fillColors : (tile.fillColors = setCols(tile));
    const cols = tile.fillColors ? tile.fillColors : setCols(tile, col0, col1)

    const ctx = document.getElementById("top-canvas").getContext("2d");
    ctx.lineWidth = lw;
    let i = 0;
    let [xmin, xmax, startY, ymax] = tile.bounds;
    [xmin, xmax, startY, ymax] = [xmin - lw, xmax + lw, startY - lw, ymax + lw];
    if (slope > 0) {
        ymax += 4 * BB_PADDING;
    } else {
        startY -= 4 * BB_PADDING;
    }
    ctx.save()
    ctx.translate(0, -smallOffset)
    ctx.clip(tile.path)
    const x = xmax - xmin; // ~~270
    while (startY <= ymax + lw) {
        ctx.beginPath();
        ctx.strokeStyle = cols[i]; // switch colour
        const y0 = startY;
        const y1 = startY - x / slope;
        ctx.moveTo(xmin, y0);
        ctx.lineTo(xmax, y1);
        ctx.stroke();
        startY += lw - 1 + (lw/3) * 1 / Math.abs(slope);
        i > cols.length - 2 ? i = 0 : i++;
    }
    ctx.restore()

    ctx.closePath();
}


