import {getStrokeArr} from "../Stroke/StrokeArr";
import {pushCompleteTile} from "../Tile/CompleteTileArr";

export function mostUsed(tile) {
    let colorCounts = getColorCounts(tile)

    // Find the least common color by finding the key in the colorCounts object with the smallest value
    let mostCommonColor;
    let mostCommonCount = 0;
    for (let color in colorCounts) {
        if (colorCounts[color] > mostCommonCount) {
            mostCommonColor = color;
            mostCommonCount = colorCounts[color];
        }
    }
    return mostCommonColor
}

export function leastUsed(tile) {
    let colorCounts = getColorCounts(tile)
    // Find the least common color by finding the key in the colorCounts object with the smallest value
    let leastCommonColor;
    let leastCommonCount = getStrokeArr()[tile.id].length;
    for (let color in colorCounts) {
        if (colorCounts[color] <= leastCommonCount) {
            leastCommonColor = color;
            leastCommonCount = colorCounts[color];
        }
    }
    return leastCommonColor
}

function getColorCounts(tile){
    let colorCounts = {};

    let tileStrokes = getStrokeArr()[tile.id]
    // Iterate through the strokeArr array and count the number of strokes of each color
    for (let i = 0; i < tileStrokes.length; i++) {
        let color = tileStrokes[i].color;
        if (colorCounts[color] === undefined) {
            colorCounts[color] = 1;
        } else {
            colorCounts[color]++;
        }
    }
}
