import {fillTileColors} from "../Effects/ColorTheory";
import {fillInverseStrokes} from "../Effects/FillGaps";
import {SHAPE_COLOR} from "../Constants";
import {shapeGlow} from "../Tile/Shape";
import {drawClover, drawFlower, drawGradientStroke, drawStroke} from "./Stroke";

let dotType = "reg"

export function startDot(currTile, x0, y0, x1, y1, color) {
        if (dotType === "reg") drawStroke(x0, y0, x1, y1, color)
        else if (dotType === "clover") drawClover(x0, y0, x1, y1, color)
        else if (dotType === "flower") drawFlower(x0, y0, x1, y1, color)
        else if (dotType === "pulse") drawGradientStroke(currTile, x0, y0, x1, y1, color)
}

export function setDotType(str) {
    dotType = str
}

