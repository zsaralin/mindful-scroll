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
let canvStr = 'fill-canvas'

const throttleDelay = 1000 / 100; // Maximum 60 frames per second
// let isAnimationComplete = false;
let animations = []; // Array to store all animation instances
let ctx;

export function watercolor(r2, currTile, currColor, off, redraw, type, x, y) {
    var fillRatio = 0; // Store the initial fill ratio
    var count = 0;
    if (!redraw) {
        fillRatio = getFillRatio(currTile, off,  canvStr);
        if (activeTileArr[currTile.id] || currTile.filled) return; // already active watercolor in tile
        logWaterStart(currTile.id, currColor, type);
        currTile.watercolor = true;
    }
    let currPath = currTile.path;
    let lastUpdate = 0;
    let targetRadius = 500 // New radius to be reached by the animation
    let startTime = new Date().getTime();

    if (!ctx) ctx = document.getElementById(canvStr).getContext('2d');
    let animation = gsap.to({value: r2 ?? ORIG_RADIUS}, {
        duration: 6,
        value: targetRadius,
        onUpdate: function () {
            const currentTime = new Date().getTime();
            if (currentTime - lastUpdate >= throttleDelay) {
                lastUpdate = currentTime;
                // Update the radius of the gradient and redraw the path
                let r = this.targets()[0].value;
                if (!redraw) activeTileArr[currTile.id] = {
                    tile: currTile,
                    x,
                    y,
                    r,
                    col: currColor,
                    smallOff: off,
                    animType: type
                };
                let grd = getGradient(currTile, currColor, r, type, off, x, y)
                fillTileOff(currPath, grd, off)
                if (currentTime - startTime >= 1000) {
                    startTime = currentTime; // Update the start time
                    if (fillRatio === 1) {
                        count++; // Increment the counter variable
                        if (count >= 4) {
                            animation.kill(); // Stop the animation
                            onComplete(); // Trigger the onComplete callback
                        }
                    } else {
                        fillRatio = getFillRatio(currTile, off, canvStr);
                    }
                }
            }
        },
        onComplete: onComplete // Assign the onComplete callback
    });

    animations[currColor] = animation; // Add the animation to the dictionary

    function onComplete() {
        logWaterEnd(currTile.id, currColor, type);
        pushCompleteTile(currTile, currColor);
        fillTileOff(currPath, currColor, off)
        currTile.watercolor = false;
        logFillTile('watercolor', "true", currTile.id, currTile.colors, currTile.fillColor, currTile.fillColors, "null");
        delete activeTileArr[currTile.id];
        delete animations[currColor];
    }
}


export function stopWatercolor() {
    for (let key in animations) {
        if (animations.hasOwnProperty(key)) {
            animations[key].kill(); // Kill each animation instance
        }
    }
}

export function redrawActiveTiles() {
    stopWatercolor();
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
        // setSmallOffset(tile.smallOff - overlapOffset)
        watercolor(tile.r, currTile, tile.col, tile.smallOff - overlapOffset, true, tile.animType, tile.x, tile.y)
        delete activeTileArr[tileId];
    }
}

export function getActiveTileArr() {
    return activeTileArr;
}

function fillTileOff(currPath, currColor, off) {
    ctx.fillStyle = currColor;
    ctx.save();
    ctx.translate(0, -off);
    ctx.fill(currPath);
    ctx.restore();
}

function getGradient(currTile, currColor, offset, type, off, x, y) {
    let [xmin, xmax, ymin, ymax] = currTile.bounds;
    let grd;
    switch (type) {
        case "watercolor":
            grd = ctx.createRadialGradient(x, y + off, ORIG_RADIUS, x, y + off, offset);
            break;
        case "right":
            grd = ctx.createLinearGradient(`${xmin - 300 + offset}`, 0, `${xmax + offset}`, 0);
            break;
        case "left":
            grd = ctx.createLinearGradient(`${xmin + 300 - offset}`, 0, `${xmax - offset}`, 0);
            break;
        case "down":
            grd = ctx.createLinearGradient(0, `${ymin - 300 + offset}`, 0, `${ymax + offset}`);
            break;
        case "up":
            grd = ctx.createLinearGradient(0, `${ymin + 300 - offset}`, 0, `${ymax - offset }`);
            break;
        default:
            break;
    }
    grd.addColorStop(0, currColor);
    grd.addColorStop(1, "white");
    return grd;
}
