import {getCurrColor} from "../components/Stroke/StrokeColor";

let fillTileArr = [] // fully coloured tiles

export function redrawTiles(){
    fillTileArr.forEach(tile => {
        fillCompleteTile(tile)
    })
}

function fillCompleteTile(tile) {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.fillStyle = tile.color
    ctx.fill(tile.path)
}

export function pushCompleteTile(tile, color){
    fillTileArr.push(
        {
            path: tile,
            color: color
        }
    )}

export function completeTile(currTile) {
    fillCompleteTile(currTile)
    pushCompleteTile(currTile.path, getCurrColor())
}