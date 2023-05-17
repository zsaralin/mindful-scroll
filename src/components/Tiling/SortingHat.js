const weightStrings = [
    "combination",
    "first",
    "last",
    "complem",
    "blur",
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
    "fillAnim",
    "inverseComb"
];

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

// reg, fuzzy, transparent, dotted
const strokeWeights = [1,0,0,0]
const strokes = ["reg", "fuzzy", "transparent", "dotted"]

export function getStrokeType(){
    const sumOfWeights = strokeWeights.reduce((acc, curr) => acc + curr);
    const randomNum = Math.random() * sumOfWeights;
    let weightSum = 0;

    for (let i = 0; i < strokeWeights.length; i++) {
        weightSum += strokeWeights[i];
        if (randomNum < weightSum) {
            return strokeWeights[i];
        }
    }

    return strokes[strokes.length-1];
}