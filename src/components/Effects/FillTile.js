import {pushCompleteTile} from "../Tile/CompleteTileArr";
import {complem, invert, meanHue} from "./ColorTheory";
import {getCurrColor} from "../Stroke/StrokeColor";
import {leastUsed, mostUsed} from "./CommonColours";

function getCol(tile, str, inputCol){
    let tempCol;
    if(str === "input") tempCol = inputCol
    else if(str === "first") tempCol = tile.firstCol
    else if(str === "last") tempCol = getCurrColor()
    else if(str === "firstI") tempCol = invert(tile.firstCol)
    else if(str === "lastI") tempCol = invert(getCurrColor())
    else if(str === "firstC") tempCol = complem(tile.firstCol)
    else if(str === "lastC") tempCol = complem(getCurrColor())
    else if(str === "meanHue") tempCol = meanHue(tile, tile.colors)
    else if(str === "meanHueI") tempCol = invert(meanHue(tile, tile.colors))
    else if(str === "least") tempCol = leastUsed(tile)
    else if(str === "most") tempCol = mostUsed(tile)

    return tempCol;
}

export function fillTile(tile, str, under, inputCol){
    let canvStr = under ? 'fill-canvas' : 'canvas'
    let ctx = document.getElementById(canvStr).getContext('2d');
    let col = ctx.fillStyle = getCol(tile, str, inputCol)
    ctx.fill(tile.path)
    tile.filled = true;
    pushCompleteTile(tile.path, col)
}

export function clearTile(tile){
    let canvStr = 'canvas'
    let ctx = document.getElementById(canvStr).getContext('2d');
    let col = ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fill(tile.path)
}


// export function fillCurrTile(tile, color) {
//     let ctx = document.getElementById('fill-canvas').getContext('2d');
//     ctx.fillStyle = color ? color : tile.color
//     ctx.fill(tile.path)
//     tile.filled = true;
//     pushCompleteTile(tile.path, color)
//
// }
//
// export function fillFirstColour(tile, inverse) {
//     let ctx = document.getElementById('fill-canvas').getContext('2d');
//     ctx.fillStyle = inverse === true ? invert(tile.firstCol) : tile.firstCol;
//     ctx.fill(tile.path);
//     pushCompleteTile(tile.path, inverse ? invert(tile.firstCol) : tile.firstCol)
// }
//
// export function fillLastColour(tile, inverse) {
//     let ctx = document.getElementById('fill-canvas').getContext('2d');
//     let col = getCurrColor()
//     let currCol = ctx.fillStyle = inverse === true ? invert(col) : col;
//     ctx.fill(tile.path)
//     tile.firstCol = currCol
//     pushCompleteTile(tile.path, currCol)
// }
