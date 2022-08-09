import {getCurrColor} from "./Stroke";
import {getCurrentPathDict} from "./TilingArr";

let activeTileArr = []; // semi coloured tiles (gradient)
let fillTileArr = [] // fully coloured tiles
const ORIG_RADIUS = 25;
// let r2 = 25; // next radius

export function fillTile(x, y, invisCol, r2) {
    let activeIndex = activeTileArr.length;
    let currColor = getCurrColor();
    let currTiling = getCurrentPathDict(y)
    let currTile = currTiling['rgb(' + invisCol.slice(0, -4) + ')']
    let initFill = setInterval(function () {
        r2++
        fillActiveTile(x, y, currColor, r2, currTile)
        // activeTileArr[activeIndex] = ({path: currTile, color: currColor, r2: r2, x: x, y: y})
        if (r2 > 50) {
            clearInterval(initFill)
            // activeTileArr.shift()
        }
    }, 10)

    let fillCol = setInterval(function () {
        r2++
        fillActiveTile(x, y, currColor, r2, currTile)
        activeTileArr[activeIndex] = ({path: currTile, color: currColor, r2: r2, x: x, y: y})
        if (r2 > 1000) {
            clearInterval(fillCol)
            activeTileArr.shift()
            fillTileArr.push(
                {
                    path: currTile,
                    color: currColor
                }
            )
        }
    }, 20)
}

export function redrawTiles() {

    activeTileArr.forEach(activeTile => {
        fillActiveTile(activeTile.x, activeTile.y, activeTile.color, activeTile.r2, activeTile.path)
    })
    fillTileArr.forEach(tile => {
        fillCompleteTile(tile)
    })
}

function fillActiveTile(x, y, color, r2_, path) {
    let tilingCtx = document.getElementById('tiling-canvas').getContext('2d');
    var grd = tilingCtx.createRadialGradient(x, y, ORIG_RADIUS, x, y, r2_);
    grd.addColorStop(0, color);
    grd.addColorStop(.5, "white");
    tilingCtx.fillStyle = grd
    tilingCtx.fill((path))
    tilingCtx.stroke((path))

}

function fillCompleteTile(tile) {
    let tilingCtx = document.getElementById('tiling-canvas').getContext('2d');
    tilingCtx.fillStyle = tile.color
    tilingCtx.fill(new Path2D(tile.path))
    tilingCtx.stroke(new Path2D(tile.path))
    tilingCtx.closePath()
}