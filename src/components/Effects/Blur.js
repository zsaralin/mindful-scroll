import {getCurrColor} from "../Stroke/Color/StrokeColor";
import {hsl2Rgb, isCircleInPath} from "../Tile/FillTile/FillRatio";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {getTileWidth} from "../Tiling/TileWidth";
import {getStrokeArr, getStrokeArrUnder, pushStrokeUnder, redrawBlurryStrokes} from "../Stroke/StrokeType/StrokeArr";
import {drawStroke, drawStrokeUnder} from "../Stroke/DrawStroke";
import {fillEachPixel} from "../Tile/FillTile/FillGaps";
import {fillTile} from "../Tile/FillTile/FillTile";

let blurryArr = {}

export function blurryHelper(x0, y0, x1, y1, theColor, theLineWidth) {
    const context = document.getElementById('top-canvas').getContext('2d');
    let rgbaColor = theColor;
    if (typeof rgbaColor === 'string' && rgbaColor.charAt(0) === 'h') {
        rgbaColor = hsl2Rgb(rgbaColor);
        rgbaColor = `rgba(${rgbaColor.join(',')},${1})`;
    }
    let r = theLineWidth ? theLineWidth : getLineWidth();
    context.beginPath();
    var radialGradient = context.createRadialGradient(x0, y0, 0, x0 + 1, y0 + 1, r - 11 > 5 ? r - 11 : r);
    radialGradient.addColorStop(0, rgbaColor);
    radialGradient.addColorStop(.2, rgbaColor.slice(0, rgbaColor.length - 2) + '0.2)');
    radialGradient.addColorStop(1, rgbaColor.slice(0, rgbaColor.length - 2) + '0)');
    context.fillStyle = radialGradient;
    context.fillRect(x0 - r, y0 - r, 150, 150);
    context.closePath();
}

export function blurryDotHelper(x0, y0, x1, y1, theColor, theLineWidth){
        const context = document.getElementById('top-canvas').getContext('2d');
        let rgbaColor = theColor;
        if (typeof rgbaColor === 'string' && rgbaColor.charAt(0) === 'h') {
            rgbaColor = hsl2Rgb(rgbaColor);
            rgbaColor = `rgba(${rgbaColor.join(',')},${1})`;
        }
        let r = theLineWidth ? theLineWidth : getLineWidth();
        context.beginPath();
        var radialGradient = context.createRadialGradient(x0, y0, 0, x0 + 1, y0 + 1, r - 11 > 5 ? r - 11 : r);
        radialGradient.addColorStop(0, rgbaColor); // Starting color at the center
        // Middle color with larger size
        radialGradient.addColorStop(0.2, rgbaColor.slice(0, rgbaColor.length - 2) + '1)');
        // Gradual transition color stops
        radialGradient.addColorStop(0.6, rgbaColor.slice(0, rgbaColor.length - 2) + '0.7)');
        radialGradient.addColorStop(0.8, rgbaColor.slice(0, rgbaColor.length - 2) + '0.4)');
        // Fading out color at the edges
        radialGradient.addColorStop(1, rgbaColor.slice(0, rgbaColor.length - 2) + '0)');

        context.fillStyle = radialGradient;
        context.fillRect(x0 - r, y0 - r, 150, 150);
        context.closePath();
}

let BB_PADDING = 35;

