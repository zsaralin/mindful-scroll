import {getBoundsTiling2} from "./TilingBounds";

export function ditherTiling(i, pathDict) {
    let [xMin, xMax, yMin, yMax] = getBoundsTiling2(pathDict)

    for (let x = xMin; x < xMax; x += i) {
        for (let y = yMin; y < yMin + 150; y += i) {
            ditherHelper(x, y, i)
        }
        for (let y = yMax - 300; y > yMax - 550; y -= i) {
            ditherHelper(x, y, i)
        }
    }
}

function ditherHelper(x,y, i){
    let steps = i*2
    let ctx = document.getElementById("off-canvas").getContext("2d");
    let d = ctx.getImageData(x, y, i, i).data;
    let oldR = d[0]
    let oldG = d[1]
    let oldB = d[2]
    let newR = closestStep(255, steps, oldR);
    let newG = closestStep(255, steps, oldG);
    let newB = closestStep(255, steps, oldB);
    let data = new Uint8ClampedArray(i*i * 4);
    for (let j = 0; j < i*i; j++) {
        const index = j * 4;
        data[index] = newR;
        data[index + 1] = newG;
        data[index + 2] = newB;
        data[index + 3] = d[3];
    }
    const imageData = new ImageData(data, i, i); // change size to 2x2
    ctx.putImageData(imageData, x, y);
    let errR = oldR - newR;
    let errG = oldG - newG;
    let errB = oldB - newB;
    distributeError(imageData, x, y, errR, errG, errB, ctx, i);
}
// Finds the closest step for a given value
// The step 0 is always included, so the number of steps
// is actually steps + 1
function closestStep(max, steps, value) {
    return Math.round((steps * value) / 255) * Math.floor(255 / steps);
}

function distributeError(img, x, y, errR, errG, errB, ctx, i) {
    addError(img, 7 / 16.0, x + i, y, errR, errG, errB, ctx, i);
    addError(img, 3 / 16.0, x - i, y + i, errR, errG, errB, ctx, i);
    addError(img, 5 / 16.0, x, y + i, errR, errG, errB, ctx, i);
    addError(img, 1 / 16.0, x + i, y + i, errR, errG, errB, ctx, i);
}

function addError(img, factor, x, y, errR, errG, errB, ctx, i) {
    const d = ctx.getImageData(x, y, 1, 1).data;
    const oldR = d[0]
    const oldG = d[1]
    const oldB = d[2]

    const newR = oldR + errR * factor;
    const newG = oldG + errG * factor;
    const newB = oldB + errB * factor;

    let data = new Uint8ClampedArray(i*i * 4);
    for (let j = 0; j < y; j++) {
        const index = j * 4;
        data[index] = newR;
        data[index + 1] = newG;
        data[index + 2] = newB;
        data[index + 3] = d[3];
    }
    const imageData = new ImageData(data, i, i); // change size to 2x2

    ctx.putImageData(imageData, x, y);
}