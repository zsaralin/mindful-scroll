import {getLineWidth} from "./StrokeWidth";
import {drawStroke} from "./Stroke";
import {drawShrinkingStroke} from "./ShrinkingStroke";
import {getCurrColor} from "./StrokeColor";
import {limitScroll} from "../PageScroll";

let strokeArr = []

export function pushShrinkingLine(x0, y0, x1, y1) {
    strokeArr.push({
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        color: getCurrColor(),
        lineWidth: getLineWidth(),
        endWidth: getLineWidth() - 5
    })
}

// removes mistake strokes during two-finger scroll
export function removeLastStroke(touch0, touch1, offsetY) {
    const x0 = touch0.pageX;
    const y0 = touch0.pageY;
    const x1 = touch1.pageX;
    const y1 = touch1.pageY;
    if (strokeArr.length > 0) {
        let lastP = strokeArr[strokeArr.length - 1]
        if ((lastP.x0 === x0 && lastP.y0 === y0 + offsetY) ||
            ((lastP.x1 === x1 && lastP.y1 === y1 + offsetY))) {
            strokeArr.pop()
        }
    }
}


export function pushStroke(x0, y0, x1, y1) {
    strokeArr.push({
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        color: getCurrColor(),
        lineWidth: getLineWidth(),
    })
}


export function redrawStrokes() {
    for (let i = 0; i < strokeArr.length; i++) {
        const stroke = strokeArr[i];
        if (stroke.endWidth) drawShrinkingStroke(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.lineWidth, stroke.color);
        else drawStroke(stroke.x0, stroke.y0, stroke.x1, stroke.y1, stroke.lineWidth, stroke.color);
        if (stroke.y0 <= limitScroll) {
            strokeArr.splice(i, 1)
        }
    }
}
