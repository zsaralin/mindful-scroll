import {
    complem, interpolateHslColor,
    invert,
    invertHue,
    isSimilar,
    meanHue,
    meanHueHSL,
    rgbToHsl,
    splitComplem
} from "../../Effects/ColorTheory";
import {getDifferentCols, getSimilarColours} from "../../Effects/Gradient";
import {leastUsed4, mostUsed, mostUsed4} from "../../Effects/CommonColours";
import {getColourPal} from "../../Stroke/Color/StrokeColor";

export function setCols(tile, col0, col1){
    let cols; colorCode = "null"
    if (tile.colors.length === 1) {
        cols = setCol1(tile, col0)
    } else {
        cols = setCol2Plus(tile, col1)
    }
    tile.fillColors = cols;
    return cols
}

function getShades(col) {
    console.log('col is ' + col)
    let lighter;
    if (typeof col === "string" && col.startsWith('rgba')) {
        const rgbaValues = col.substring(5, col.length - 1).split(",").map(parseFloat);
        const [h, s, l] = rgbToHsl(...rgbaValues);
        col = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
    if (parseInt(col.match(/\d+(?=%\))/)[0]) > 70) { // Check if last value (l in hsl) is greater than 70
        lighter = false; // Set randomSign1 to -1 if last value is greater than 70
    } else if (parseInt(col.match(/\d+(?=%\))/)[0]) < 30) {
        lighter = true; // Set randomSign1 to -1 if last value is greater than 70
    } else {
        lighter = Math.random() < 0.5; // randomly choose true or false
    }
    const randomSign = lighter ? 1 : -1;
    const q = 10;
    const numCols = Math.floor(Math.random() * 3) + 2; // 2 to 4 inclusive
    const cols = []
    for (let i = 0; i < numCols; i++) {
        cols.push(col.replace(/\d+(?=%\))/, parseInt(col.match(/\d+(?=%\))/)[0]) + i * q * randomSign));
    }
    return cols;
}

export let colorCode = "null"
function setCol1(tile, weightsI) {
    // let equ = 1/6
    // let weights = [equ, equ, equ, equ, equ, equ];
    let weights = weightsI ? weightsI : [0, 0, 0, 0, 0, 1];
    let randomNum = Math.random();
    let cumulativeWeight = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        if (randomNum < cumulativeWeight) {
            colorCode = `1_${i}`;
            switch (i) {
                case 0:
                    console.log('case 0')
                    return getShades(tile.colors[0]);
                case 1:
                    console.log('case 1')
                    return [tile.colors[0], invert(tile.colors[0])];
                case 2:
                    console.log('case 2')
                    return [tile.colors[0], invertHue(tile.colors[0])];
                case 3:
                    console.log('case 3')
                    return [tile.colors[0], complem(tile.colors[0])];
                case 4:
                    console.log('case 4')
                    let split = splitComplem(tile.colors[0])
                    return [tile.colors[0], split[0], split[1]];
                case 5:
                    console.log('case 5')
                    let col0 = getColourPal()[Math.floor(Math.random() * 4)]
                    while(tile.colors[0] === col0) col0 = getColourPal()[Math.floor(Math.random() * 4)]
                    return [tile.colors[0], col0]
            }
        }
    }
}

function setCol2Plus(tile) {
    let n = 16;
    const weights = new Array(n).fill(1/n); // creates an array of n-1 zeros
    // const weights = new Array(n).fill(0); // creates an array of n-1 zeros
    // weights[13] = 1

    let randomNum = Math.random();
    let cumulativeWeight = 0;
    let most; let most4; let split; let mean;
    for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        if (randomNum < cumulativeWeight) {
            colorCode = `2Plus_${i}`;
            switch (i) {
                // [2,3,4,5] at random
                case 0:
                    console.log('case 0')
                    return Array.from({length: Math.min(tile.colors.length, Math.floor(Math.random() * 4) + 2)}, () => tile.colors.splice(Math.floor(Math.random() * tile.colors.length), 1)[0]);
                // [2,3,4,5] at random of similar cols
                case 1:
                    console.log('case 1')
                    let simCols = getSimilarColours(tile)
                    console.log('simCols is : ' + simCols)
                    return Array.from({length: Math.min(simCols.length, Math.floor(Math.random() * 4) + 2)}, () => simCols.splice(Math.floor(Math.random() * simCols.length), 1)[0]);
                case 2:
                    console.log('case 2')
                    let diffCols = getDifferentCols(tile)
                    let ans = Array.from({length: Math.min(diffCols.length, Math.floor(Math.random() * 4) + 2)}, () => diffCols.splice(Math.floor(Math.random() * diffCols.length), 1)[0]);
                    if (ans.length > 1) return ans // if there's 2 or more different cols
                    else {
                        setCol1(tile)
                    }
                // [2,3,4] most used
                case 3:
                    console.log('case 3')
                    most4 = mostUsed4(tile)
                    return Array.from({length: Math.min(most4.length, Math.floor(Math.random() * 3) + 2)}, () => most4.splice(Math.floor(Math.random() * most4.length), 1)[0]);
                case 4:
                    console.log('case 4')
                    most = mostUsed(tile)
                    split = splitComplem(most)
                    return Math.random() < 0.5 ? [most, complem(most)] : [most, split[0], split[1]]
                case 5:
                    console.log('case 5')
                    most = mostUsed(tile)
                    return [most, invert(most)]
                case 6:
                    console.log('case 6')
                    most = mostUsed(tile)
                    return [most, invertHue(most)]
                case 7:
                    console.log('case 7')
                    mean = meanHue(tile.allColors)
                    console.log('mean is ' + mean)
                    return [mean, invert(mean)]
                case 8:
                    console.log('case 8')
                    mean = meanHue(tile.allColors)
                    return [mean, invertHue(mean)]
                case 9:
                    console.log('case 9')
                    mean = meanHue(tile.allColors)
                    split = splitComplem(mean)
                    return Math.random() < 0.5 ? [mean, complem(mean)] : [mean, split[0], split[1]]
                case 10:
                    console.log('case 10')
                    most = mostUsed(tile)
                    mean = meanHue(tile.allColors)
                    console.log('mean ' + mean + ' most ' + most )
                    if (!isSimilar(most, mean, 20)) return [most,mean]
                    else setCol2Plus(tile)
                case 11:
                    console.log('case 11')
                    mean = meanHue(tile.allColors)
                    return getShades(mean)
                case 12:
                    console.log('case 12')

                    most = mostUsed(tile)
                    return getShades(most)
                // 2 most used colours, and a colour in between
                case 13:
                    console.log('case 13')
                    most = mostUsed4(tile).slice(0, 2)
                    if (most.length > 1 && !isSimilar(most[0], most[1], 20)) {
                        return [most[0], interpolateHslColor(most[0], most[1]), most[1]]
                    } else setCol2Plus(tile)
                // Colours from Colour Palette
                case 14:
                    console.log('case 14')
                    most = mostUsed4(tile).slice(0, 2)
                    let col0 = getColourPal()[Math.floor(Math.random() * 4)]
                    while(most === col0) col0 = getColourPal()[Math.floor(Math.random() * 4)]
                    return [most[0], most[1], col0]
                case 15:
                    console.log('case 15')
                    mean = meanHue(tile.allColors)
                    let col1 = getColourPal()[Math.floor(Math.random() * 4)]
                    while(mean === col1) col1 = getColourPal()[Math.floor(Math.random() * 4)]
                    return [mean, col1]
            }
        }
    }
}