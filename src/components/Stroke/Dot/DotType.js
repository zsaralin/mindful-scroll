import {drawClover, drawFlower, drawGradientStroke} from "../Dot/DrawDot";
import {drawStroke} from "../DrawStroke";
import {drawTransparentDot, drawTransparentStroke} from "../StrokeType/TransparentStroke";
import {blurryDotHelper, blurryHelper, drawBlurryStroke} from "../../Effects/Blur";
import {getStrokeType} from "../../Tiling/SortingHat";
import {setStrokeType} from "../StrokeType/StrokeType";
import {drawDottedDot} from "../StrokeType/DottedStroke";

let dotType = "reg"

export function startDot(id, x0, y0, x1, y1, color, lw, type) {
    if (type === "reg"){
        drawStroke(x0, y0, x1, y1, color, lw)
    }
    else if(type === "dotted") drawDottedDot(id, x0, y0, x1, y1, color, lw)
    else if (type === "blurry") blurryDotHelper(x0, y0, x1, y1, color, lw)
    else if (type === "transparent") drawTransparentDot(id, x0, y0, x1, y1, color, lw)
        // dot only
    else if (type === "clover") drawClover(x0, y0, x1, y1, color, lw)
    else if (type === "flower") drawFlower(x0, y0, x1, y1, color, lw)
    // else if (dotType === "grad-pulse") drawGradientStroke(id, x0, y0, x1, y1, color, true)
    // else if (dotType === "pulse") drawGradientStroke(id, x0, y0, x1, y1, color, false)

}
export function setDotType(str) {
    dotType = str
}


