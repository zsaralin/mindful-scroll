import {getTile} from "../Tiling/TilingArr";
import {getCurrColor} from "../Stroke/StrokeColor";
import {LINE_WIDTH} from "../ScaleConstants";
import {pushCompleteTile} from "../../Tile/CompleteTile";

let activeTileArr = []; // semi coloured tiles (gradient)
const ORIG_RADIUS = LINE_WIDTH;

export function watercolor(x, y, invisCol, r2) {
    let activeIndex = activeTileArr.length;
    let currColor = getCurrColor();
    let currTile = getTile(y, invisCol).path
    let initFill = setInterval(function () {
        r2+=2
        fillActiveTile(x, y, currColor, r2, currTile)
        // activeTileArr[activeIndex] = ({path: currTile, color: currColor, r2: r2, x: x, y: y})
        if (r2 > 50) {
            clearInterval(initFill)
            // activeTileArr.shift()
        }
    }, 100)

    let fillCol = setInterval(function () {
        r2+=5
        fillActiveTile(x, y, currColor, r2, currTile)
        activeTileArr[activeIndex] = ({path: currTile, color: currColor, r2: r2, x: x, y: y})
        if (r2 > 2000) {
            clearInterval(fillCol)
            activeTileArr.shift()
            pushCompleteTile(currTile, currColor)
        }
    }, 50)
}

export function redrawActiveTiles() {
    activeTileArr.forEach(activeTile => {
        fillActiveTile(activeTile.x, activeTile.y, activeTile.color, activeTile.r2, activeTile.path)
    })
}

function fillActiveTile(x, y, color, r2_, path) {
    let ctx = document.getElementById('canvas').getContext('2d');
    var grd = ctx.createRadialGradient(x, y, ORIG_RADIUS, x, y, r2_);
    grd.addColorStop(0, color);
    grd.addColorStop(.5, "white");
    ctx.fillStyle = grd
    ctx.fill((path))
}

