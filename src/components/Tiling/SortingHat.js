const weightStrings = {
    1: "combination",
    2: "first",
    3: "last",
    4: "complem",
    5: "blur",
    6: "blurFill",
    7: "meanHue",
    8: "inverseMean",
    9: "radialGradient",
    10: "diagGradient",
    11: "horizGradient",
    12: "vertGradient",
    13: "dither1",
    14: "dither2",
    15: "dither3",
    16: "dither4",
    17: "dither5",
    18: "mostUsed",
    19: "leastUsed",
    20: "pattern",
    21: "stripesH",
    22: "stripesV",
    23: "pixel3",
    24: "pixel4",
    25: "pixel5",
    26: "pixel7",
    27: "pixel8",
    // 28: "fillAnim",
    // 29: "inverseComb"
}

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
            return weightStrings[i + 1];
        }
    }

    return weightStrings[weights.length-1];
}