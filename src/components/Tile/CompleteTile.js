import {getCurrColor} from "../Stroke/StrokeColor";
import {redrawTilings} from "../Tiling/TilingArr";
import {getOffsetY, getTotOffset} from "../Scroll/PageScroll";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {getStrokeArr, pushStroke, pushStrokeUnder, redrawBlurryStrokes, redrawStrokes} from "../Stroke/StrokeArr";
import {drawStroke, drawStrokeUnder} from "../Stroke/Stroke";
import {getTileWidth} from "../Tiling/TileWidth";
import {pushCompleteTile} from "./CompleteTileArr";
import {SHAPE_COLOR} from "../Constants";
import {shapeGlow} from "./Shape";
import {blurTile, fillAndBlur} from "../Effects/Blur";
import {fillLinearGradient, fillRadialGradient,} from "../Effects/Gradient";
import {fillTileColors} from "../Effects/ColorTheory";
import {fillEachPixel, fillEachPixelInverse} from "../Effects/FillGaps";
import {invert} from "../Effects/ColorTheory";

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
        fillEachPixelInverse(currTile)

        // if (fillType === "combination") fillEachPixel(currTile)
        // else if (fillType === "first") fillFirstColour(currTile)
        // else if (fillType === "last") fillLastColour(currTile)
        // else if (fillType === "complem") fillComplemCol(currTile)
        // else if (fillType === "blur") blurTile(currTile)
        // else if (fillType === "blurFill") fillAndBlur(currTile)
        // else if (fillType === "meanHue") fillMeanHue(currTile)
        // else if (fillType === "inverseMean") fillMeanHue(currTile)
        // else if (fillType === "radialGradient") fillRadialGradient(currTile, true)
        // else if (fillType === "diagGradient") fillLinearGradient(currTile, "diag")
        // else if (fillType === "horizGradient") fillLinearGradient(currTile, "horiz")
        // else if (fillType === "vertGradient") fillLinearGradient(currTile, "vert")
        // else if (fillType === "mostUsed") fillLinearGradient(currTile, "mostUsed")
        // else if (fillType === "leastUsed") fillLinearGradient(currTile, "leastUsed")

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
