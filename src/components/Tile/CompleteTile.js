import {getCurrColor} from "../Stroke/StrokeColor";
import {redrawTilings} from "../Tiling/TilingArr";
import {getOffsetY, getTotOffset} from "../Scroll/PageScroll";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {pushStroke, pushStrokeUnder} from "../Stroke/StrokeArr";
import {drawStroke, drawStrokeUnder} from "../Stroke/Stroke";
import {getTileWidth} from "../Tiling/TileWidth";
import {pushCompleteTile} from "./CompleteTileArr";

let fillTileArr = [] // fully coloured tiles
let completeTileOn = true;

const PADDING = 35 // account for curves that go past the vertex points (startX, startY,...)
let internalOffset = 0;

export function setInternalOffset(input){
    internalOffset = input
}

export function fillCurrTile(tile, color) {
    let ctx = document.getElementById('fill-canvas').getContext('2d');
    ctx.fillStyle = color ? color : tile.color
    ctx.fill(tile.path)
    tile.filled = true;
    pushCompleteTile(tile.path, color)

}

export function fillFirstColour(tile) {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.fillStyle = tile.firstCol
    ctx.fill(tile.path);
    console.log('hi')
    tile.filled = true;
    pushCompleteTile(tile.path, tile.firstCol)
}

export function fillLastColour(tile) {
    let ctx = document.getElementById('fill-canvas').getContext('2d');
    let currCol = ctx.fillStyle = getCurrColor()
    ctx.fill(tile.path)
    tile.filled = true;
    tile.firstCol = currCol
    pushCompleteTile(tile.path, currCol)

}

export function fillEachPixel(tile) {
    tile.filled = true;
    let ctx = document.getElementById('canvas').getContext('2d');
    let width = getTileWidth()
    let tileDim = tile.tile

    let fillColor = getTopLeftCol(tile) // fill colour starts as first colour of top left corner
    fillFirstColour(tile)
    tile.inPath.forEach(i => {
        let x = i[0], y = i[1]
        if (ctx.getImageData(x, y, 1, 1).data.toString() === '0,0,0,0') {
            pushStrokeUnder(x, y, x, y + .5, width, fillColor);
            drawStrokeUnder(x, y, x, y + .5, width, fillColor);
        } else {
            fillColor = 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
        }
    })
}


export function completeTile(currTile) {
    if (completeTileOn) {
        // redrawTilings()
        fillFirstColour(currTile)
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

export class redrawCompleteTiles {
}