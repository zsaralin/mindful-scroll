import {drawStroke} from "./DrawStroke";
import {drawBlurryStroke} from "../Effects/Blur";
import {drawTransparentDot, drawTransparentStroke} from "./TransparentStroke";
import {setDotType} from "./Dot/DotType";
import {drawDottedStroke} from "./DottedStroke";

let strokeType = "reg"

export function startStroke(currTile, x0, y0, x1, y1, color) {
    if (strokeType === "reg") drawStroke(x0, y0, x1, y1, color)
    else if (strokeType === "fuzzy") drawBlurryStroke(x0, y0, x1, y1, color)
    else if (strokeType === "transparent") drawTransparentStroke(currTile, x0, y0, x1, y1, color)
    else if (strokeType === "dotted") drawDottedStroke(currTile, x0, y0, x1, y1, color)
}
export function setStrokeType(str) {
    strokeType = str
    setDotType(str)
}

