import {getTileWidth} from "../Tiling/TileWidth";
import {getStrokeArr, pushStrokeUnder, redrawTileStrokes, redrawTileStrokesI} from "../Stroke/StrokeArr";
import {drawStrokeUnder} from "../Stroke/DrawStroke";
import {invert, invertHue} from "./ColorTheory";
import {clearTile, fillTile} from "./FillTile";
import {getOffsetY} from "../Scroll/Offset";
import {getCurrColor, setCurrColor,} from "../Stroke/StrokeColor";

export function fillEachPixel(tile) {
    let ctx = document.getElementById('fill-canvas').getContext('2d');
    let width = getTileWidth()
    let fillColor = getTopLeftCol(tile) // fill colour starts as first colour of top left corner
    fillTile(tile, "first", true)
    tile.inPath.forEach(i => {
        let x = i[0], y = i[1]
        if (ctx.getImageData(x, y, 1, 1).data.toString() === '0,0,0,0') {
            console.log(fillColor)
            pushStrokeUnder(tile, x, y, x, y + .5, fillColor, width);
            drawStrokeUnder(x, y, x, y + .5, fillColor, width);
        } else {
            fillColor = 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
        }
    })
}

export function fillEachPixelInverse(tile) {
    fillEachPixel(tile)
    clearTile(tile, invert(tile.firstCol))
    redrawTileStrokesI(tile, getOffsetY(), invert)
    fillTile(tile, "firstI", true)
}

export function fillEachPixelInverseHue(tile) {
    fillEachPixel(tile)
    clearTile(tile)
    redrawTileStrokesI(tile, getOffsetY(), invertHue)
    fillTile(tile, "firstIHue", true)
}

// redraw strokes to inverse colour, set background to currColour
export function fillInverseStrokes(tile) {
    // clearTile(tile)
    let arr = getStrokeArr()[tile.id]
    let lastColor = arr[arr.length-1].color
    // let col = getCurrColor()
    setCurrColor(invert(lastColor))

    redrawTileStrokesI(tile, getOffsetY(), invert)
    fillTile(tile, "input", true, lastColor)
    // setCurrColor(invertHue(col))
    // setCurrColor(invert(col))
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