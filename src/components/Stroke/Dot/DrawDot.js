import {getLineWidth} from "../StrokeWidth";
import {drawStrokeHelper} from "../DrawStroke";
import './Dot.css'
import {hslToRgb} from "../../Effects/ColorTheory";
import {isCircleInPath} from "../../Effects/FillRatio";
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
    bubbleElement.style.zIndex = a === 0 ? 1 : 2;
}

export function drawClover(x0, y0, x1, y1, theColor, theLineWidth, offset, context) {
    context = context || document.getElementById('canvas').getContext("2d");
    let x = Math.max(getLineWidth() / 3, 5);
    theLineWidth = Math.max(getLineWidth() / 2, 5);
    drawStrokeHelper(x0, y0 + x, x1, y1 + x, theLineWidth, theColor, context, offset)
    drawStrokeHelper(x0, y0 - x, x1, y1 - x, theLineWidth, theColor, context, offset)
    drawStrokeHelper(x0 + x, y0, x1 + x, y1, theLineWidth, theColor, context, offset)
    drawStrokeHelper(x0 - x, y0, x1 - x, y1, theLineWidth, theColor, context, offset)
}

export function drawFlower(x0, y0, x1, y1, theColor, theLineWidth, offset, context) {
    context = context || document.getElementById('canvas').getContext("2d");
    let x = Math.max(getLineWidth() / 3, 5);
    theLineWidth = Math.max(getLineWidth() / 2, 5);
    drawStrokeHelper(x0 - x / 1.5, y0 + x * 1.2, x1 - x / 1.5, y1 + x * 1.2, theLineWidth, theColor, context, offset)
    drawStrokeHelper(x0 + x / 1.5, y0 + x * 1.2, x1 + x / 1.5, y1 + x * 1.2, theLineWidth, theColor, context, offset)

    drawStrokeHelper(x0, y0 - x / 1.3, x1, y1 - x / 1.3, theLineWidth, theColor, context, offset)
    drawStrokeHelper(x0 + x, y0, x1 + x, y1, theLineWidth, theColor, context, offset)
    drawStrokeHelper(x0 - x, y0, x1 - x, y1, theLineWidth, theColor, context, offset)
}
