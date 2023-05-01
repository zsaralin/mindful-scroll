import {fillTileColors, isSimilar} from "./ColorTheory";
import image from './noise.png'
import {dither} from "./Dither";
import {setCols} from "../Tile/FillTile/ColourFn";

export function fillRadialGradient(tile, similar) {
    let [xMin, xMax, yMin, yMax] = tile.bounds
    let midX = (xMax + xMin) / 2;
    let midY = (yMax + yMin) / 2
    let ctx = document.getElementById('top-canvas').getContext('2d');
    let grd = ctx.createRadialGradient(midX, midY, 0, midX, midY, 100);
    addColorStop(tile, grd)

    ctx.fillStyle = grd
    ctx.fill(tile.path)
}

export function fillLinearGradient(tile, dir, similar) {
    let [xMin, xMax, yMin, yMax] = tile.bounds
    console.log('hello')
    let midX = (xMax + xMin) / 2;
    let midY = (yMax + yMin) / 2
    let ctx = document.getElementById('top-canvas').getContext('2d');
    let grd;
    if (dir === "diag") grd = ctx.createLinearGradient(xMin, yMin, xMax, yMax)
    else if (dir === 'horiz') grd = ctx.createLinearGradient(xMin, midY, xMax, midY)
    else if (dir === 'vert') grd = ctx.createLinearGradient(midX, yMin, midX, yMax)
     addColorStop(tile, grd)
    ctx.fillStyle = grd
    ctx.fill(tile.path)
}

function addColorStop(tile, grd) {
    let arr = setCols(tile)
    const i = Math.max(.1, 1 / (arr.length - 1));
    let d = 0, q = 0;
    while (q < arr.length && d <= 1) {
        let col = arr[q]
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

