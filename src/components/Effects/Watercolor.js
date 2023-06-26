import {getTile, oldOverlapOffset, overlapOffset, setSmallOffset, smallOffset} from "../Tiling/Tiling3";
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
import {oldOverlapB} from "../BasicVersion/AddShapes";
import {logFillTile, logWaterEnd, logWaterStart} from "../Logging/FillTileLog";
import {colorCode} from "../Tile/FillTile/ColourFn";

let activeTileArr = {} // semi coloured tiles (gradient)
const ORIG_RADIUS = LINE_WIDTH;
let initFill;
let fillCol;
let numActiveTiles = -1;

let canvStr = TOP_CANV

let animation;
let lastUpdate = 0;
const throttleDelay = 1000 / 40; // Maximum 60 frames per second
// let isAnimationComplete = false;
let animations = []; // Array to store all animation instances

export function watercolor(x, y, r2, currTile, color) {
    let isAnimationComplete = false;
    let currColor = color ? color : getCurrColor();
    if (!color) {
        logWaterStart(currTile.id, currColor)
        if (activeTileArr[currTile.id]) return; // already active watercolor in tile
    }
    currTile.watercolor = true;
    let currPath = currTile.path;
    numActiveTiles += 1;
    var count = 0;
    var fillRatio = 0; // Store the initial fill ratio
    let lastUpdate = 0;

    let targetRadius = 500; // New radius to be reached by the animation
    let startTime = new Date().getTime();
    let animation;

    let ctx = document.getElementById(canvStr).getContext('2d');

    animation = gsap.to({value: r2 ?? ORIG_RADIUS}, {
        duration: 10,
        value: targetRadius,
        onUpdate: function () {
            if (isAnimationComplete) {
                console.log(Object.keys(activeTileArr).length);
                animation.kill(); // Stop the animation
                isAnimationComplete = false;
                delete activeTileArr[currTile.id];
                return;
            }

            const currentTime = new Date().getTime();
            if (currentTime - lastUpdate >= throttleDelay) {
                lastUpdate = currentTime;
                // Update the radius of the gradient and redraw the path
                let r = this.targets()[0].value;
                let grd = ctx.createRadialGradient(x, y + smallOffset, ORIG_RADIUS, x, y + smallOffset, r);
                grd.addColorStop(0, currColor);
                grd.addColorStop(.5, "white");
                ctx.fillStyle = grd;
                ctx.save();
                ctx.translate(0, -smallOffset);
                ctx.fill(currPath);
                ctx.restore();

                if (!color) activeTileArr[currTile.id] = {tile: currTile, x, y, r, col: currColor};

                if (currentTime - startTime >= 1000) {
                    startTime = currentTime; // Update the start time
                    if (fillRatio === 1) {
                        count++; // Increment the counter variable
                        if (count >= 4) {
                            isAnimationComplete = true;
                            logWaterEnd(currTile.id, currColor);
                            pushCompleteTile(currTile, currColor);
                            fillTile(currTile, "input", false, currColor);
                            currTile.watercolor = false;
                            logFillTile('watercolor', "true", currTile.id, currTile.colors, currTile.fillColor, currTile.fillColors, "null");
                            delete activeTileArr[currTile.id];
                            console.log(Object.keys(activeTileArr).length);
                            return;
                        }
                    } else {
                        fillRatio = getFillRatio(currTile);
                    }
                }
            }
        }
    });
    animations.push(animation); // Add the animation to the array
}


export function stopWatercolor() {
    for (let i = 0; i < animations.length; i++) {
        animations[i].kill(); // Kill each animation instance
    }
}

export function redrawActiveTiles() {
    stopWatercolor();
    // console.log('LENGHTTTT ' + Object.keys(activeTileArr).length)
    for (let tileId in activeTileArr) {
        redrawActiveTile(tileId)
    }
}

export function redrawActiveTile(tileId, offsetY) {
    // let ctx = document.getElementById(canvStr).getContext('2d');
    let currTile;
    const tile = activeTileArr[tileId]
    if (tile) {
        currTile = tile.tile
        tile.y = tile.y + overlapOffset
        setSmallOffset(overlapOffset)
        watercolor(tile.x, tile.y, tile.r, currTile, tile.col)
        delete activeTileArr[tileId];
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
