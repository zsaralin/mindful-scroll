import {fillTileColors, isSimilar} from "./ColorTheory";
import image from './noise.png'
import {dither} from "./Dither";

export function fillRadialGradient(tile, similar) {
    let [xMin, xMax, yMin, yMax] = tile.bounds
    let midX = (xMax + xMin) / 2;
    let midY = (yMax + yMin) / 2
    let ctx = document.getElementById('top-canvas').getContext('2d');
    let grd = ctx.createRadialGradient(midX, midY, 0, midX, midY, 100);
    if (tile.colors.length === 1) {
        grd.addColorStop(0, tile.colors[0])
        const values = tile.colors[0].split(",");
        if (Math.random() < 0.5) {
            // Lighter color
            values[2] = Math.min(parseInt(values[2]) + 55, 100) + "%"; // lighter colour
        } else {
            // Darker color
            values[2] = Math.max(parseInt(values[2]) - 45, 0) + "%"; // darker colour
        }
        grd.addColorStop(1, values.join(","))
    } else addColorStop(similar ? getSimilarColours(tile) : tile.allColors, grd)
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
    if (tile.colors.length === 1) {
        grd.addColorStop(0, tile.colors[0])
        const values = tile.colors[0].split(",");
        if (Math.random() < 0.5) {
            // Lighter color
            values[2] = Math.min(parseInt(values[2]) + 55, 100) + "%"; // lighter colour
        } else {
            // Darker color
            values[2] = Math.max(parseInt(values[2]) - 45, 0) + "%"; // darker colour
        }
        grd.addColorStop(1, values.join(","))
    } else addColorStop(similar ? getSimilarColours(tile) : tile.allColors, grd)
    ctx.fillStyle = grd
    ctx.fill(tile.path)
}

function addColorStop(colors, grd) {
    let arr = shuffleArray(colors)
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

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}


function getSimilarColours(tile) {
    let arr = tile.allColors
    let returnArr = Array.from({length: tile.allColors.length}, () => []);
    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i]
        returnArr[i].push(temp)
        for (let y = i + 1; y < arr.length; y++) {
            if (isSimilar(temp, arr[y])) returnArr[i].push('rgba(' + arr[y].data + ')')
        }
    }
    return returnArr.reduce((acc, curr) => curr.length > acc.length ? curr : acc, []);
}

