import {getCurrColor} from "../Stroke/StrokeColor";
import {redrawTilings} from "../Tiling/TilingArr";

let fillTileArr = [] // fully coloured tiles

export function redrawTiles(){
    fillTileArr.forEach(tile => {
        fillCompleteTile(tile)
    })
}

function fillCompleteTile(tile, color) {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.fillStyle = color ? color: tile.color
    ctx.fill(tile.path)
}

export function pushCompleteTile(tile, color){
    fillTileArr.push(
        {
            path: tile,
            color: color
        }
    )}

export function completeTile(currTile, color) {
    pushCompleteTile(currTile.path, color)
    redrawTilings()
    fillCompleteTile(currTile, color)
}