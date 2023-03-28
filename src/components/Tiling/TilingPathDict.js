import {getBoundsTile, getRows} from "./TilingBounds";
import {tilingIndex} from "./TilingGenerator";
import {EdgeShape, IsohedralTiling, tilingTypes} from "../../lib";
import { v4 as uuidv4 } from 'uuid';

const SQUARE_INDEX  = 67
let transition1x = 1;
let transition1y = 1;
let transition2x = 1;
let transition2y = 1;
let transition = 1;

export function getTilingPathDict(segArr, offsetX, offsetY) {
    let pathDict = {}
    let colorIndex = 0
    let cols = fillColourArray(segArr.length)
    for (let i = 0; i < segArr.length; i++) { // for each tile in tiling
        let path = new Path2D()
        let start = true;
        let tile = segArr[i]
        for (let j = 0; j < tile.length; j++) {
            let seg = tile[j] // for segments of a tile
            if (start) {
                start = false;
                path.moveTo(seg[0].x + offsetX, seg[0].y + offsetY)
            }
            if (seg.length == 2) {
                if (tilingIndex === SQUARE_INDEX) transition =  [0.98, 1.02][Math.floor(Math.random() * 2)]
                path.lineTo((seg[0].x + seg[1].x) / 2 + offsetX, (seg[0].y + seg[1].y) / 2 * transition + offsetY);
                path.lineTo(seg[1].x + offsetX, seg[1].y + offsetY);
            } else {
                let midpointX = (seg[0].x + seg[3].x) / 2;
                let midpointY = (seg[0].y + seg[3].y) / 2;

                if (seg[1].y < midpointY) {
                    transition1y = 1.04
                } else {
                    transition1y = .96
                }
                if (seg[2].y < midpointY) {
                    transition2y = 1.04
                } else {
                    transition2y = .96
                }

                if (seg[1].x < midpointX) {
                    transition1x = -0.03 * seg[1].y
                } else {
                    transition1x = 0.03 * seg[1].y
                }
                if (seg[2].x < midpointX) {
                    transition2x = -0.03 * seg[2].y
                } else {
                    transition2x = 0.03 * seg[2].y
                }

                path.bezierCurveTo(
                    seg[1].x + offsetX - transition1x, seg[1].y * transition1y + offsetY,
                    seg[2].x + offsetX - transition2x, seg[2].y * transition2y + offsetY,
                    seg[3].x + offsetX, seg[3].y + offsetY);

            }
        }
        let bounds = getBoundsTile(tile);
        // [bounds[0], bounds[1]].forEach((bound, index) => bounds[index] += offsetX);
        // [bounds[2], bounds[3]].forEach((bound, index) => bounds[index] += offsetY);
        bounds[0] = bounds[0] + offsetX
        bounds[1] = bounds[1] + offsetX
        bounds[2] = bounds[2] + offsetY
        bounds[3] = bounds[3] + offsetY
        pathDict[cols[colorIndex]] = {path: path, bounds: bounds, filled: false, firstCol: 'white', inPath: [], id: uuidv4(), colors: [], allColors: [], segs : tile}
        colorIndex++;
    }
    return pathDict //return false if no tile was drawn (i.e., no tile was within the bounds)
}

function fillColourArray(numTile) {
    let cols = new Array(numTile) // colour array, numTile must be <= 765
    for (let i = 0; i < numTile; i++) {
        if (i < 255) //(0-254, 255, 255)
            cols[i] = `rgb(${i},255,255)`
        else if (i < 255 * 2) { //(255, 0-254, 255)
            cols[i] = `rgb(255,${i - 255},255)`
        } else if (i < 255 * 3) {  //(255, 255, 0-254)
            cols[i] = `rgb(255,255,${i - 255 * 2})`
        }
    }
    return cols
}

