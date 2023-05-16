const weightStrings = [
    "combination",
    "first",
    "last",
    "complem",
    // "blur",
    "blurFill",
    "meanHue",
    "inverseMean",
    "radialGradient",
    "diagGradient",
    "horizGradient",
    "vertGradient",
    "dither1",
    "dither2",
    "dither3",
    "dither4",
    "dither5",
    "mostUsed",
    "leastUsed",
    "pattern",
    "stripesH",
    "stripesV",
    "pixel3",
    "pixel4",
    "pixel5",
    "pixel7",
    "pixel8",
    // "fillAnim",
    // "inverseComb"
];

const weightStrings2 = [
    "combination",
    "first",
    "last",
    "complem",
    // "blur",
    "blurFill",
    "meanHue",
    "inverseMean",
    "radialGradient",
    "diagGradient",
    "horizGradient",
    "vertGradient",
    "dither1",
    "dither2",
    "dither3",
    "dither4",
    "dither5",
    "mostUsed",
    "leastUsed",
    "pattern",
    "stripesH",
    "stripesV",
    "pixel"
    // "fillAnim",
    // "inverseComb"
];

// reg, fuzzy, transparent, dotted
const strokeWeights = [.7,.1,.1,.1]

export function setTiling(tiling) {
    const strokeType = getStrokeType()
    tiling.strokeType = strokeType;
    tiling.dotType = strokeType;
    tiling.fillType = generateRandomArray(weightStrings.length)
}


// Generate a random array of n decimal numbers that add up to 1, minimum val of .1
function generateRandomArray(n) {
    let arr = [];
    let remaining = 1;

    for (let i = 0; i < n; i++) {
        let min = 0.1;
        let max = remaining - (n - i - 1) * min;
        let val = Math.random() * (max - min) + min;
        arr.push(val);
        remaining -= val;
    }

    arr.push(remaining);
    return arr
}

export function getStrokeType(){
    const sumOfWeights = strokeWeights.reduce((acc, curr) => acc + curr);
    const randomNum = Math.random() * sumOfWeights;

    // Choose a value based on the weights
    if (randomNum < strokeWeights[0]) {
        return "reg"
    } else if (randomNum < strokeWeights[0] + strokeWeights[1]) {
        return "fuzzy"
    } else if (randomNum < strokeWeights[0] + strokeWeights[1] + strokeWeights[2]) {
        return "transparent"
    } else {
        return "dotted"
    }
}
export function getFillType(weights){

    const sumOfWeights = weights.reduce((acc, curr) => acc + curr);
    const randomNum = Math.random() * sumOfWeights;
    let weightSum = 0;

    for (let i = 0; i < weights.length; i++) {
        weightSum += weights[i];
        if (randomNum < weightSum) {
            return weightStrings[i];
        }
    }

    return weightStrings[weightStrings.length-1];
}