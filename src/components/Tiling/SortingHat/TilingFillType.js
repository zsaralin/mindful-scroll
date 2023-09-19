import {afterBackFillFn, afterFillFn, basicVersion, solidFillFn} from "./CompleteTile2";
import {getCurrColor} from "../../Stroke/Color/StrokeColor";
import {complem, fillTileColors, invert, invertHue, meanHue} from "../../Effects/ColorTheory";
import {leastUsed, mostUsed} from "../../Effects/CommonColours";
import {dither} from "../../Effects/Dither";

const sections = [0, 1, 2, 3]
const solidFill = ["first", "last", "meanHue", "most", "least"]
const afterFill = ["complem", "inverseHue"]
const afterBackFill = ["dither", "blurry", "pixel", ["blurry", "dither"], ["dither", "blurry"], ["pixel", "blurry"], ["pixel", "dither"]]
const pattern = ["outline", "stripes", "gradient"]
const stripes = ["horiz", "vert", "diag"]
const gradient = ["radial", "diag", "vert", "horiz"]
const under = [true, false]

export function getFillInfo() {
    if (basicVersion) { //simple
        return {strokeTypes: ["reg"], strokeW: [1]}
    } else {
        const num = 0//sections[Math.floor(Math.random() * sections.length)];
        if (num === 0) {
            const weights = [5, 3, 2, 1, 1]
            const totFillTypes = [1, 2, 3, 4, 5]
            const n = helper(weights, totFillTypes) // # of solid fill types
            const fillTypes = chooseRandomElements(solidFill, n)
            const fillW = generateRandomWeights(fillTypes.length)
            const underW = generateRandomWeights(under.length)
            const combinW = Math.random()
            const otherStrokeType = ["transparent", "transparent", "transparent"][Math.floor(Math.random() * 3)]; // choose one at random
            const randomW = [0, 0, 0, 0.2, 0.7][Math.floor(Math.random() * 5)];
            const strokeTypes = ["reg", otherStrokeType]
            const strokeW = [1 - randomW, randomW]
            return {fillNum: 0, fillTypes, fillW, underW, combinW, strokeTypes, strokeW}
        } else if (num === 1) {
            const weights = [4, 1]
            const totFillTypes = [1, 2]
            const n = helper(weights, totFillTypes) // # of solid fill types
            const fillTypes = chooseRandomElements(solidFill, n)
            const fillW = generateRandomWeights(fillTypes.length)
            const underW = generateRandomWeights(under.length)
            const afterW = Math.random() < .5 ? generateRandomWeights(afterFill.length) : 0
            const randomNumber = Math.random();
            const ditherW = randomNumber < 0.5 ? 0 : randomNumber

            const otherStrokeType = ["transparent", "transparent", "transparent"][Math.floor(Math.random() * 3)]; // choose one at random
            const randomW = [0, 0, 0, 0.2, 0.7][Math.floor(Math.random() * 5)];
            const strokeTypes = ["reg", otherStrokeType]
            const strokeW = [1 - randomW, randomW]
            return {fillNum: 1, fillTypes, fillW, underW, afterW, ditherW, strokeTypes, strokeW}
        } else if (num === 2) {
            const weights = [1, 1, 1, 1, 1]
            const totFillTypes = [1, 2, 3, 4, 5]
            const n = helper(weights, totFillTypes) // # of solid fill types
            const fillTypes = chooseRandomElements(solidFill, n)
            const fillW = generateRandomWeights(fillTypes.length)
            const [afterFillTypes, afterBackW] = afterFillTypesHelper()
            const [strokeTypes, strokeW] = strokeTypesHelper(afterFillTypes)
            return {fillNum: 2, fillTypes, fillW, afterFillTypes, afterBackW, strokeTypes, strokeW}
        } else if (num === 3) {
            const weights = [1, 0.5]
            const totFillTypes = [1, 2]
            const n = helper(weights, totFillTypes) // # of solid fill types
            const solidTypes = chooseRandomElements(solidFill, n)
            // Randomly choose either one element or the first two elements
            const patternTypes = Math.random() < .7 ? pattern[Math.floor(Math.random() * pattern.length)] : pattern.slice(0, 2);
            const fillTypes = solidTypes.concat(patternTypes);
            const fillW = generateRandomWeights(fillTypes.length)
            fillW.sort((a, b) => b - a); // want higher weights for solidTypes
            let col0 = generateRandomWeights(6, true)
            let col1 = generateRandomWeights(15, true)
            col1 = adjustCol(col0, col1)
            if (patternTypes.includes("stripes")) {
                const numAnglesW = [.1, .4, .5] // .1% only 1 from pattern arr, etc.
                const numAngles = [1, 2, 3]
                const m = helper(numAnglesW, numAngles) // # of angles
                const angleTypes = chooseRandomElements(stripes, m)
                const angleW = generateRandomWeights(angleTypes.length)
                const [afterFillTypes, afterBackW] = afterFillTypesHelper()
                const [strokeTypes, strokeW] = strokeTypesHelper(afterFillTypes)
                if (angleTypes.includes("diag")) {
                    const angleArr = generateAngleArray()
                    // const [afterFillTypes, afterBackW] = afterFillTypesHelper()
                    // const [strokeTypes, strokeW] = strokeTypesHelper(afterFillTypes)
                    console.log('strokeW ' + strokeW)
                    return {
                        fillNum: 3,
                        fillTypes,
                        fillW,
                        angleTypes,
                        angleW,
                        angleArr,
                        col0,
                        col1,
                        afterFillTypes,
                        afterBackW,
                        strokeTypes,
                        strokeW
                    }
                } else {
                    return {
                        fillNum: 3,
                        fillTypes,
                        fillW,
                        angleTypes,
                        angleW,
                        col0,
                        col1,
                        afterFillTypes,
                        afterBackW,
                        strokeTypes,
                        strokeW
                    }
                }
            } else if (patternTypes.includes("gradient")) {
                const gradTypes = chooseRandomElements(gradient, Math.floor(Math.random() * gradient.length) + 1,); // random num 1-gradient.length
                const gradW = generateRandomWeights(gradTypes.length)
                const [afterFillTypes, afterBackW] = afterFillTypesHelper()
                const [strokeTypes, strokeW] = strokeTypesHelper(afterFillTypes)
                return {
                    fillNum: 3,
                    fillTypes,
                    fillW,
                    gradTypes,
                    gradW,
                    col0,
                    col1,
                    afterFillTypes,
                    afterBackW,
                    strokeTypes,
                    strokeW
                }
            } else {
                const [afterFillTypes, afterBackW] = afterFillTypesHelper()
                const [strokeTypes, strokeW] = strokeTypesHelper(afterFillTypes)
                return {fillNum: 3, fillTypes, fillW, col0, col1, afterFillTypes, afterBackW, strokeTypes, strokeW}
            }
        }
    }
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

function generateRandomWeights(n, cols) {
    let randomWeights = [];

    // Generate random decimal values
    function pushWeights(){
        for (let i = 0; i < n; i++) {
            let randomValue = Math.random();
            if (cols) {
                const modifiedValue = randomValue < 0.7 ? 0 : randomValue; // do not want inverse + inverse hue at the same time
                randomWeights.push(modifiedValue);
            } else {
                randomWeights.push(randomValue)
            }
        }}
    pushWeights()
    while(randomWeights.every(value => value === 0)){
        randomWeights = [];
        pushWeights()
    }

    if (cols) {
        if (n === 6) {
            if (randomWeights[1] !== 0) randomWeights[2] = 0
            if (randomWeights[2] !== 0) randomWeights[1] = 0
        } else if (n === 15) {
            if (randomWeights[5] !== 0 || randomWeights[7] !== 0) {
                randomWeights[6] = 0
                randomWeights[8] = 0
            }
            if (randomWeights[6] !== 0 || randomWeights[8] !== 0) {
                randomWeights[5] = 0
                randomWeights[7] = 0
            }
        }
    }
    // Calculate the sum of the random values
    const sum = randomWeights.reduce((total, value) => total + value, 0);
    // Normalize the values to ensure they add up to 1
    const normalizedWeights = randomWeights.map(value => value / sum);
    return normalizedWeights;
}


function generateAngleArray() {
    const length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
    const array = [];

    for (let i = 0; i < length; i++) {
        let value;
        do {
            value = Math.floor(Math.random() * 41) - 20; // Random value between -20 and 20 (excluding 0)
        } while (value === 0); // Exclude 0 from the array

        array.push(value);
    }

    return array;
}

function adjustValues(arr, indexes) {
    const epsilon = 1e-10; // A small value to ensure precision in calculations

    if (indexes.every(index => arr[index] === 0)) {
        // All values at the specified indexes are 0, so set them to a non-zero value
        const newValue = Math.random() + epsilon;
        indexes.forEach(index => {
            arr[index] = newValue;
        });
    }

    return arr;
}

function adjustCol(w1, w2) {
    const indexMappings = [
        {w1Indexes: [0], w2Indexes: [11, 12]},
        {w1Indexes: [1], w2Indexes: [5, 7]},
        {w1Indexes: [2], w2Indexes: [6, 8]},
        {w1Indexes: [4], w2Indexes: [4, 9]},
    ];

    // Adjust values in w2 based on w1 conditions
    indexMappings.forEach(mapping => {
        const {w1Indexes, w2Indexes} = mapping;
        if (w1Indexes.every(index => w1[index] !== 0)) {
            w2 = adjustValues(w2, w2Indexes);
        }
    });

    // Recalculate the sums of both arrays
    const sumW2 = w2.reduce((total, value) => total + value, 0);

    // Normalize both arrays to ensure they add up to 1
    const normalizedW2 = w2.map(value => value / sumW2);

    return normalizedW2;
}

function afterFillTypesHelper() {
    const afterW = [.8, .4, .1, .1, .1]
    const totAfterFillTypes = [1, 2, 3, 4, 5]
    const m = helper(afterW, totAfterFillTypes) // # of after fill types
    let afterFillTypes = chooseRandomElements(afterBackFill.slice(0, 3), m > 3 ? 3 : m)
    if (m > 3) {
        const mixFills = afterBackFill.slice(-4)
        const mixFillTypes = chooseRandomElements(mixFills, m - 3)
        if(mixFillTypes === 1) afterFillTypes.push(mixFillTypes[0])
        else{
            for(let i = 0; i < mixFillTypes.length; i++){
                afterFillTypes.push(mixFillTypes[i])
            }
        }

    }
    afterFillTypes.push('none')
    const afterBackW = generateRandomWeights(afterFillTypes.length)
    afterBackW.sort((a, b) => a - b); // want "none" to have the greatest weight
    return [afterFillTypes, afterW]
}

function strokeTypesHelper(afterFillTypes) {
    if (afterFillTypes.includes("blurry")) {
        const strokeTypes = ["reg", "blurry"]
        const rand = Math.random()
        const regW = rand >= .5 ? rand : 1 - rand
        const strokeW = [regW, 1 - regW]
        return [strokeTypes, strokeW]
    }
    return [["reg"], [1]]
}

export function dotTypesHelper(strokeType) {
    if (basicVersion) return "reg"
    if (strokeType === "blurry" || strokeType === "dotted" || strokeType === "transparent") {
        return strokeType
    } else {
        if (Math.random() < .8) return "reg"
        else {
            return ["clover", "flower"][Math.floor(Math.random() * 2)]; // choose one at random
        }
    }
}