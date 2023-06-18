import {getBoundsTile, getRows} from "./TilingBounds";
import {tilingIndex} from "./TilingGenerator";
import {EdgeShape, IsohedralTiling, tilingTypes} from "../../lib";
import {v4 as uuidv4} from 'uuid';
import {prevOffsetY} from "../Scroll/PageScroll";

const SQUARE_INDEX = 67
let transition1x = 1;
let transition1y = 1;
let transition2x = 1;
let transition2y = 1;
let transition = 1;

let idDict = {}
const colourArr = fillArrayWithUniqueRGB()

export function getTilingPathDict(segArr, offsetX, offsetY) {
    // offsetY += prevOffsetY;
    let pathDict = {}
    let colorIndex = 0
    const cols = colourArr.splice(0, segArr.length);
    colourArr.push(...cols);
    if (tilingIndex === SQUARE_INDEX) transition = [0.98, 1.02][Math.floor(Math.random() * 2)]
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
                // if (tilingIndex === SQUARE_INDEX) transition =  [0.98, 1.02][Math.floor(Math.random() * 2)]
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
                    seg[1].x + offsetX - transition1x, seg[1].y * transition1y + offsetY ,
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
        // console.log(Math.round(bounds[2]) + ' and ' +Math.round(bounds[3]))
        const id = uuidv4()
        pathDict[cols[colorIndex]] = {
            path: path,
            bounds: bounds,
            filled: false,
            firstCol: 'white',
            inPath: [],
            id: id,
            colors: [],
            allColors: [],
            segs: tile,
            watercolor: false,
            fillType: null,
            fillColors: null,
            strokeType: null,
        }
        idDict[id] = pathDict[cols[colorIndex]]
        colorIndex++;
    }
    return pathDict //return false if no tile was drawn (i.e., no tile was within the bounds)
}

function fillColourArray(numTile) {
    let cols = new Array(numTile) // colour array, numTile must be <= 765
    const num = getRandomRGB();
    cols[0] = "rgb(" + num[0] + ", " + num[1] + ", " + num[2] + ")"; // Return the RGB color string
    for (let i = 1; i < numTile; i++) {
        if(num[0] + i > 255){
            cols[i] = "rgb(" + (num[0]) + ", " + num[1] + ", " + num[2] + ")"

        let g = num[1]
        let b = num[2]
    }
    return cols
}}


// Function to generate a random RGB color
function getRandomRGB() {
    var r = Math.floor(Math.random() * 256); // Random value between 0 and 255 for red
    var g = Math.floor(Math.random() * 256); // Random value between 0 and 255 for green
    var b = Math.floor(Math.random() * 256); // Random value between 0 and 255 for blue
    return "rgb(" + r + "," + g + "," + b + ")"; // Return the RGB string
}

// Function to fill an array with unique RGB strings
function fillArrayWithUniqueRGB() {
    const arrLength = 500;
    var rgbArray = [];
    var uniqueRGB = {};

    for (var i = 0; i < arrLength; i++) {
        var rgbString = getRandomRGB();
        // Check if the generated RGB string already exists in the uniqueRGB object
        // If it does, decrement i to try generating a new RGB string again
        if (uniqueRGB.hasOwnProperty(rgbString)) {
            i--;
            continue;
        }

        uniqueRGB[rgbString] = true; // Add the RGB string to the uniqueRGB object
        rgbArray.push(rgbString); // Add the RGB string to the array
    }

    return rgbArray;
}

export function getTileWithId(id) {
    return idDict[id]
}


export function addShape(shape){
    const pathDict = {}
    const col = getShapeColor()
    const id = uuidv4()
    pathDict[col] = {
        path: shape[0],
        bounds: shape[1],
        filled: false,
        firstCol: 'white',
        inPath: [],
        id: id,
        colors: [],
        allColors: [],
        segArr: undefined,
        watercolor: false,
        fillType: null,
        fillColors: null,
    };
    idDict[id] = pathDict[col]
    return pathDict
}
export function getShapeColor(){
    const col = colourArr.shift();
    colourArr.push(col);
    return col
}