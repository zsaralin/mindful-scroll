import {pushCompleteTile} from "../CompleteTileArr";
import {complem, fillTileColors, invert, invertHue, meanHue} from "../../Effects/ColorTheory";
import {getCurrColor} from "../../Stroke/Color/StrokeColor";
import {leastUsed, mostUsed} from "../../Effects/CommonColours";
import {strokeArr} from "../../Stroke/StrokeType/StrokeArr";
import {redrawTransStrokesTile, refreshTrans} from "../../Stroke/StrokeType/TransparentStroke";
import {redrawDottedStrokesTile, refreshDotted} from "../../Stroke/StrokeType/DottedStroke";
import {smallOffset} from "../../Tiling/Tiling3";

function getCol(tile, str, inputCol){
    let tempCol;
    if(str === "input") tempCol = inputCol
    else if(str === "first") tempCol = tile.firstCol
    else if(str === "last") tempCol = getCurrColor()
    else if(str === "firstI") tempCol = invert(tile.firstCol)
    else if(str === "firstIHue") tempCol = invertHue(tile.firstCol)
    else if(str === "lastI") tempCol = invert(getCurrColor())
    else if(str === "firstC") tempCol = complem(tile.firstCol)
    else if(str === "lastC") tempCol = complem(getCurrColor())
    else if(str === "meanHue") tempCol = meanHue(tile.allColors)
    else if(str === "meanHueI") tempCol = invert(meanHue(tile.allColors))
    else if(str === "least") tempCol = leastUsed(tile)
    else if(str === "most") tempCol = mostUsed(tile)
    return tempCol;
}

export function fillTile(tile, str, under, inputCol){
    // fillTileColors(tile)
    let canvStr = under ? 'fill-canvas' : 'top-canvas'
    let ctx = document.getElementById(canvStr).getContext('2d');
    ctx.save()
    ctx.translate(0,-smallOffset)
    const col = getCol(tile, str, inputCol)
    console.log('LOOK NOW '  + col + ' and '  + str)

    console.log('IS BLACK OR CLOSE ? : ' + isBlackOrClose(col))
    ctx.fillStyle =  isBlackOrClose(col) ? '#333333'  : col; // replace black colours with dark grey
    tile.fillColor = col
    // console.log('LOOK NOW '  + ctx.fillStyle)
    ctx.fill(tile.path)
    tile.filled = true;
    if(tile.strokeType === "transparent"){
        refreshTrans(tile.id)
    } else if(tile.strokeType === "dotted"){
        refreshDotted(tile.id)
    }
    ctx.fillStyle = "rgba(0,0,0,0)"
    // strokeArr[tile.id] = [] // delete strokes
    ctx.restore()

    // pushCompleteTile(tile, col)
}

export function clearTile(tile, col){
    let canvStr = 'canvas'
    let ctx = document.getElementById(canvStr).getContext('2d');
    // let col = ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillStyle  = col;
    ctx.fill(tile.path)
}

function isBlackOrClose(col, threshold = 40) {
    if(col.startsWith("hsl")){
        const [, hue, saturation, lightness] = col.match(/hsl\((.*?),\s*(.*?)%,\s*(.*?)%\)/) || [];
        // Check if lightness is close to 0
        // Check if lightness is below the threshold
        if (parseFloat(lightness) < threshold/2) {
            // Check if saturation is below the threshold
            if (parseFloat(saturation) < threshold/2) {
                return true; // Color is darker than a dark gray
            }
        }
        return false; // Color is not black or close to black
    }
    else if(col.startsWith("rgba")){
        // Extract RGB values from the RGBA string
        const rgbValues = col.substring(col.indexOf('(') + 1, col.lastIndexOf(')')).split(',');
        // Convert RGB values to integers
        const red = parseInt(rgbValues[0].trim(), 10);
        const green = parseInt(rgbValues[1].trim(), 10);
        const blue = parseInt(rgbValues[2].trim(), 10);

        // Check if RGB values are below the threshold
        return red <= threshold && green <= threshold && blue <= threshold;
    }
    else {
        // Remove the '#' symbol if present
        const hex = col.replace('#', '');
        // Convert hex color to RGB representation
        const red = parseInt(hex.substring(0, 2), 16);
        const green = parseInt(hex.substring(2, 4), 16);
        const blue = parseInt(hex.substring(4, 6), 16);
        // Calculate the perceived brightness of the color
        const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

        // Check if the brightness is below the threshold
        return brightness <= threshold;
    }
}
