import {getTile} from "../Tiling/TilingArr";
import {getCurrColor} from "../Stroke/Color/StrokeColor";
import {LINE_WIDTH, TOP_CANV} from "../Constants";
import {pushCompleteTile, redrawTiles} from "../Tile/CompleteTileArr";
import {getFillRatio, getFillRatio2} from "../Tile/FillTile/FillRatio";
import {fillCurrTile} from "../Tile/CompleteTile";
import {getOffsetY, getTotOffset} from "../Scroll/PageScroll";
import {fillTile} from "../Tile/FillTile/FillTile";

let activeTileArr = []; // semi coloured tiles (gradient)
const ORIG_RADIUS = LINE_WIDTH;
let initFill;
let fillCol;
let numActiveTiles = -1;

let canvStr = TOP_CANV

export function stopWatercolor() {
    clearInterval(initFill)
    clearInterval(fillCol)
}

export function watercolor(x, y, r2, currTile) {
    let currColor = getCurrColor();
    let currPath = currTile.path;
    numActiveTiles += 1;
    var count = 0;
    var fillRatio = 0; // Store the initial fill ratio

    initFill = setInterval(function () {
        r2 += 2
        fillActiveTile(x, y, currColor, r2, currPath)
        activeTileArr[numActiveTiles] = ({tile: currTile, path: currPath, color: currColor, r2: r2, x: x, y: y, count: count, fillRatio : fillRatio})
        if (r2 > 50) {
            clearInterval(initFill)
        }
    }, 100)

    fillCol = setInterval(function () {
        r2 += 5
        fillActiveTile(x, y, currColor, r2, currPath)
        activeTileArr[numActiveTiles] = ({tile: currTile, path: currPath, color: currColor, r2: r2, x: x, y: y, count: count, fillRatio : fillRatio})
        if (fillRatio === 1) {
            count++; // Increment the counter variable
            if (count >= 100) {
                clearInterval(fillCol)
                activeTileArr.shift();
                pushCompleteTile(currPath, currColor)
                fillTile(currTile, "input", currColor)
                numActiveTiles--
            }
        } else fillRatio = getFillRatio2(currTile)

    }, 50)

}

function continueWatercolor(activeTile, offsetY) {
    let count = activeTile.count
    let fillRatio = activeTile.fillRatio
    let fillCol = setInterval(function () {
        activeTile.r2 += 5
        fillActiveTile(activeTile.x, activeTile.y, activeTile.color, activeTile.r2, activeTile.path, offsetY)
        if (fillRatio === 1) {
            count++; // Increment the counter variable
            if (count >= 100) {
                clearInterval(fillCol)
                activeTileArr.shift();
                pushCompleteTile(activeTile.path, activeTile.color)
                fillTile(activeTile, "input", activeTile.color) // maybe activeTile.path
                numActiveTiles--
            }
        } else fillRatio = getFillRatio2(activeTile.tile)

    }, 50)
}

export function redrawActiveTiles(offsetY) {
    let ctx = document.getElementById(canvStr).getContext('2d');

    stopWatercolor();
    // ctx.save();
    // console.log('len + ' + activeTileArr.length)
    // ctx.translate(0, -offsetY);

    activeTileArr.forEach(activeTile => {

        // ctx.save()
        fillActiveTile(activeTile.x, activeTile.y, activeTile.color, activeTile.r2, activeTile.path, offsetY )

        // ctx.translate(0, -offsetY);

        continueWatercolor(activeTile, offsetY)
        // ctx.restore();
        // fillActiveTile(activeTile.x, activeTile.y, activeTile.color, activeTile.r2, activeTile.path)

    })
    // ctx.restore();

    activeTileArr = []

}

function fillActiveTile(x, y, color, r2_, path, off) {
    // let off = 0//getOffsetY()
    let ctx = document.getElementById(canvStr).getContext('2d');
    if(off)     ctx.translate(0, -off);

    let grd = ctx.createRadialGradient(x, y, ORIG_RADIUS, x, y, r2_);
    grd.addColorStop(0, color);
    grd.addColorStop(.5, "white");

    ctx.fillStyle = grd
    ctx.fill(path)
    if(off)     ctx.translate(0, +off);

}

export function getActiveTileArr() {
    return activeTileArr;
}