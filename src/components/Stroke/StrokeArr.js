import {getLineWidth} from "./StrokeWidth";
import {sumArrayPrev, tilingArrLength} from "../TilingArr";
import {LINE_WIDTH} from "../ScaleConstants";
import {drawStroke} from "./Stroke";
import {drawShrinkingStroke} from "./ShrinkingStroke";
import {getCurrColor} from "./StrokeColor";

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
export function removeLastStroke(x0, y0, x1, y1, offsetY) {
    if (strokeArr.length > 0) {
        let lastP = strokeArr[strokeArr.length - 1]
        if (lastP.x0 === x0 && lastP.y0 === y0 + offsetY) {
            strokeArr.pop()
        } else if (lastP.x1 === x1 && lastP.y1 === y1 + offsetY) {
            strokeArr.pop();
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


export function redrawStrokes(offsetY) {
    for (let i = 0; i < strokeArr.length; i++) {
        const line = strokeArr[i];
        let x0 = toScreen(line.x0, 0)
        let y0 = toScreen(line.y0, offsetY)
        let x1 = toScreen(line.x1, 0)
        let y1 = toScreen(line.y1, offsetY)
        if (line.endWidth) {
            drawShrinkingStroke(x0, y0, x1, y1, line.lineWidth, line.color);
        } else {
            if (y0 >= 0 && y0 <= window.innerHeight || y1 >= 0 && y1 <= window.innerHeight) { // if in browser window
                drawStroke(x0, y0, x1, y1, line.lineWidth, line.color);
            }
            let limitScroll = tilingArrLength() <= 2 ? 0 : (sumArrayPrev() - LINE_WIDTH)
            if (line.y0 <= limitScroll) {
                strokeArr.splice(i, 1)
            }
        }
        // (1450 * (tilingArrLength() - 2) + window.innerHeight - 5))
    }
}

function toScreen(point, offset) {
    return (point) - offset;
}