import {getCurrColor} from "../Stroke/StrokeColor";
import {redrawTilings} from "../Tiling/TilingArr";
import {getOffsetY} from "../PageScroll";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {pushStroke, pushStrokeUnder} from "../Stroke/StrokeArr";
import {drawStroke, drawStrokeUnder} from "../Stroke/Stroke";
import {getTileWidth} from "../Tiling/TileWidth";

let fillTileArr = [] // fully coloured tiles
let completeTileOn = true;

const PADDING = 35 // account for curves that go past the vertex points (startX, startY,...)

export function redrawTiles() {
    fillTileArr.forEach(tile => {
        fillFirstColour(tile)
    })
}

export function fillCurrTile(tile, color) {
    let ctx = document.getElementById('fill-canvas').getContext('2d');
    ctx.fillStyle = color ? color : tile.color
    ctx.fill(tile.path)
}

export function fillFirstColour(tile) {
    let ctx = document.getElementById('fill-canvas').getContext('2d');
    ctx.fillStyle = tile.firstCol
    ctx.fill(tile.path)
}

export function fillLastColour(tile) {
    let ctx = document.getElementById('fill-canvas').getContext('2d');
    ctx.fillStyle = getCurrColor()
    ctx.fill(tile.path)
}

export function fillEachPixel(tile) {
    tile.filled = true;
    let ctx = document.getElementById('canvas').getContext('2d');
    let width = getTileWidth()
    let tileDim = tile.tile

    let startX = tileDim[0] - PADDING;
    let startY = tileDim[2] - PADDING;
    let endX = tileDim[1] + PADDING;
    let endY = tileDim[3] + PADDING;

    let fillColor = getTopLeftCol(tile) // fill colour starts as first colour of top left corner
    fillFirstColour(tile)
    // for (let x = startX; x < endX; x = x + Math.ceil(width / 2)) {
    //     for (let y = startY; y < endY; y = y + Math.ceil(width / 2)) {
    //         if (ctx.isPointInPath(tile.path, x, y)) {
    tile.inPath.forEach(i => {
        let x = i[0], y = i[1]
        if (ctx.getImageData(x, y, 1, 1).data.toString() === '0,0,0,0') {
            pushStrokeUnder(x, y, x, y, width, fillColor);
            drawStrokeUnder(x, y, x, y, width, fillColor);
        } else {
            fillColor = 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
        }
    })
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
        fillFirstColour(currTile, color)
    }
}

export function triggerCompleteTile() {
    completeTileOn = !completeTileOn
}

function getTopLeftCol(tile) {
    let ctx = document.getElementById('canvas').getContext('2d');
    tile.inPath.forEach(i => {
        let x = i[0], y = i[1]
        if (ctx.getImageData(x, y, 1, 1).data.toString() !== '0,0,0,0') {
            return 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
        }
    })
}