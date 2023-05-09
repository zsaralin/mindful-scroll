import {getTileWidth} from "../../Tiling/TileWidth";
import {fillTile} from "./FillTile";
import {pushStrokeUnder} from "../../Stroke/StrokeType/StrokeArr";
import {drawStroke, drawStrokeUnder} from "../../Stroke/DrawStroke";
import {isCircleInPath} from "./FillRatio";
import {BB_PADDING} from "../../Constants";

let col;

export function pixelated(tile, i, backgroundCol) { //3 to 8
    let ctx = document.getElementById('top-canvas').getContext('2d');

    let tileDim = tile.bounds
    let startX = Math.round(tileDim[0]) - BB_PADDING;
    let startY = Math.round(tileDim[2]) - BB_PADDING;
    let endX = Math.round(tileDim[1]) + BB_PADDING;
    let endY = Math.round(tileDim[3]) + BB_PADDING;
    console.log('tiletdim ' + tileDim)
    const imageData = ctx.getImageData(startX, startY, endX-startX, endY- startY);
    const pixels = imageData.data
    fillTile(tile, "input", false, backgroundCol ? backgroundCol : "white")
    for (let x = startX; x < endX; x += i) {
        for (let y = startY; y < endY; y += i) {
            if (isCircleInPath(tile.path, x, y)) {
                const index = (y - startY) * imageData.width * 4 + (x - startX) * 4;
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                col = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')'
                drawStroke(x, y, x+.5, y, col, i)
            }
        }
    }


}