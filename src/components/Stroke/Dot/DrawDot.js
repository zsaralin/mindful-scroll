import {getLineWidth} from "../StrokeWidth";
import {drawStrokeHelper} from "../DrawStroke";
import './Dot.css'
import {hslToRgb} from "../../Effects/ColorTheory";
import {isCircleInPath} from "../../Tile/FillTile/FillRatio";

export function drawGradientStroke(tile, x0, y0, x1, y1, theColor, grad) {
    const lw = getLineWidth();
    const hslArr = theColor.match(/\d+/g).map(Number);
    const rgb = hslToRgb(hslArr[0], hslArr[1], hslArr[2]);

    const bubbleElement = document.createElement('div');
    bubbleElement.id = 'inner-div';
    bubbleElement.style.width = `${lw}px`;
    bubbleElement.style.height = `${lw}px`;
    bubbleElement.style.top = `${y0 - lw/4}px`;
    bubbleElement.style.left = `${x0 - lw/4}px`;
    bubbleElement.style.setProperty('--my-color', `${rgb.r},${rgb.g},${rgb.b}`);
    bubbleElement.classList.add(grad === true ? 'grad-dot' : 'pulse-dot');

    const bubbleContainer = document.getElementById('dots');
    bubbleContainer.appendChild(bubbleElement);

    const ctx = document.getElementById('top-canvas').getContext('2d');
    const [r, g, b, a] = ctx.getImageData(x0, y0, 1, 1).data;

    //
    // const ctx = document.getElementById("top-canvas").getContext("2d");
    // const ctxFill = document.getElementById("fill-canvas").getContext("2d");
    //
    // const radius = getLineWidth();
    //
    // const backgroundCol0 = `rgba(${ctx.getImageData(x0, y0, 1, 1).data.join()})`;
    // const backgroundCol1 = `rgba(${ctxFill.getImageData(x0, y0, 1, 1).data.join()})`;
    // const backgroundCol = getBC(backgroundCol0, backgroundCol1)
    //
    // function getBC(b0, b1) {
    //     if (b0 === 'rgba(0,0,0,0)' && b1 === 'rgba(0,0,0,0)') {
    //         return "white"
    //     } else return 'rgba(0,0,0,0)'
    // }
    //
    // // Create radial gradient
    // const gradient = ctx.createRadialGradient(x0, y0, 0, x0, y0, radius);
    // gradient.addColorStop(0, theColor); // Inner color (solid red)
    // gradient.addColorStop(1, backgroundCol); // Outer color (transparent)
    //
    // // Draw the dot with radial gradient
    // ctx.beginPath();
    // ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
    // ctx.fillStyle = gradient;
    // ctx.fill();
}

export function drawClover(x0, y0, x1, y1, theColor, lw, offset, context) {
    context = context || document.getElementById('top-canvas').getContext("2d");
    let x = Math.max(lw / 3, 5);
    lw = Math.max(lw / 2, 5);
    drawStrokeHelper(x0, y0 + x, x1, y1 + x, theColor, lw, context, offset)
    drawStrokeHelper(x0, y0 - x, x1, y1 - x, theColor, lw, context, offset)
    drawStrokeHelper(x0 + x, y0, x1 + x, y1, theColor, lw, context, offset)
    drawStrokeHelper(x0 - x, y0, x1 - x, y1, theColor, lw, context, offset)
}

export function drawFlower(x0, y0, x1, y1, col, lw, offset, context) {
    context = context || document.getElementById('top-canvas').getContext("2d");
    let x = Math.max(lw / 3, 5);
    lw = Math.max(lw / 2, 5);
    drawStrokeHelper(x0 - x / 1.5, y0 + x * 1.2, x1 - x / 1.5, y1 + x * 1.2, col, lw, context, offset)
    drawStrokeHelper(x0 + x / 1.5, y0 + x * 1.2, x1 + x / 1.5, y1 + x * 1.2, col, lw, context, offset)
    drawStrokeHelper(x0, y0 - x / 1.3, x1, y1 - x / 1.3, col, lw, context, offset)
    drawStrokeHelper(x0 + x, y0, x1 + x, y1, col, lw, context, offset)
    drawStrokeHelper(x0 - x, y0, x1 - x, y1, col, lw, context, offset)
}
