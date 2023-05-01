import {pushStrokeUnder} from "../../Stroke/StrokeArr";
import {drawStrokeUnder} from "../../Stroke/DrawStroke";
import {fillTile} from "./FillTile";
import {geStrokeWidth, getLineWidth} from "../../Stroke/StrokeWidth";
import {getTileWidth} from "../../Tiling/TileWidth";
import {getColSections} from "../../Effects/Grid";
import {isCircleInPath} from "./FillRatio";
import {setCols} from "./ColourFn";
import {BB_PADDING} from "../../Constants";
import {getOffsetY} from "../../Scroll/Offset";

export function fillPattern(tile) {
    let ctx = document.getElementById("top-canvas").getContext("2d");
    let cols = setCols(tile)
    console.log('length of cols ' + cols.length)
    let [midX, midY] = findMid(tile)
    ctx.save()
    ctx.clip(tile.path)
    fillTile(tile, "input", false, cols[0])
    scaledStroke(ctx, tile, cols[0], 30, .5, midX, midY)
    scaledStroke(ctx, tile, cols[1], 70, .4, midX, midY)
    scaledStroke(ctx, tile, cols[2] ? cols[2] : cols[0], 60, .2, midX, midY)
    ctx.restore()
}

//
// function setCols(tile) {
//     let cols = []
//     let i = 10
//     let randomSign = Math.random() < 0.5 ? -1 : 1; // randomly generate -1 or 1
//     if (tile.colors.length === 1) {
//         if (parseInt(tile.colors[0].match(/\d+(?=%\))/)[0]) > 70) { // Check if last value is greater than 70
//             randomSign = -1; // Set randomSign1 to -1 if last value is greater than 70
//         } else if (parseInt(tile.colors[0].match(/\d+(?=%\))/)[0]) < 30) {
//             randomSign = 1; // Set randomSign1 to -1 if last value is greater than 70
//         }
//         cols.push(tile.colors[0])
//         cols.push(tile.colors[0].replace(/\d+(?=%\))/, parseInt(tile.colors[0].match(/\d+(?=%\))/)[0]) + i * randomSign));
//         cols.push(tile.colors[0].replace(/\d+(?=%\))/, parseInt(tile.colors[0].match(/\d+(?=%\))/)[0]) + i * 2 * randomSign));
//     } else if (tile.colors.length === 2) {
//         cols.push(tile.colors[0])
//         cols.push(tile.colors[1]);
//         cols.push(tile.colors[0])
//     } else if (tile.colors.length === 3) {
//         cols.push(tile.colors[0])
//         cols.push(tile.colors[1]);
//         cols.push(tile.colors[2])
//     } else {
//         cols = Array.from({length: 3}, () => tile.colors.splice(Math.floor(Math.random() * tile.colors.length), 1)[0]);
//     }
//     return cols
// }

function findMid(tile) {
    let midpointX;
    let midpointY;
    midpointX = (Math.min(...tile.inPath.map(p => p[0])) + Math.max(...tile.inPath.map(p => p[0]))) / 2;
    midpointY = (Math.min(...tile.inPath.map(p => p[1])) + Math.max(...tile.inPath.map(p => p[1]))) / 2;
    return [midpointX, midpointY]
}

function scaledStroke(ctx, tile, col, lw, scale, midX, midY) {
    ctx.save()
    ctx.strokeStyle = col
    ctx.fillStyle = col
    ctx.lineWidth = lw;
    ctx.translate(midX, midY)
    ctx.scale(scale, scale)
    ctx.translate(-midX, -midY);
    ctx.stroke(tile.path)
    ctx.fill(tile.path)
    ctx.restore()
}

export function fillStripesHoriz(tile, backCol, stripeCol) {
    fillTile(tile, "input", false, backCol)
    let ctx = document.getElementById("top-canvas").getContext("2d");
    let ymax = tile.bounds[3]
    let lw = getLineWidth()
    let y = tile.inPath.reduce((min, [x, y]) => y < min ? y : min, Number.POSITIVE_INFINITY) + lw;
    while (y <= ymax + lw) {
        const xmin = Math.min(...tile.inPath.filter(p => p[1] === y).map(p => p[0])) - lw / 4
        const xmax = Math.max(...tile.inPath.filter(p => p[1] === y).map(p => p[0])) + lw / 4
        ctx.beginPath();
        ctx.strokeStyle = stripeCol
        ctx.lineCap = ctx.lineJoin = "flat"
        ctx.lineWidth = lw
        ctx.moveTo(xmin, y);
        ctx.lineTo(xmax, y);
        ctx.stroke();
        y += lw * 1.4;
    }
    ctx.closePath()
}

export function fillStripesVert(tile, backCol, stripeCol) {
    fillTile(tile, "input", false, backCol)
    let ctx = document.getElementById("top-canvas").getContext("2d");
    let xmax = tile.bounds[1]
    let lw = getLineWidth()
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

export function fillStripesHorizGrad(tile) {
    fillTile(tile, "first", false)
    let cols = setCols(tile)
    let ctx = document.getElementById("top-canvas").getContext("2d");
    let lw = getLineWidth()
    let i = 0
    let [xmin, xmax, y, ymax] = tile.bounds
    ctx.save()
    ctx.clip(tile.path)
    while (y <= ymax + lw) {
        ctx.beginPath();
        ctx.strokeStyle = cols[i]
        ctx.lineCap = ctx.lineJoin = "flat"
        ctx.lineWidth = lw
        ctx.moveTo(xmin, y);
        ctx.lineTo(xmax, y)
        ctx.stroke();
        y += lw - 1;
        i > cols.length - 2 ? i = 0 : i++
    }
    ctx.restore()
    ctx.closePath()
}

export function fillStripesVertGrad(tile) {
    fillTile(tile, "first", false)
    let cols = setCols(tile)
    let ctx = document.getElementById("top-canvas").getContext("2d");
    let lw = getLineWidth()
    let [x, xmax, ymin, ymax] = tile.bounds
    let i = 0
    ctx.save()
    ctx.clip(tile.path)
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

// 50+ for horizontal, larger the #, smaller the slope.
export function fillStripesDiagonal(tile, slope) {
    const lw = getLineWidth();
    fillTile(tile, "first", false);
    const cols = setCols(tile);
    const ctx = document.getElementById("top-canvas").getContext("2d");
    ctx.lineWidth = lw;
    let i = 0;
    let [xmin, xmax, startY, ymax] = tile.bounds
    if(slope > 0){
        ymax += 4 * BB_PADDING;
    }
    else{
        startY -= 4 * BB_PADDING;
    }
    const x = xmax - xmin; // ~~270
    while (startY <= ymax + lw) {
        ctx.beginPath();
        ctx.strokeStyle = cols[i]; // switch colour
        let y0 = startY ;
        let y1 = startY - x / slope ;
        ctx.save()
        ctx.clip(tile.path)
        ctx.moveTo(xmin, y0);
        ctx.lineTo(xmax, y1);
        ctx.stroke();
        ctx.restore()
        startY += lw + (lw/3) * 1 / Math.abs(slope);
        i > cols.length - 2 ? i = 0 : i++;
    }
    ctx.closePath();
}

