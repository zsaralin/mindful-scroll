import {pushCompleteTile} from "../Tile/CompleteTileArr";
import {complem, invert, invertHue, meanHue} from "./ColorTheory";
import {getCurrColor} from "../Stroke/StrokeColor";
import {leastUsed, mostUsed} from "./CommonColours";

function getCol(tile, str, inputCol){
    let tempCol;
    if(str === "input") tempCol = inputCol
    else if(str === "first") tempCol = tile.firstCol
    else if(str === "last") tempCol = getCurrColor()
    else if(str === "firstI") tempCol = invert(tile.firstCol)
    else if(str === "firstIHue") tempCol = invertHue(tile.firstCol)
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

export function clearTile(tile, col){
    let canvStr = 'canvas'
    let ctx = document.getElementById(canvStr).getContext('2d');
    // let col = ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillStyle  = col;
    ctx.fill(tile.path)
}