import {afterBackFillFn, afterFillFn, solidFillFn} from "./CompleteTile2";
import {getCurrColor} from "../../Stroke/Color/StrokeColor";
import {complem, fillTileColors, invert, invertHue, meanHue} from "../../Effects/ColorTheory";
import {leastUsed, mostUsed} from "../../Effects/CommonColours";
import {dither} from "../../Effects/Dither";

const sections = [0, 1, 2]// 2, 3, 4, 5, 6, 7, 8];
const solidFill = ["first", "last", "meanHue", "most", "least"]
const afterFill = ["complem", "inverseHue"]
const afterBackFill = ["dither", "blur", "pixel"]
const under = [true, false]
const ditherI = [1, 2, 3, 4, 5]
const ditherW = [1, 2, 3, 2, 1];

export function getFillType() {
    const num = Math.random()  <.5 ? 0 : 2//sections[Math.floor(Math.random() * sections.length)];
    if (num === 0) {
        const weights = [5, 3, 2, 1, 1]
        const totFillTypes = [1, 2, 3, 4, 5]
        const n = helper(weights, totFillTypes) // # of solid fill types
        const fillTypes = chooseRandomElements(solidFill, n)
        const fillW = generateRandomWeights(fillTypes)
        const underW = generateRandomWeights(under)
        return {fillNum: 0, fillTypes, fillW, underW}
    } else if (num === 1) {
        const weights = [4, 1]
        const totFillTypes = [1, 2]
        const n = helper(weights, totFillTypes) // # of solid fill types
        const fillTypes = chooseRandomElements(solidFill, n)
        const fillW = generateRandomWeights(fillTypes)
        const underW = generateRandomWeights(under)
        const afterW = Math.random() < .5 ? generateRandomWeights(afterFill) : 0
        console.log('aftrrW  ' + afterW)
        const randomNumber = Math.random();
        const ditherW = randomNumber < 0.5 ? 0 : randomNumber
        return {fillNum: 1, fillTypes, fillW, underW, afterW, ditherW}
    } else if (num === 2) {
        const weights = [1,1,1,1,1]
        const totFillTypes = [1, 2, 3, 4, 5]
        const n = helper(weights, totFillTypes) // # of solid fill types
        const fillTypes = chooseRandomElements(solidFill, n)
        const fillW = generateRandomWeights(fillTypes)
        const afterW = [4,2,1]
        const totAfterFillTypes= [1,2,3]
        const m = helper(afterW, totAfterFillTypes) // # of after fill types
        const afterFillTypes = chooseRandomElements(afterBackFill, m)
        const afterBackW = generateRandomWeights(afterFillTypes)
        return {fillNum: 2, fillTypes, fillW, afterFillTypes, afterBackW}
    }

}

export function completeTile2(tile, tiling) {
    fillTileColors(tile)
    console.log(tiling.fillInfo.fillNum)
    if (tiling.fillInfo.fillNum === 0) {
        const underType = helper(tiling.fillInfo.underW, under)
        const fillType = helper(tiling.fillInfo.fillW, tiling.fillInfo.fillTypes)
        solidFillFn(tile, fillType, underType)
    } else if (tiling.fillInfo.fillNum === 1) {
        const underType = helper(tiling.fillInfo.underW, under)
        const fillType = helper(tiling.fillInfo.fillW, tiling.fillInfo.fillTypes)
        if (tiling.fillInfo.afterW === 0) {
            solidFillFn(tile, fillType, underType)
        } else {
            const col = getCol(tile, fillType)
            console.log('LOOOOOOOOOK ' + col + ' and ' + fillType + ' and ' + tiling.fillInfo.afterW)
            const afterType = helper(tiling.fillInfo.afterW, afterFill)
            afterFillFn(tile, afterType, underType, col)
        }
        const ditherBool = Math.random() < tiling.fillInfo.ditherW ? true : false;
        const i = helper(ditherW, ditherI)
        if (ditherBool) dither(tile, i)
    } else if(tiling.fillInfo.fillNum === 2){
        const fillType = helper(tiling.fillInfo.fillW, tiling.fillInfo.fillTypes)
        solidFillFn(tile, fillType, true)
        const afterBackFillType = helper(tiling.fillInfo.afterBackW, tiling.fillInfo.afterFillTypes)
        if(afterBackFillType === "dither") afterBackFillFn(tile, afterBackFillType, helper(ditherW, ditherI))
        if(afterBackFillType === "pixel") afterBackFillFn(tile, afterBackFillType, helper(ditherW, [3,4,5,6,7]))
        else{afterBackFillFn(tile, afterBackFillType)}
    }
}

function getCol(tile, str) {
    let tempCol;
    if (str === "first") tempCol = tile.firstCol
    else if (str === "last") tempCol = getCurrColor()
    else if (str === "meanHue") tempCol = meanHue(tile.allColors)
    else if (str === "least") tempCol = leastUsed(tile)
    else if (str === "most") tempCol = mostUsed(tile)
    return tempCol;
}

export function helper(weights, arr) {
    const sumOfWeights = weights.reduce((acc, curr) => acc + curr);
    const randomNum = Math.random() * sumOfWeights;
    let weightSum = 0;

    for (let i = 0; i < weights.length; i++) {
        weightSum += weights[i];
        if (randomNum < weightSum) {
            return arr[i];
        }
    }

    return arr[arr.length - 1];
}

function chooseRandomElements(array, n) {
    const randomElements = [];
    const arrayCopy = array.slice(); // Create a copy of the original array

    while (randomElements.length < n && arrayCopy.length > 0) {
        const randomIndex = Math.floor(Math.random() * arrayCopy.length);
        const element = arrayCopy.splice(randomIndex, 1)[0];
        randomElements.push(element);
    }

    return randomElements;
}

function generateRandomWeights(array) {
    const n = array.length;
    const randomWeights = [];

    // Generate random decimal values
    for (let i = 0; i < n; i++) {
        const randomValue = Math.random();
        randomWeights.push(randomValue);
    }

    // Calculate the sum of the random values
    const sum = randomWeights.reduce((total, value) => total + value, 0);

    // Normalize the values to ensure they add up to 1
    const normalizedWeights = randomWeights.map(value => value / sum);

    return normalizedWeights;
}

