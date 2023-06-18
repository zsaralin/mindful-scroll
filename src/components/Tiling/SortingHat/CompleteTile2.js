import {fillEachPixel} from "../../Tile/FillTile/FillGaps";
import {fillTile} from "../../Tile/FillTile/FillTile";
import {complem, fillTileColors, invertHue, meanHue} from "../../Effects/ColorTheory";
import {dither} from "../../Effects/Dither";
import {pixelated} from "../../Tile/FillTile/Pixelated";
import {blurTile} from "../../Effects/Blur";
import {helper} from "./TilingFillType";
import {getCurrColor} from "../../Stroke/Color/StrokeColor";
import {leastUsed, mostUsed} from "../../Effects/CommonColours";
import {
    fillPattern,
    fillStripesDiagonal,
    fillStripesHorizGrad,
    fillStripesVertGrad
} from "../../Tile/FillTile/FillPattern";
import {fillLinearGradient, fillRadialGradient} from "../../Effects/Gradient";

const under = [true, false]
const ditherI = [1, 2, 3, 4, 5]
const ditherW = [1, 2, 3, 2, 1];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const basic = urlParams.get('basic');
export let basicVersion = basic === 'true' ? true: false;

export function completeTile2(tile, tiling) {
    fillTileColors(tile);

    const fillInfo = tiling.fillInfo;
    const fillType = helper(fillInfo.fillW, fillInfo.fillTypes);

    if (fillInfo.fillNum === 0) {
        const underType = helper(fillInfo.underW, under);

        if (tile.colors > 2 && Math.random() < fillInfo.combinW) {
            fillEachPixel(tile);
            return;
        }
        solidFillFn(tile, fillType, underType);
    } else if (fillInfo.fillNum === 1) {
        const underType = helper(fillInfo.underW, under);

        if (fillInfo.afterW === 0) {
            solidFillFn(tile, fillType, underType);
        } else {
            const col = getCol(tile, fillType);
            const afterType = helper(fillInfo.afterW, ["complem", "inverseHue"]);
            afterFillFn(tile, afterType, underType, col);
        }
        const ditherBool = Math.random() < fillInfo.ditherW;
        const i = helper(ditherW, ditherI);
        if (ditherBool) {
            dither(tile, i);
        }
    } else if (fillInfo.fillNum === 2) {
        solidFillFn(tile, fillType, true);
        afterBackFillFnMain(tiling, tile);
    } else if (fillInfo.fillNum === 3) {
        if (["first", "last", "meanHue", "most", "least"].includes(fillType)) {
            solidFillFn(tile, fillType, false);
        } else if (fillType === "outline") {
            fillPattern(tile, fillInfo.col0, fillInfo.col1);
        } else if (fillType === "stripes") {
            const angleType = helper(fillInfo.angleW, fillInfo.angleTypes);
            if (angleType === "horiz") {
                fillStripesHorizGrad(tile, fillInfo.col0, fillInfo.col1);
            } else if (angleType === "vert") {
                fillStripesVertGrad(tile, fillInfo.col0, fillInfo.col1);
            } else if (angleType === "diag") {
                const angleArr = fillInfo.angleArr;
                const angle = angleArr[Math.floor(Math.random() * angleArr.length)];
                fillStripesDiagonal(tile, angle, fillInfo.col0, fillInfo.col1);
            }
        } else if (fillType === "gradient") {
            const gradType = helper(fillInfo.gradW, fillInfo.gradTypes);
            if (gradType === "radial") {
                fillRadialGradient(tile, true);
            } else if (gradType === "diag") {
                fillLinearGradient(tile, "diag", fillInfo.col0, fillInfo.col1);
            } else if (gradType === "vert") {
                fillLinearGradient(tile, "vert", fillInfo.col0, fillInfo.col1);
            } else {
                fillLinearGradient(tile, "horiz", fillInfo.col0, fillInfo.col1);
            }
        }
        afterBackFillFnMain(tiling, tile);
    }
}

function getCol(tile, str) {
    let tempCol;
    if (str === "first") tempCol = tile.firstCol
    else if (str === "last") tempCol = getCurrColor()
    else if (str === "meanHue") tempCol = meanHue(tile.allColors)
    else if (str === "least") tempCol = leastUsed(tile)
    else if (str === "most") tempCol = mostUsed(tile)
    return tempCol;
}

export function solidFillFn(currTile, fillType, under) {
    if (fillType === "first") fillTile(currTile, "first", under)
    else if (fillType === "last") fillTile(currTile, "last", under)
    else if (fillType === "meanHue") fillTile(currTile, "meanHue", under)
    else if (fillType === "most") fillTile(currTile, "most", under)
    else if (fillType === "least") fillTile(currTile, "least", under)
}

export function afterFillFn(currTile, fillType, under, col) {
    if (fillType === "complem") fillTile(currTile, "input", under, complem(col))
    else if (fillType === "inverseHue") fillTile(currTile, "input", under, invertHue(col))
}

export function afterBackFillFn(currTile, fillType, i, background) {
    if (fillType === "dither") dither(currTile, i)
    else if (fillType === "blur") blurTile(currTile)
    else if (fillType === "pixel") pixelated(currTile, i, background)
}

function afterBackFillFnMain(tiling, tile, fillType){
    const afterBackFillType = helper(tiling.fillInfo.afterBackW, tiling.fillInfo.afterFillTypes)
    console.log(JSON.stringify(afterBackFillType))
    if (afterBackFillType === "dither") afterBackFillFn(tile, afterBackFillType, helper(ditherW, ditherI))
    else if (afterBackFillType === "pixel" && tile.colors > 1) {
        afterBackFillFn(tile, afterBackFillType, helper(ditherW, [3, 4, 5, 6, 7]), getCol(tile, fillType))
    }
    else if (afterBackFillType === "blur") afterBackFillFn(tile, afterBackFillType)
    else if(Array.isArray(afterBackFillType) && compareArrays(afterBackFillType, ["blur", "dither"])) {
        afterBackFillFn(tile, "blur")
        afterBackFillFn(tile, "dither", helper(ditherW, [3, 4, 5, 6, 7]))
    } else if(Array.isArray(afterBackFillType) && compareArrays(afterBackFillType, ["dither", "blur"])) {
        afterBackFillFn(tile, "dither", helper(ditherW, [3, 4, 5, 6, 7]))
        afterBackFillFn(tile, "blur")
    } else if(Array.isArray(afterBackFillType) && compareArrays(afterBackFillType, ["pixel", "blur"])) {
        afterBackFillFn(tile, "pixel", helper(ditherW, [3, 4, 5, 6, 7]), getCol(tile, fillType))
        afterBackFillFn(tile, "blur")
    } else if(Array.isArray(afterBackFillType) && compareArrays(afterBackFillType, ["pixel", "dither"])) {
        afterBackFillFn(tile, "pixel", helper(ditherW, [3, 4, 5, 6, 7]), getCol(tile, fillType))
        afterBackFillFn(tile, "dither", helper(ditherW, [3, 4, 5, 6, 7]))
    }
}

function compareArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false; // Arrays have different lengths, not equal
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false; // Elements at index i are different, not equal
        }
    }

    return true; // All elements are equal, arrays are equal
}