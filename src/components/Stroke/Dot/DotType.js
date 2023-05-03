import {drawClover, drawFlower, drawGradientStroke} from "../Dot/DrawDot";
import {drawStroke} from "../DrawStroke";
import {drawTransparentDot, drawTransparentStroke} from "../TransparentStroke";
import {drawBlurryStroke} from "../../Effects/Blur";

let dotType = "reg"

export function startDot(currTile, x0, y0, x1, y1, color) {
    if (dotType === "reg" || dotType === "dotted") drawStroke(x0, y0, x1, y1, color)
    else if (dotType === "fuzzy") drawBlurryStroke(x0, y0, x1, y1, color, false)
    else if (dotType === "transparent") drawTransparentDot(currTile, x0, y0, x1, y1, color, false)
        // dot only
    else if (dotType === "clover") drawClover(x0, y0, x1, y1, color)
    else if (dotType === "flower") drawFlower(x0, y0, x1, y1, color)
    else if (dotType === "grad-pulse") drawGradientStroke(currTile, x0, y0, x1, y1, color, true)
    else if (dotType === "pulse") drawGradientStroke(currTile, x0, y0, x1, y1, color, false)

}
export function setDotType(str) {
    dotType = str
}


