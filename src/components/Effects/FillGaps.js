import {getTileWidth} from "../Tiling/TileWidth";
import {pushStrokeUnder, redrawTileStrokes, redrawTileStrokesI} from "../Stroke/StrokeArr";
import {drawStrokeUnder} from "../Stroke/Stroke";
import {invert} from "./ColorTheory";
import {clearTile, fillTile} from "./FillTile";
import {getOffsetY} from "../Scroll/Offset";

export function fillEachPixel(tile) {
    let ctx = document.getElementById('canvas').getContext('2d');
    let width = getTileWidth()
    let fillColor = getTopLeftCol(tile) // fill colour starts as first colour of top left corner
    fillTile(tile, "first", true)
    tile.inPath.forEach(i => {
        let x = i[0], y = i[1]
        if (ctx.getImageData(x, y, 1, 1).data.toString() === '0,0,0,0') {
            pushStrokeUnder(tile, x, y, x, y + .5, fillColor, width);
            drawStrokeUnder(x, y, x, y + .5, fillColor, width);
        } else {
            fillColor = 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
        }
    })
}

export function fillEachPixelInverse(tile) {
    fillEachPixel(tile)
    // let ctx = document.getElementById('canvas').getContext('2d');
    // let width = getTileWidth()
    // clearTile(tile)
    // redrawTileStrokesI(tile, getOffsetY())
    // let fillColor = invert(getTopLeftCol(tile)) // fill colour starts as first colour of top left corner
    clearTile(tile)
    redrawTileStrokesI(tile, getOffsetY())
    fillTile(tile, "firstI", true)

    // tile.inPath.forEach(i => {
    //     let x = i[0], y = i[1]
    //     if (ctx.getImageData(x, y, 1, 1).data.toString() === '0,0,0,0') {
    //         pushStrokeUnder(tile, x, y, x, y + 2, (fillColor),  width);
    //         drawStrokeUnder(x, y, x, y + 2, (fillColor), width);
    //     } else {
    //         fillColor = 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
    //     }
    // })
}

function getTopLeftCol(tile) {
    let ctx = document.getElementById('canvas').getContext('2d');
    for (let i = 0; i < tile.inPath.length; i++) {
        let x = tile.inPath[i][0], y = tile.inPath[i][1];
        if (ctx.getImageData(x, y, 1, 1).data.toString() !== '0,0,0,0') {
            // console.log( 'FIRST rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')')
            return 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
        }
    }
}