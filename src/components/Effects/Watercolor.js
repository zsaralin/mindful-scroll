import {getTile} from "../Tiling/TilingArr";
import {getCurrColor} from "../Stroke/StrokeColor";
import {LINE_WIDTH} from "../Constants";
import {pushCompleteTile, redrawTiles} from "../Tile/CompleteTileArr";
import {getFillRatio, getFillRatio2} from "./FillRatio";
import {fillCurrTile} from "../Tile/CompleteTile";
import {getOffsetY, getTotOffset} from "../Scroll/PageScroll";

let activeTileArr = []; // semi coloured tiles (gradient)
const ORIG_RADIUS = LINE_WIDTH;
let initFill;
let fillCol;
let numActiveTiles = -1;
var count = 0;
var fillRatio = 0; // Store the initial fill ratio

export function stopWatercolor() {
    clearInterval(initFill)
    clearInterval(fillCol)
}

// var count = 0;

export function watercolor(x, y, r2, currTile) {
    let currColor = getCurrColor();
    let currPath = currTile.path;
    numActiveTiles += 1;

    initFill = setInterval(function () {
        r2 += 2
        fillActiveTile(x, y, currColor, r2, currPath)
        if (r2 > 50) {
            clearInterval(initFill)
        }
    }, 100)

    fillCol = setInterval(function () {
        r2 += 5
        fillActiveTile(x, y, currColor, r2, currPath)
        activeTileArr[numActiveTiles] = ({tile: currTile, path: currPath, color: currColor, r2: r2, x: x, y: y})
        if (fillRatio === 1) {
            count++; // Increment the counter variable
            if (count >= 100) {
                clearInterval(fillCol)
                activeTileArr.shift();
                pushCompleteTile(currPath, currColor)
                fillCurrTile(currTile, currColor)
                numActiveTiles--
            }
        } else fillRatio = getFillRatio(currTile)

    }, 50)

}

function continueWatercolor(activeTile){
    let fillCol = setInterval(function () {
        activeTile.r2 += 5
        fillActiveTile(activeTile.x, activeTile.y, activeTile.color, activeTile.r2, activeTile.path)
        if (fillRatio === 1) {
            count++; // Increment the counter variable
            if (count >= 100) {
                clearInterval(fillCol)
                activeTileArr.shift();
                pushCompleteTile(activeTile.path, activeTile.color)
                fillCurrTile(activeTile.path, activeTile.color)
                numActiveTiles--
            }
        } else fillRatio = getFillRatio(activeTile.tile)

    }, 50)
}

export function redrawActiveTiles() {
    let ctx = document.getElementById('canvas').getContext('2d');

    let offsetY = getOffsetY()
    stopWatercolor();
    // ctx.save();
    console.log('len + ' + activeTileArr.length)
    activeTileArr.forEach(activeTile => {
        ctx.translate(0, -offsetY);

        continueWatercolor(activeTile)
        ctx.restore();

        // fillActiveTile(activeTile.x, activeTile.y, activeTile.color, activeTile.r2, activeTile.path)
    })

    activeTileArr = []

}

function fillActiveTile(x, y, color, r2_, path) {
    let off = 0//getOffsetY()
    let ctx = document.getElementById('canvas').getContext('2d');
    let grd = ctx.createRadialGradient(x, y + off, ORIG_RADIUS, x, y + off, r2_);
    grd.addColorStop(0, color);
    grd.addColorStop(.5, "white");
    ctx.fillStyle = grd
    ctx.fill(path)
}

export function getActiveTileArr() {
    return activeTileArr;
}