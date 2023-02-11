import {getCurrColor} from "../Stroke/StrokeColor";
import {redrawTilings} from "../Tiling/TilingArr";
import {getOffsetY} from "../PageScroll";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {pushStroke, pushStrokeUnder} from "../Stroke/StrokeArr";
import {drawStroke, drawStrokeUnder} from "../Stroke/Stroke";

let fillTileArr = [] // fully coloured tiles
let completeTileOn = true;

const PADDING = 35 // account for curves that go past the vertex points (startX, startY,...)

export function redrawTiles() {
    fillTileArr.forEach(tile => {
        fillCompleteTile(tile)
    })
}

// function fillCompleteTile(tile, color) {
//     // let ctx = document.getElementById('canvas').getContext('2d');
//     // ctx.fillStyle = color ? color : tile.color
//     // ctx.fill(tile.path)
// }

function fillCompleteTile(tile) {
    tile.filled = true;
    let ctx = document.getElementById('canvas').getContext('2d');
    let lineWidth = getLineWidth()
    let tileDim = tile.tile
    let startX = tileDim[0] - PADDING;
    let startY = tileDim[2] - PADDING;
    ;
    let endX = tileDim[1] + PADDING;
    let endY = tileDim[3] + PADDING;


    let fillColor = getFirstColor(tile)
    ctx.beginPath();
    ctx.rect(startX, startY, endX - startX, endY - startY);
    ctx.stroke();
    console.log('first ' + fillColor)
    let underCtx = document.getElementById('fill-canvas').getContext('2d');
    underCtx.fillStyle = fillColor
    underCtx.fill(tile.path)
    ctx.strokeStyle = fillColor

    for (let x = startX; x < endX; x = x + 1) {
        for (let y = startY; y < endY; y = y + 1) {
            if (ctx.isPointInPath(tile.path, x, y)) {
                if (ctx.getImageData(x, y, 1, 1).data.toString() === '0,0,0,0') {
                    // pushStrokeUnder(x, y, x, y, lineWidth/5, fillColor);
                    drawStrokeUnder(x, y, x, y, lineWidth/5, fillColor);
                } else {
                    fillColor = 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
                    console.log(fillColor)
                }
            }
        }
    }
}

export function pushCompleteTile(tile, color) {
    fillTileArr.push(
        {
            path: tile,
            color: color
        }
    )
}

export function completeTile(currTile, color) {
    if (completeTileOn) {
        pushCompleteTile(currTile.path, color)
        redrawTilings()
        fillCompleteTile(currTile, color)
    }
}

export function triggerCompleteTile() {
    completeTileOn = !completeTileOn
}

function getFirstColor(tile) {
    let tileDim = tile.tile

    let startX = tileDim[0] - PADDING;
    let startY = tileDim[2] - PADDING;
    ;
    let endX = tileDim[1] + PADDING;
    let endY = tileDim[3] + PADDING;
    let ctx = document.getElementById('canvas').getContext('2d');

    for (let x = startX; x < endX; x = x + 5) {
        for (let y = startY; y < endY; y = y + 5) {
            if (ctx.isPointInPath(tile.path, x, y)) {
                if (ctx.getImageData(x, y, 1, 1).data.toString() !== '0,0,0,0') {
                    return 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
                }
            }
        }
    }
}