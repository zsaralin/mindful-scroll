import {getTotalPixels, isCircleInPath} from "../Tile/FillTile/FillRatio";
import {ditherFill} from "./Gradient";
import {BB_PADDING} from "../Constants";
import {smallOffset} from "../Tiling/Tiling3";


export function dither(tile, i) {
    let ctx = document.getElementById("top-canvas").getContext("2d");

    let steps = i*2
    let tileDim = tile.bounds
    let startX = tileDim[0] - BB_PADDING;
    let startY = tileDim[2] - BB_PADDING;
    let endX = tileDim[1] + BB_PADDING;
    let endY = tileDim[3] + BB_PADDING;
    console.log(`smallOffset 2222 ${smallOffset}`)
    // ctx.save()
    // ctx.translate(0,-smallOffset)
    for (let x = startX; x < endX; x += i) {
        for (let y = startY; y < endY ; y += i) {
            if (isCircleInPath(tile.path, x, y )) {
                // ctx.save()
                // ctx.translate(0,-smallOffset)
                let d = ctx.getImageData(x, y - smallOffset, i, i).data;
                let oldR = d[0]
                let oldG = d[1]
                let oldB = d[2]
                let newR = closestStep(255, steps, oldR);
                let newG = closestStep(255, steps, oldG);
                let newB = closestStep(255, steps, oldB);
                let data = new Uint8ClampedArray(i*i * 4);
                // console.log('data: ' + d.toString())
                for (let j = 0; j < i*i; j++) {
                    const index = j * 4;
                    data[index] = newR;
                    data[index + 1] = newG;
                    data[index + 2] = newB;
                    data[index + 3] = d[3];
                }
                const imageData = new ImageData(data, i, i); // change size to 2x2
                ctx.putImageData(imageData, x, y - smallOffset );
                let errR = oldR - newR;
                let errG = oldG - newG;
                let errB = oldB - newB;
                distributeError(imageData, x,  y - smallOffset , errR, errG, errB, ctx, i);
                // ctx.restore()

            }
        }
    }
    console.log('done')
    // ctx.restore()
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

    ctx.putImageData(imageData, x, y );
}