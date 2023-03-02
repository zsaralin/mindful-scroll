import {fillTileColors, isSimilar} from "./ColorTheory";

export function fillRadialGradient(tile, similar) {
    let [xMin, xMax, yMin, yMax] = tile.tile
    let midX = (xMax + xMin) / 2;
    let midY = (yMax + yMin) / 2
    let ctx = document.getElementById('canvas').getContext('2d');
    let grd = ctx.createRadialGradient(midX, midY, 0, midX, midY, 100);
    addColorStop(tile, grd, similar)
    ctx.fillStyle = grd
    ctx.fill(tile.path)

}

export function fillLinearGradient(tile, dir, similar) {
    let [xMin, xMax, yMin, yMax] = tile.tile
    let midX = (xMax + xMin) / 2;
    let midY = (yMax + yMin) / 2
    let ctx = document.getElementById('canvas').getContext('2d');
    let grd;
    if (dir === "diag") grd = ctx.createLinearGradient(xMin, yMin, xMax, yMax)
    else if (dir === 'horiz') grd = ctx.createLinearGradient(xMin, midY, xMax, midY)
    else if (dir === 'vert') grd = ctx.createLinearGradient(midX, yMin, midX, yMax)
    addColorStop(tile, grd, similar)
    ctx.fillStyle = grd
    ctx.fill(tile.path)
}

function addColorStop(tile, grd, similar) {
    let arr = shuffleArray(similar ? getSimilarColours(tile) : tile.colors)
    let i = Math.round(1 / arr.length * 10) / 10
    if (i < .1) i = .1
    console.log(i)
    let d = 0, q = 0;
    while (q < arr.length && d <= 1) {
        grd.addColorStop(d, arr[q]);
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
    let arr = tile.colors
    let returnArr = Array.from({length: tile.colors.length}, () => []);
    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i]
        returnArr[i].push(temp)
        for (let y = i + 1; y < arr.length; y++) {
            if (isSimilar(temp, arr[y])) returnArr[i].push(arr[y])
        }
    }
    return returnArr.reduce((acc, curr) => curr.length > acc.length ? curr : acc, []);
}



