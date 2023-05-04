import {drawClover, drawFlower, drawGradientStroke} from "../Dot/DrawDot";
import {drawStroke} from "../DrawStroke";
import {drawTransparentDot, drawTransparentStroke} from "../TransparentStroke";
import {drawBlurryStroke} from "../../Effects/Blur";
import {getStrokeType} from "../../Tiling/SortingHat";
import {setStrokeType} from "../StrokeType";

let dotType = "reg"

export function startDot(currTile, x0, y0, x1, y1, color, lw, type) {
    setDotType(type)
    if (dotType === "reg" || dotType === "dotted") {
        let prev = getStrokeType();
        setStrokeType("dotType")
        drawStroke(x0, y0, x1, y1, color, lw)
        setStrokeType(prev)
    }
    else if (dotType === "fuzzy") drawBlurryStroke(x0, y0, x1, y1, color, lw)
    else if (dotType === "transparent") drawTransparentDot(currTile, x0, y0, x1, y1, color, lw)
        // dot only
    else if (dotType === "clover") drawClover(x0, y0, x1, y1, color, lw)
    else if (dotType === "flower") drawFlower(x0, y0, x1, y1, color, lw)
    else if (dotType === "grad-pulse") drawGradientStroke(currTile, x0, y0, x1, y1, color, true)
    else if (dotType === "pulse") drawGradientStroke(currTile, x0, y0, x1, y1, color, false)

}
export function setDotType(str) {
    dotType = str
}


