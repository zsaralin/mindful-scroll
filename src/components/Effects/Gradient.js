import {fillTileColors, isSimilar} from "./ColorTheory";
import image from './noise.png'
import {dither} from "./Dither";
import {setCols} from "../Tile/FillTile/ColourFn";
import {smallOffset} from "../Tiling/Tiling3";

export function fillRadialGradient(tile, col0, col1) {
    const ctx = document.getElementById('top-canvas').getContext('2d');
    ctx.save()
    ctx.translate(0,-smallOffset)
    const [xMin, xMax, yMin, yMax] = tile.bounds
    const midX = (xMax + xMin) / 2;
    const midY = (yMax + yMin) / 2
    const grd = ctx.createRadialGradient(midX, midY, 0, midX, midY, 100);
    const cols = tile.fillColors ? tile.fillColors : setCols(tile, col0, col1)

    addColorStop(tile, grd, cols)

    ctx.fillStyle = grd
    ctx.fill(tile.path)
    ctx.restore()
}

export function fillLinearGradient(tile, dir, col0, col1) {
    const [xMin, xMax, yMin, yMax] = tile.bounds
    const midX = (xMax + xMin) / 2;
    const midY = (yMax + yMin) / 2
    const ctx = document.getElementById('top-canvas').getContext('2d');
    ctx.save()
    ctx.translate(0,-smallOffset)
    let grd;
    if (dir === "diag") grd = Math.random() < .5 ?  ctx.createLinearGradient(xMin, yMin, xMax, yMax) : ctx.createLinearGradient(xMin, yMax, xMax, yMin)
    else if (dir === 'horiz') grd = ctx.createLinearGradient(xMin, midY, xMax, midY)
    else if (dir === 'vert') grd = ctx.createLinearGradient(midX, yMin, midX, yMax)

    const cols = tile.fillColors ? tile.fillColors : setCols(tile, col0, col1)
    console.log('cols : ' + cols)
    addColorStop(tile, grd, cols)
    ctx.fillStyle = grd
    ctx.fill(tile.path)
    ctx.restore()

}

function addColorStop(tile, grd, arr) {
    const i = Math.max(.1, 1 / (arr.length - 1));
    let d = 0, q = 0;
    while (q < arr.length && d <= 1) {
        let col = arr[q]
        console.log('COL S ' + col)
        if (typeof col !== "string") {
            col = 'rgba(' + col.data + ')'
        }
        grd.addColorStop(d, col);
        d += i
        q++
    }
}

export function getSimilarColours(tile) {
    let similarThres = 50;
    let arr = tile.colors
    let returnArr = Array.from({length: tile.colors.length}, () => []);
    console.log('all colors : ' + tile.colors)

    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i]
        returnArr[i].push(temp)
        for (let y = i + 1; y < arr.length; y++) {
            if (isSimilar(temp, arr[y]), similarThres) returnArr[i].push(arr[y])
        }
    }
    return returnArr.reduce((acc, curr) => curr.length > acc.length ? curr : acc, []);
}

export function getDifferentCols(tile) {
    let arr = tile.colors
    let returnArr = Array.from({length: tile.allColors.length}, () => []);
    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i]
        returnArr[i].push(temp)
        for (let y = i + 1; y < arr.length; y++) {
            if (!isSimilar(temp, arr[y])) returnArr[i].push(arr[y])
        }
    }
    return returnArr.reduce((acc, curr) => curr.length > acc.length ? curr : acc, []);
}

