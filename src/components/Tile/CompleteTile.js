import {getCurrColor} from "../Stroke/Color/StrokeColor";
import {redrawTilings} from "../Tiling/TilingArr";
import {getOffsetY, getTotOffset} from "../Scroll/PageScroll";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {getStrokeArr, pushStroke, pushStrokeUnder, redrawBlurryStrokes, redrawStrokes} from "../Stroke/StrokeArr";
import {drawStroke, drawStrokeUnder} from "../Stroke/DrawStroke";
import {getTileWidth} from "../Tiling/TileWidth";
import {pushCompleteTile} from "./CompleteTileArr";
import {SHAPE_COLOR} from "../Constants";
import {shapeGlow} from "./Shape";
import {blurTile, fillAndBlur} from "../Effects/Blur";
import {ditherFill, fillLinearGradient, fillRadialGradient,} from "../Effects/Gradient";
import {fillTileColors} from "../Effects/ColorTheory";
import {fillEachPixel, fillEachPixelInverse, fillInverseStrokes} from "../Effects/FillTile/FillGaps";
import {invert} from "../Effects/ColorTheory";
import {fillTile} from "../Effects/FillTile/FillTile";

let fillTileArr = [] // fully coloured tiles
let completeTileOn = true;

const PADDING = 35 // account for curves that go past the vertex points (startX, startY,...)
let internalOffset = 0;
let fillType = "combination"

export function setInternalOffset(input) {
    internalOffset = input
}

export function completeTile(currTile, invisCol) {
    if (completeTileOn) {
        currTile.filled = true;
        fillTileColors(currTile)

        if (fillType === "combination") fillEachPixel(currTile)
        else if (fillType === "first") fillTile(currTile, "first", false)
        else if (fillType === "last") fillTile(currTile, "last", false)
        else if (fillType === "complem") fillTile(currTile, "firstC", false)
        else if (fillType === "blur") blurTile(currTile)
        else if (fillType === "blurFill") fillAndBlur(currTile)
        else if (fillType === "meanHue") fillTile(currTile, "meanHue", false)
        else if (fillType === "inverseMean") fillTile(currTile, "meanHueI", false)
        else if (fillType === "radialGradient") fillRadialGradient(currTile, true)
        else if (fillType === "diagGradient") fillLinearGradient(currTile, "diag")
        else if (fillType === "horizGradient") fillLinearGradient(currTile, "horiz")
        else if (fillType === "vertGradient") fillLinearGradient(currTile, "vert")
        else if (fillType === "dither") ditherFill(currTile)
        else if (fillType === "mostUsed") fillTile(currTile, "most", true)
        else if (fillType === "leastUsed") fillTile(currTile, "least", true)
        else if (fillType === "inverseComb") fillInverseStrokes(currTile)

        if (`rgb(${invisCol?.substring(0, 7)})` === SHAPE_COLOR) {
            shapeGlow(currTile)
        }
    }
}

export function triggerCompleteTile() {
    completeTileOn = !completeTileOn
}

export function setFillType(str) {
    fillType = str
}
