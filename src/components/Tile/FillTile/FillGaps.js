import {getTileWidth} from "../../Tiling/TileWidth";
import {
    getStrokeArr,
    pushStrokeUnder,
    redrawTileStrokes,
    redrawTileStrokesI,
    strokeArr
} from "../../Stroke/StrokeType/StrokeArr";
import {drawStrokeUnder} from "../../Stroke/DrawStroke";
import {invert, invertHue, isSimilar, rgbToHsl} from "../../Effects/ColorTheory";
import {clearTile, fillTile} from "./FillTile";
import {getOffsetY} from "../../Scroll/Offset";
import {getCurrColor, setCurrColor,} from "../../Stroke/Color/StrokeColor";

export function fillEachPixel(tile) {
    let ctx = document.getElementById('top-canvas').getContext('2d');
    ctx.save()
    ctx.clip(tile.path)
    let width = getTileWidth()
    let fillColor = getTopLeftCol(tile) // fill colour starts as first colour of top left corner
    fillTile(tile, "first", true)
    tile.inPath.forEach(i => {
        let x = i[0], y = i[1]
        if (ctx.getImageData(x, y, 1, 1).data.toString() === '0,0,0,0') {
            pushStrokeUnder(tile, x, y, x, y + .5, fillColor, width);
            drawStrokeUnder(x, y, x, y + .5, fillColor, width);
        } else {
            let hsl = toHsl(ctx.getImageData(x, y, 1, 1).data)
            if(tile.colors.includes(hsl)) fillColor = hsl
        }
    })
    ctx.restore()
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
    // let id=  tile.id
    let arr = strokeArr[tile.id]
    console.log('arr is ' + arr)
    // if(arr){
    let lastColor = tile.colors[tile.colors.length-1]
    // // let col = getCurrColor()
    // setCurrColor(invertHue(lastColor))

    redrawTileStrokesI(tile.id, invertHue)
    fillTile(tile, "input", true, lastColor)
    // setCurrColor(invertHue(col))
    // setCurrColor(invert(col))
}

function getTopLeftCol(tile) {
    let ctx = document.getElementById('top-canvas').getContext('2d');
    for (let i = 0; i < tile.inPath.length; i++) {
        let x = tile.inPath[i][0], y = tile.inPath[i][1];
        let hsl  = toHsl(ctx.getImageData(x, y, 1, 1).data)
        if (tile.colors.includes(hsl) ) {
            // console.log('first ' + ctx.getImageData(x, y, 1, 1).data)
            // console.log( 'FIRST rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')')
            return hsl
        }
    }
}

function toHsl(col){
    let [h,s,l] = rgbToHsl(col[0], col[1], col[2])
    let hsl = [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
    return 'hsl(' + hsl[0] + ',' + hsl[1] + '%,' + hsl[2] + '%)'
}