import {addToColDict, fillColDict, getColArr} from "./MeanHue";

let uniqColDict = {}

export function fillRadialGradient(tile){
    let [xMin, xMax, yMin, yMax] = tile.tile
    let midX = (xMax+xMin)/2; let midY = (yMax+yMin)/2
    let ctx = document.getElementById('canvas').getContext('2d');
    let grd = ctx.createRadialGradient(midX, midY, 0, midX, midY,100);
    addColorStop(tile, grd)
    ctx.fillStyle = grd
    ctx.fill(tile.path)
}
export function fillLinearGradient(tile, dir){
    let [xMin, xMax, yMin, yMax] = tile.tile
    let midX = (xMax+xMin)/2; let midY = (yMax+yMin)/2
    let ctx = document.getElementById('canvas').getContext('2d');
    let grd = ctx.createLinearGradient(xMin, yMin, xMax, yMax)
    if (dir === 'horiz') grd = ctx.createLinearGradient(xMin, midY, xMax, midY)
    if (dir === 'vert') grd = ctx.createLinearGradient(midX, yMin, midX, yMax)
    addColorStop(tile, grd)
    ctx.fillStyle = grd
    ctx.fill(tile.path)
}


export function addToUniqColDict(tile, col){
    uniqColDict[tile.id] = uniqColDict[tile.id] || []
    uniqColDict[tile.id].push(col)
}

function addColorStop(tile, grd){
    let i = Math.round(1/uniqColDict[tile.id].length * 10) / 10
    if (i<.1) i = .1
    let d = 0, q= 0;
    while ( q < uniqColDict[tile.id].length){
        grd.addColorStop(d, uniqColDict[tile.id][q]);
        d += i
        q++
    }
}

