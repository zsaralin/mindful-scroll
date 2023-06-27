import {fillEachPixel} from "../../Tile/FillTile/FillGaps";
import {fillTile, fillTileFade} from "../../Tile/FillTile/FillTile";
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
import {logFillTile} from "../../Logging/FillTileLog";
import {colorCode} from "../../Tile/FillTile/ColourFn";
import {getNeighTiles} from "../TilingProperties";
import {fillNeighGrad} from "../../Tile/FillTile/FillAnim";
import {animActive, fillNeighTiles} from "../../Effects/NeighTiles";
import {smallOffset} from "../Tiling3";
import {getFillRatio} from "../../Tile/FillTile/FillRatio";

const under = [true, false]
const ditherI = [2, 3, 4, 5, 6]
const ditherW = [1, 2, 3, 2, 1];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const basic = urlParams.get('basic');
export let basicVersion = basic === 'true' ? true : false;

export function completeTile2(tile, tiling) {
    fillTileColors(tile);
    const fillInfo = tiling.fillInfo;
    const fillType = helper(fillInfo.fillW, fillInfo.fillTypes);

    let logStr = fillType
    let underType;

    if (fillInfo.fillNum === 0) {
        underType = helper(fillInfo.underW, under);
        if (tile.colors > 2 && Math.random() < fillInfo.combinW) {
            fillEachPixel(tile);
            logFillTile("fillEachPixel", underType.toString(), tile.i, tile.colors, tile.fillColor, tile.fillColors, colorCode)
            return;
        }
        let nTiles = getNeighTiles(tile, tiling)
        if (nTiles.length > 3 && Math.random() < .2 && !tiling.fillInfo.strokeTypes.includes("transparent") && !tiling.fillInfo.strokeTypes.includes("dotted")
            && !animActive && Math.random() < 1 && tile.colors.length === 1) {
            fillNeighTiles(tile, nTiles, tile.colors[0], smallOffset, false)
        } else if(fillType !== "input" && tile.strokeType === "reg" && getFillRatio(tile, smallOffset, 'top-canvas') < .95 && Math.random()<.7){
            fillTileFade(tile, fillType, underType)
        }
        else{
            solidFillFn(tile, fillType, underType);
        }

    } else if (fillInfo.fillNum === 1) {
        underType = helper(fillInfo.underW, under);
        if (fillInfo.afterW === 0) {
            solidFillFn(tile, fillType, underType);
        } else {
            const col = getCol(tile, fillType);
            const afterType = helper(fillInfo.afterW, ["complem", "inverseHue"]);
            afterFillFn(tile, afterType, underType, col);
            logStr += ',' + afterType
        }
        const ditherBool = Math.random() < fillInfo.ditherW;
        const i = helper(ditherW, ditherI);
        if (ditherBool) {
            dither(tile, i);
            logStr += `,dither_${i}`
        }
    } else if (fillInfo.fillNum === 2) {
        underType = true
        solidFillFn(tile, fillType, true);
        const afterStr = afterBackFillFnMain(tiling, tile, fillType);
        logStr += afterStr
    } else if (fillInfo.fillNum === 3) {
        underType = true;
        if (["first", "last", "meanHue", "most", "least"].includes(fillType)) {
            underType = false;
            solidFillFn(tile, fillType, false);
        } else if (fillType === "outline") {
            fillPattern(tile, fillInfo.col0, fillInfo.col1);
        } else if (fillType === "stripes") {
            const angleType = helper(fillInfo.angleW, fillInfo.angleTypes);
            logStr += '_' + angleType
            if (angleType === "horiz") {
                fillStripesHorizGrad(tile, fillInfo.col0, fillInfo.col1);
            } else if (angleType === "vert") {
                fillStripesVertGrad(tile, fillInfo.col0, fillInfo.col1);
            } else if (angleType === "diag") {
                const angleArr = fillInfo.angleArr;
                const angle = angleArr[Math.floor(Math.random() * angleArr.length)];
                logStr += '_' + angle
                fillStripesDiagonal(tile, angle, fillInfo.col0, fillInfo.col1);
            }
        } else if (fillType === "gradient") {
            const gradType = helper(fillInfo.gradW, fillInfo.gradTypes);
            logStr += '_' + gradType
            if (gradType === "radial") {
                fillRadialGradient(tile, fillInfo.col0, fillInfo.col1);
            } else if (gradType === "diag") {
                fillLinearGradient(tile, "diag", fillInfo.col0, fillInfo.col1);
            } else if (gradType === "vert") {
                fillLinearGradient(tile, "vert", fillInfo.col0, fillInfo.col1);
            } else {
                fillLinearGradient(tile, "horiz", fillInfo.col0, fillInfo.col1);
            }
        }
        const afterStr = afterBackFillFnMain(tiling, tile, fillType);
        logStr += afterStr
    }
    console.log('LOGSTR '  + logStr + ' and ' + underType.toString())
    logFillTile(logStr, underType.toString(), tile.id, tile.colors, tile.fillColor, tile.fillColors, colorCode)
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
    else if (fillType === "blurry") blurTile(currTile)
    else if (fillType === "pixel") pixelated(currTile, i, background)
}

function afterBackFillFnMain(tiling, tile, fillType) {
    const afterBackFillType = helper(tiling.fillInfo.afterBackW, tiling.fillInfo.afterFillTypes)
    if (afterBackFillType === "dither") {
        const i = helper(ditherW, ditherI)
        afterBackFillFn(tile, afterBackFillType, i)
        return ',dither_' + i
    } else if (afterBackFillType === "pixel" && tile.colors > 1) {
        const i = helper(ditherW, [3, 4, 5, 6, 7])
        afterBackFillFn(tile, afterBackFillType, i, getCol(tile, fillType))
        return ',pixel' + i
    } else if (afterBackFillType === "blurry") {
        afterBackFillFn(tile, afterBackFillType)
        return ',blurry'
    } else if (Array.isArray(afterBackFillType) && compareArrays(afterBackFillType, ["blurry", "dither"])) {
        afterBackFillFn(tile, "blurry")
        const i = helper(ditherW, ditherI)
        afterBackFillFn(tile, "dither", i)
        return ',blurry,dither_' + i
    } else if (Array.isArray(afterBackFillType) && compareArrays(afterBackFillType, ["dither", "blurry"])) {
        const i = helper(ditherW, ditherI)
        afterBackFillFn(tile, "dither", i)
        afterBackFillFn(tile, "blurry")
        return ',dither_' + i + ',blurry'
    } else if (Array.isArray(afterBackFillType) && compareArrays(afterBackFillType, ["pixel", "blurry"])) {
        const i = helper(ditherW, [3, 4, 5, 6, 7])
        afterBackFillFn(tile, "pixel", i, getCol(tile, fillType))
        afterBackFillFn(tile, "blurry")
        return ',pixel' + i + ',blurry'
    } else if (Array.isArray(afterBackFillType) && compareArrays(afterBackFillType, ["pixel", "dither"])) {
        const i0 = helper(ditherW, [3, 4, 5, 6, 7])
        const i1 = helper(ditherW, [3, 4, 5, 6, 7])
        afterBackFillFn(tile, "pixel", i0, getCol(tile, fillType))
        afterBackFillFn(tile, "dither", i1)
        return ',dither_' + i0 + ',dither' + i1
    } else return '' // for "none"
    // return Array.isArray(afterBackFillType) ? afterBackFillType.join(", ") : afterBackFillType // for logging
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