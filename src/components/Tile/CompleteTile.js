import {getCurrColor} from "../Stroke/StrokeColor";
import {redrawTilings} from "../Tiling/TilingArr";
import {getOffsetY, getTotOffset} from "../Scroll/PageScroll";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {pushStroke, pushStrokeUnder, redrawBlurryStrokes, redrawStrokes} from "../Stroke/StrokeArr";
import {drawStroke, drawStrokeUnder} from "../Stroke/Stroke";
import {getTileWidth} from "../Tiling/TileWidth";
import {pushCompleteTile} from "./CompleteTileArr";
import {SHAPE_COLOR} from "../Constants";
import {shapeGlow} from "./Shape";
import {blurTile, fillAndBlur} from "../Effects/Blur";
import {addColArr, addToColArr, fillInverseMeanHue, fillMeanHue, getAverageRGB} from "../Effects/MeanHue";
import {fillLinearGradient, fillRadialGradient, } from "../Effects/Gradient";
import {fillTileColors} from "../Effects/ColorTheory";

let fillTileArr = [] // fully coloured tiles
let completeTileOn = true;

const PADDING = 35 // account for curves that go past the vertex points (startX, startY,...)
let internalOffset = 0;
let fillType = "combination"

export function setInternalOffset(input) {
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
    let ctx = document.getElementById('fill-canvas').getContext('2d');
    ctx.fillStyle = tile.firstCol
    console.log(tile.firstCol)
    ctx.fill(tile.path);
    pushCompleteTile(tile.path, tile.firstCol)
}

export function fillLastColour(tile) {
    let ctx = document.getElementById('fill-canvas').getContext('2d');
    let currCol = ctx.fillStyle = getCurrColor()
    ctx.fill(tile.path)
    tile.firstCol = currCol
    pushCompleteTile(tile.path, currCol)
}

export function fillMostUsedColour(tile) {
    let ctx = document.getElementById('fill-canvas').getContext('2d');
    let arr = tile.colors.map(element => element.data.toString());
    let mostUsed = arr.reduce((a,b,c,d) => (d[b]=++d[b]||1) > (d[a]=d[a]||0) ? b : a);
    mostUsed = 'rgba(' + mostUsed +')'
    ctx.fillStyle = mostUsed;
    ctx.fill(tile.path);
    pushCompleteTile(tile.path, mostUsed)
}

export function fillLeastUsedColour(tile) {
    let ctx = document.getElementById('fill-canvas').getContext('2d');
    let arr =tile.colors.map(element => element.data.toString());
    let leastUsed = arr.reduce((a,b,c,d) => (d[b]=++d[b]||1) < (d[a]=d[a]||Infinity) ? b : a);
    leastUsed = 'rgba(' + leastUsed +')'
    ctx.fillStyle = leastUsed;
    ctx.fill(tile.path);
    pushCompleteTile(tile.path, leastUsed)
}


export function fillEachPixel(tile) {
    let ctx = document.getElementById('canvas').getContext('2d');
    let width = getTileWidth()
    let fillColor = getTopLeftCol(tile) // fill colour starts as first colour of top left corner
    fillFirstColour(tile)
    tile.inPath.forEach(i => {
        let x = i[0], y = i[1]
        if (ctx.getImageData(x, y, 1, 1).data.toString() === '0,0,0,0') {
            pushStrokeUnder(tile, x, y, x, y + .5, width, fillColor);
            drawStrokeUnder(x, y, x, y + .5, width, fillColor);
        } else {
            fillColor = 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
        }
    })
}

export function fillEachPixelInverse(tile) {
    let ctx = document.getElementById('canvas').getContext('2d');
    let width = getTileWidth()
    let fillColor = getTopLeftCol(tile) // fill colour starts as first colour of top left corner
    fillFirstColour(tile)
    tile.inPath.forEach(i => {
        let x = i[0], y = i[1]
        if (ctx.getImageData(x, y, 1, 1).data.toString() === '0,0,0,0') {
            pushStrokeUnder(tile, x, y, x, y + .5, width, fillColor);
            drawStrokeUnder(x, y, x, y + .5, width, fillColor);
        } else {
            fillColor = 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
        }
    })
}

export function completeTile(currTile, invisCol) {
    if (completeTileOn) {
        currTile.filled = true;
        fillTileColors(currTile)
        fillLeastUsedColour(currTile)
        // if (fillType === "combination") fillEachPixel(currTile)
        // else if (fillType === "first") fillFirstColour(currTile)
        // else if (fillType === "last") fillLastColour(currTile)
        // else if (fillType === "blur") blurTile(currTile)
        // else if (fillType === "blurFill") fillAndBlur(currTile)
        // else if (fillType === "meanHue") fillMeanHue(currTile)
        // else if (fillType === "inverseMean") fillMeanHue(currTile)
        // else if (fillType === "radialGradient") fillRadialGradient(currTile, true)
        // else if (fillType === "diagGradient") fillLinearGradient(currTile, "diag")
        // else if (fillType === "horizGradient") fillLinearGradient(currTile, "horiz")
        // else if (fillType === "vertGradient") fillLinearGradient(currTile, "vert")

        currTile.filled = true;

        if (`rgb(${invisCol?.substring(0, 7)})` === SHAPE_COLOR) {
            shapeGlow(currTile)
        }
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

export function setFillType(str) {
    fillType = str
}