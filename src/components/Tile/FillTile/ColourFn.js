import {complem, invert, invertHue, isSimilar, meanHue, splitComplem} from "../../Effects/ColorTheory";
import {getDifferentCols, getSimilarColours} from "../../Effects/Gradient";
import {leastUsed4, mostUsed, mostUsed4} from "../../Effects/CommonColours";

export function setCols(tile) {
    let cols;
    if (tile.colors.length === 1) {
        cols = setCol1(tile)
    } else {
        cols = setCol2Plus(tile)
    }
    console.log('cols ' + cols)
    return cols
}

function getShades(col) {
    console.log('col is ' + col)
    let lighter;
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

function setCol1(tile) {
    let weights = [0.1, 0.1, 0.1, 0.1, 0.6];
    let randomNum = Math.random();
    let cumulativeWeight = 0;
    for (let i = 0; i < 5; i++) {
        cumulativeWeight += weights[i];
        console.log('hiiii  ' + tile.colors[0])
        if (randomNum < cumulativeWeight) {
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
            }
        }
    }
}

function setCol2Plus(tile) {
    let weights = [0.6, 0.1, 0.1, 0.1, 0.1];
    let randomNum = Math.random();
    let cumulativeWeight = 0;
    for (let i = 0; i < 5; i++) {
        cumulativeWeight += weights[i];
        if (randomNum < cumulativeWeight) {
            console.log('I IS: ' + i)
            switch (i) {
                // [2,3,4,5] at random
                case 0:
                    return Array.from({length: Math.min(tile.colors.length, Math.floor(Math.random() * 4) + 2)}, () => tile.colors.splice(Math.floor(Math.random() * tile.colors.length), 1)[0]);
                // [2,3,4,5] at random of similar cols
                case 1:
                    let simCols = getSimilarColours(tile)
                    return Array.from({length: Math.min(simCols.length, Math.floor(Math.random() * 4) + 2)}, () => simCols.splice(Math.floor(Math.random() * simCols.length), 1)[0]);
                case 2:
                    let diffCols = getDifferentCols(tile)
                    return Array.from({length: Math.min(diffCols.length, Math.floor(Math.random() * 4) + 2)}, () => diffCols.splice(Math.floor(Math.random() * diffCols.length), 1)[0]);
                // [2,3,4] most used
                case 3:
                    let most4 = mostUsed4(tile)
                    return Array.from({length: Math.min(most4.length, Math.floor(Math.random() * 3) + 2)}, () => most4.splice(Math.floor(Math.random() * most4.length), 1)[0]);
                case 4:
                    let most = mostUsed(tile)
                    return Math.random() < 0.5 ? [most, complem(most)] : [most, complem(most), complem(complem(most))]
                case 5:
                    most = mostUsed(tile)
                    return [most, invert(most)]
                case 6:
                    most = mostUsed(tile)
                    return [most, invertHue(most)]
                case 7:
                    let mean = meanHue(tile.allColors)
                    return [mean, invert(mean)]
                case 8:
                    mean = meanHue(tile.allColors)
                    return [mean, invertHue(mean)]
                case 9:
                    mean = meanHue(tile.allColors)
                    return Math.random() < 0.5 ? [mean, complem(mean)] : [mean, complem(mean), complem(complem(mean))]
                case 10:
                    most = mostUsed(tile)
                    mean = meanHue(tile.allColors)
                    if (!isSimilar(most, mean)) return [mostUsed(tile), meanHue(tile, tile.allColors)]
                    else {
                        setCol2Plus(tile)
                    }
                case 11:
                    mean = meanHue(tile.allColors)
                    return getShades(mean)
                case 12:
                    most = mostUsed(tile)
                    return getShades(most)
                // 2 most used colours, and a colour in between
                case 12:
                    most = mostUsed4(tile).slice(0, 2)
                    if (!isSimilar(most[0], most[1])) {
                        return [most[0], meanHue([most[0], most[1]]), most[1]]
                    } else {
                        setCol2Plus(tile)
                    }
            }
        }
    }
}