import {getTile} from "../Tiling/Tiling2";
import {getCurrColor} from "../Stroke/Color/StrokeColor";
import {LINE_WIDTH, TOP_CANV} from "../Constants";
import {pushCompleteTile, redrawCompleteTile, redrawTiles} from "../Tile/CompleteTileArr";
import {getFillRatio} from "../Tile/FillTile/FillRatio";
import {fillCurrTile} from "../Tile/CompleteTile";
import {getOffsetY} from "../Scroll/Offset";
import {fillTile} from "../Tile/FillTile/FillTile";
import {gsap} from "gsap";
import {strokeArr} from "../Stroke/StrokeType/StrokeArr";
import {removeLastDot} from "../Stroke/Dot/DotArr";

let activeTileArr = {} // semi coloured tiles (gradient)
const ORIG_RADIUS = LINE_WIDTH;
let initFill;
let fillCol;
let numActiveTiles = -1;

let canvStr = TOP_CANV

let animation;

export function watercolor(x, y, r2, currTile) {
    // removeLastDot(currTile)
    currTile.watercolor = true;
    let currColor = getCurrColor();
    let currPath = currTile.path;
    numActiveTiles += 1;
    var count = 0;
    var fillRatio = 0; // Store the initial fill ratio

    let targetRadius = 500; // New radius to be reached by the animation
    let startTime = new Date().getTime();

    let ctx = document.getElementById(canvStr).getContext('2d');

    animation = gsap.to({value: r2 ?? ORIG_RADIUS}, {
        duration: 10,
        value: targetRadius,
        onUpdate: function () {
            // Update the radius of the gradient and redraw the path
            let r = this.targets()[0].value
            let grd = ctx.createRadialGradient(x, y, ORIG_RADIUS, x, y, r);
            grd.addColorStop(0, currColor);
            grd.addColorStop(.5, "white");
            ctx.fillStyle = grd;
            ctx.fill(currPath);

            activeTileArr[currTile.id] = {tile: currTile, x, y, r, col: currColor}

            let currentTime = new Date().getTime();
            if (currentTime - startTime >= 1000) {
                startTime = currentTime; // Update the start time
                fillRatio = getFillRatio(currTile);
                if (fillRatio === 1) {
                    count++; // Increment the counter variable
                    if (count >= 4) {
                        stopWatercolor();
                        pushCompleteTile(currTile, currColor);
                        fillTile(currTile, "input", false, currColor);
                        currTile.watercolor = false;
                    }
                } else {
                    fillRatio = getFillRatio(currTile)
                }
            }
        }
    });
}

function stopWatercolor() {
    if (animation) {
        animation.kill();
    }
}

export function redrawActiveTiles(offsetY) {
    for (let tileId in activeTileArr) {
        redrawActiveTile(tileId, offsetY)
    }
}

export function redrawActiveTile(tileId, offsetY) {
    let ctx = document.getElementById(canvStr).getContext('2d');
    stopWatercolor();
    let currTile;
    const tile = activeTileArr[tileId]
    if (tile) {
        if (!offsetY) offsetY = 0;
        else {
            currTile = findTile(tileId, offsetY)
        }
        ctx.save();
        ctx.translate(0, -offsetY);
        // console.log('UM? ')

        ctx.restore();
        if (offsetY !== 0 && currTile) {
            activeTileArr[currTile.id] = {tile: currTile, x: tile.x, y: tile.y, r: tile.r, col: getCurrColor()}
            watercolor(tile.x, tile.y - offsetY, tile.r, currTile)

            // ctx.fillStyle = "blue"
            // ctx.fill(currTile.path)
        }

    }
}



function fillActiveTile(x, y, color, r2_, path, off) {
    // let off = 0//getOffsetY()
    let ctx = document.getElementById(canvStr).getContext('2d');
    if (off) ctx.translate(0, -off);

    let grd = ctx.createRadialGradient(x, y, ORIG_RADIUS, x, y, r2_);
    grd.addColorStop(0, color);
    grd.addColorStop(.5, "white");

    ctx.fillStyle = grd
    ctx.fill(path)
    if (off) ctx.translate(0, +off);

}

export function getActiveTileArr() {
    return activeTileArr;
}

function findTile(id, offsetY) {
    const tile = activeTileArr[id]
    if (tile) {
        const bb = tile.tile.bounds // tileXMin, tileXMax, tileYMin, tileYMax
        const midX = bb[0] + (bb[1] - bb[0]) / 2
        const midY = bb[2] + (bb[3] - bb[2]) / 2
        let currTile;
        const ctx = document.getElementById('invis-canvas').getContext("2d");
        const invisCol = ctx.getImageData(tile.x, tile.y - offsetY, 1, 1).data.toString()
        console.log(midX + 'and y ' + (tile.y - offsetY))
        currTile = getTile(tile.y - offsetY, invisCol)
        if (currTile) return currTile
    }
    console.log('DID NOT WORKRR')
}