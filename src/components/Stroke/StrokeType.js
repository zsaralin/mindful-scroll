import {drawStroke} from "./DrawStroke";
import {drawBlurryStroke} from "../Effects/Blur";
import {drawTransparentDot, drawTransparentStroke} from "./TransparentStroke";
import {setDotType} from "./Dot/DotType";
import {drawDottedStroke} from "./DottedStroke";

let strokeType = "reg"

export function startStroke(id, x0, y0, x1, y1, color, lw, inputStyle) {
    if (inputStyle) setStrokeType(inputStyle)
    if (strokeType === "reg") drawStroke(x0, y0, x1, y1, color, lw)
    else if (strokeType === "fuzzy") drawBlurryStroke(x0, y0, x1, y1, color, lw)
    else if (strokeType === "transparent") drawTransparentStroke(id, x0, y0, x1, y1, color, lw)
    else if (strokeType === "dotted") drawDottedStroke(id, x0, y0, x1, y1, color, lw)
}
export function setStrokeType(str) {
    strokeType = str
    setDotType(str)
}