export function blurTile(tile) {
    // let strokesUnder = getStrokeArrUnder()[tile.id]
    // let strokes = getStrokeArr()[tile.id]
    // if (strokesUnder) {
    //     strokesUnder.forEach(stroke => {
    //         drawBlurryStroke(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.lineWidth, stroke.color)
    //         pushStroke(tile, stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.lineWidth, stroke.color)
    //     })
    // }
    // strokes.forEach(stroke => {
    //     drawBlurryStroke(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.lineWidth, stroke.color)
    //     pushStroke(tile, stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.lineWidth, stroke.color)
    //
    // })
    let canvas = document.getElementById("top-canvas");
    let ctx = document.getElementById("top-canvas").getContext("2d");
    let tileDim = tile.bounds;
    let startX = tileDim[0] - BB_PADDING;
    let startY = tileDim[2] - BB_PADDING;
    let endX = tileDim[1] + BB_PADDING;
    let endY = tileDim[3] + BB_PADDING;

    // get the image data in the region defined by the path
    let imageData = ctx.getImageData(startX, startY, endX - startX, endY - startY);

    // apply a Gaussian blur to the image data
    let pixels = imageData.data;
    let width = imageData.width;
    let height = imageData.height;
    let radius = 10;
    let sigma = 5;
    let i = 1;
    for (let y = 0; y < imageData.height; y += i) {
        for (let x = 0; x < imageData.width; x += i) {
            if (isCircleInPath(tile.path, startX + x, startY + y)) {

                let index = (y * imageData.width + x) * 4;
                // Check if pixel is black
                if (pixels[index] === 0 && pixels[index + 1] === 0 && pixels[index + 2] === 0) {
                    // Convert black pixel to white
                    pixels[index] = 255;
                    pixels[index + 1] = 255;
                    pixels[index + 2] = 255;
                }
            }
        }
    }
    let kernel = getGaussianKernel(radius, sigma);

    convolve2D(pixels, kernel, width, height, 4, tile);

    // put the blurred image data back into the canvas
    ctx.putImageData(imageData, startX, startY);
}

export function fillAndBlur(tile) {
    fillEachPixel(tile)
    blurTile(tile)
}

function pushStroke(tile, x0, y0, x1, y1, theLineWidth, theColor) {
    const newStroke = {
        x0,
        y0,
        x1,
        y1,
        color: theColor,
        lineWidth: theLineWidth,
    };
    blurryArr[tile.id] = blurryArr[tile.id] || [];
    blurryArr[tile.id].push(newStroke);
}

export function redrawBlur(offsetY) {
    for (let tile in blurryArr) {
        let arr = blurryArr[tile]
        arr.forEach(stroke => {
            drawBlurryStroke(stroke.x0, stroke.y0 - offsetY, stroke.x1, stroke.y1 - offsetY, stroke.lineWidth, stroke.color);
        })
    }
}

export function drawBlurryStroke(x0, y0, x1, y1, theColor, theLineWidth, context) {
    blurryHelper(x0, y0, x0, y0, theColor, theLineWidth, false)

    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const xStep = (x0 < x1) ? 1 : -1;
    const yStep = (y0 < y1) ? 1 : -1;
    let x = x0;
    let y = y0;

    if (dx > dy) {
        let error = dx / 2;
        while (x !== x1) {
            blurryHelper(x, y, x, y, theColor, theLineWidth, false)
            error -= dy;
            if (error < 0) {
                y += yStep;
                error += dx;
            }
            x += xStep;
        }
    } else {
        let error = dy / 2;
        while (y !== y1) {
            blurryHelper(x, y, x, y, theColor, theLineWidth, false)
            error -= dx;
            if (error < 0) {
                x += xStep;
                error += dy;
            }
            y += yStep;
        }
    }
}

function getGaussianKernel(radius, sigma) {
    let size = radius * 2 + 1;
    let kernel = new Array(size);
    let sigma2 = sigma * sigma;
    let sum = 0;

    for (let i = 0; i < size; i++) {
        let x = i - radius;
        let weight = Math.exp(-x * x / (2 * sigma2)) / Math.sqrt(2 * Math.PI * sigma2);
        kernel[i] = weight;
        sum += weight;
    }

    for (let i = 0; i < size; i++) {
        kernel[i] /= sum;
    }

    return kernel;
}

function convolve2D(pixels, kernel, width, height, channels, tile) {
    let startX = tile.bounds[0] - BB_PADDING;
    let startY = tile.bounds[2] - BB_PADDING;

    let radius = Math.floor(kernel.length / 2);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (isCircleInPath(tile.path, startX + x, startY + y)) {

                let index = (y * width + x) * channels;

                for (let c = 0; c < channels; c++) {
                    let sum = 0;

                    for (let i = -radius; i <= radius; i++) {
                        let xi = x + i;

                        if (xi < 0 || xi >= width) {
                            continue;
                        }

                        let weight = kernel[i + radius];
                        let pi = (y * width + xi) * channels + c;
                        sum += pixels[pi] * weight;
                    }

                    pixels[index + c] = sum;
                }
            }
        }
    }
}
