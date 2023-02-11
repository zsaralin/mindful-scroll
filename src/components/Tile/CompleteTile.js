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

export function fillFirstColour(tile){
    let ctx = document.getElementById('fill-canvas').getContext('2d');
    ctx.fillStyle = tile.firstCol
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

    let fillColor = getFirstColor(tile)
    fillFirstColour(tile)
    for (let x = startX; x < endX; x = x + Math.ceil(width/2)) {
        for (let y = startY; y < endY; y = y + Math.ceil(width/2)) {
            if (ctx.isPointInPath(tile.path, x, y)) {
                if (ctx.getImageData(x, y, 1, 1).data.toString() === '0,0,0,0') {
                    pushStrokeUnder(x, y, x, y, width, fillColor);
                    drawStrokeUnder(x, y, x, y, width, fillColor);
                } else {
                    fillColor = 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
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
        fillFirstColour(currTile, color)
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
                    console.log('rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')')
                    return 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
                }
            }
        }
    }
}