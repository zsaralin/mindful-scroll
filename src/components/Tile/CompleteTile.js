import {getCurrColor} from "../Stroke/StrokeColor";
import {redrawTilings} from "../Tiling/TilingArr";
import {getOffsetY} from "../PageScroll";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {pushStroke, pushStrokeUnder} from "../Stroke/StrokeArr";
import {drawStroke, drawStrokeUnder} from "../Stroke/Stroke";

let fillTileArr = [] // fully coloured tiles
let completeTileOn = true;

export function redrawTiles() {
    fillTileArr.forEach(tile => {
        fillCompleteTile(tile)
    })
}

// function fillCompleteTile(tile, color) {
//     // let ctx = document.getElementById('canvas').getContext('2d');
//     // ctx.fillStyle = color ? color : tile.color
//     // ctx.fill(tile.path)
// }

function fillCompleteTile(tile) {
    tile.filled = true;
    let ctx = document.getElementById('canvas').getContext('2d');
    let tileDim = tile.tile
    let startX = tileDim[0];
    let startY = tileDim[2] ;
    let endX = tileDim[1];
    let endY = tileDim[3] ;
    let fillColor = getCurrColor()
    let lineWidth = getLineWidth()
    for (let x = startX; x < endX; x = x + 2) {
        for (let y = startY; y < endY; y = y + 2) {
            if (ctx.isPointInPath(tile.path, x, y)) {
                if (ctx.getImageData(x, y, 1, 1).data.toString() == '0,0,0,0') {
                    pushStrokeUnder(x, y , x, y, lineWidth, fillColor);
                    drawStrokeUnder(x, y , x, y, lineWidth, fillColor);
                } else {
                    fillColor = 'rgba(' + ctx.getImageData(x, y, 1, 1).data.toString() + ')'
                }
            }
        }
    }
}

export function pushCompleteTile(tile, color) {
    fillTileArr.push(
        {
            path: tile,
            color: color
        }
    )
}

export function completeTile(currTile, color) {
    if (completeTileOn) {
        pushCompleteTile(currTile.path, color)
        redrawTilings()
        fillCompleteTile(currTile, color)
    }
}

export function triggerCompleteTile() {
    completeTileOn = !completeTileOn
}