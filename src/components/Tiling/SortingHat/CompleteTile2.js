import {fillEachPixel} from "../../Tile/FillTile/FillGaps";
import {fillTile} from "../../Tile/FillTile/FillTile";
import {complem, invertHue} from "../../Effects/ColorTheory";
import {dither} from "../../Effects/Dither";
import {pixelated} from "../../Tile/FillTile/Pixelated";
import {blurTile} from "../../Effects/Blur";

export function solidFillFn(currTile, fillType, under){
    if (fillType === "first") fillTile(currTile, "first", under)
    else if (fillType === "last") fillTile(currTile, "last", under)
    else if (fillType === "meanHue") fillTile(currTile, "meanHue", under)
    else if (fillType === "mostUsed") fillTile(currTile, "most", under)
    else if (fillType === "leastUsed") fillTile(currTile, "least", under)
}

export function afterFillFn(currTile, fillType, under, col){
    if (fillType === "complem") fillTile(currTile, "input", under, complem(col))
    else if (fillType === "inverseHue") fillTile(currTile, "input", under, invertHue(col))
}

export function afterBackFillFn(currTile, fillType, i){
    if (fillType === "dither") dither(currTile, i)
    else if (fillType === "blur") blurTile(currTile)
    else if (fillType === "pixel") pixelated(currTile, i)
}