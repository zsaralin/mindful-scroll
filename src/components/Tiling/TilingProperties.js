import {getBoundsTile, getBoundsTiling2} from "./TilingBounds";
import {getTile} from "./Tiling2";
import {drawStroke} from "../Stroke/DrawStroke";
import {getRandomHSV} from "../Stroke/Color/StrokeColor";

export function getRowCol(tiling) {
    let tilingBounds = tiling.bounds
    let tilingLeft = tilingBounds[0], tilingRight = tilingBounds[1]
    let tilingTop = tilingBounds[2], tilingBottom = tilingBounds[3]
    const topRow = [];
    const bottomRow = [];
    const leftCol = [];
    const rightCol = [];

    for (const key in tiling.pathDict) {
        const tile = tiling.pathDict[key];
        let [xmin, xmax, ymin, ymax] = tile.bounds
        let w = xmax - xmin
        let h = ymax - ymin
        if (ymin <= tilingTop + h) {
            topRow.push(tile);
        } else if (ymax > tilingBottom - h) {
            bottomRow.push(tile);
        }
        if (xmin < tilingLeft + w / 4 && xmax > tilingLeft + w / 4) {
            leftCol.push(tile);
        } else if (xmax > tilingRight - w / 4 && xmin < tilingRight - w / 4) {
            rightCol.push(tile);
        }
    }
    return [topRow, bottomRow, leftCol, rightCol]
}

export function minMaxTile(pathDict) {
    let minH;
    let minW;
    let maxH;
    let maxW;
    for (let key in pathDict) {
        let tile = pathDict[key]
        let [xmin, xmax, ymin, ymax] = tile.bounds
        let newX = xmax - xmin
        let newY = ymax - ymin
        if (!minW || newX < minW) minW = newX
        if (!minH || newY < minH) minH = newY
        if (!maxW || newX > maxW) maxW = newX
        if (!maxH || newY > maxH) maxH = newY
    }
    return [Math.round(minW), Math.round(minH), Math.round(maxW), Math.round(maxH)]
}

export function getGrid(pathDict) {
    let middleDict = {}
    let [minW, minH, maxW, maxH] = minMaxTile(pathDict)
    for (let key in pathDict) {
        let tile = pathDict[key]
        let mid = getMidpoint(tile, maxW, maxH)
        if (!middleDict[mid]) middleDict[mid] = []
        middleDict[mid].push(tile)
    }
    let points = Object.keys(middleDict)
    points = points.map(elem => elem.split(',').map(Number));

    // Sort the array based on x values first, and then y values for elements with the same x value
    points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let outputDict = {};
    for (let i = 0; i < points.length; i++) {
        let [x, y] = points[i];
        if (!outputDict[y]) {
            outputDict[y] = [];
        }
        outputDict[y].push(x)
        outputDict[y].push(y)
    }

    let outputArr = Object.values(outputDict);
    // outputArr is an array of arrays, where all of the elements with the same y value are in the same array.
    // ex: outputArr[0] = 178,180,391,180,604,180,817,180 (all the midpoints with 180 y value)
    return [outputArr, middleDict];
}

export function getMidpoint(tile) {
    let [xmin, xmax, ymin, ymax] = tile.bounds
    let w = xmax - xmin
    let h = ymax - ymin
    let mid = [Math.floor(xmin + w / 2), Math.floor(ymin + h / 2)]
    return mid
}

export function getTilingProp(pathDict) { // returns tiling properties
    let midSegDict = {} // middle of segment
    let vertDict = {} // vertices
    let orienDict = {} // orientation

    for (const key in pathDict) {
        const tile = pathDict[key]
        const segments = tile.segs;
        const distArr = []
        for (let i = 0; i < segments?.length; i++) { // for each defined segment (does not include random shape)
            const seg = segments[i];
            let {x: x1, y: y1} = seg[0];
            let x2 = seg.length === 4 ? seg[3].x : seg[1].x;
            let y2 = seg.length === 4 ? seg[3].y : seg[1].y;

            midSegDict = midSegHelper(midSegDict, x1, y1, x2, y2, tile)
            vertDict = vertHelper(vertDict, x1, y1, x2, y2, tile)

            const normSeg = normalizeCurve(seg)
            for (let i = 0; i < normSeg.length; i++) {
                distArr.push(Math.round(normSeg[i].x * 10) / 10)
                distArr.push(Math.round(normSeg[i].y * 10) / 10)
            }
        }
        if (!orienDict[distArr]) {
            orienDict[distArr] = [];
        }
        orienDict[distArr].push(tile);
    }
    return [midSegDict, vertDict, orienDict]
}

function midSegHelper(midSegDict, x1, y1, x2, y2, tile) {
    const midP = [Math.floor((x1 + x2) / 2), Math.floor((y1 + y2) / 2)];
    if (!midSegDict[midP]) {
        midSegDict[midP] = [];
    }

    midSegDict[midP].push(tile);
    return midSegDict
}

function vertHelper(vertDict, x1, y1, x2, y2, tile) {
    const vertArr = [Math.floor(x1 / 2) + 1, Math.floor(y1 / 2) + 1, Math.floor(x2 / 2) + 1, Math.floor(y2 / 2) + 1];
    if (!vertDict[[vertArr[0], vertArr[1]]]) {
        vertDict[[vertArr[0], vertArr[1]]] = [];
    }
    vertDict[[vertArr[0], vertArr[1]]].push(tile);
    if (!vertDict[[vertArr[2], vertArr[3]]]) {
        vertDict[[vertArr[2], vertArr[3]]] = [];
    }
    vertDict[[vertArr[2], vertArr[3]]].push(tile);
    return vertDict
}

export function getAdjTiles(tile, tiling) {
    let adjArr = []
    let segments = tile.segs // segments of tile
    for (let i = 0; i < segments?.length; i++) {
        const seg1 = segments[i];
        const {x: x1, y: y1} = seg1[0];
        const x2 = seg1.length === 4 ? seg1[3].x : seg1[1].x;
        const y2 = seg1.length === 4 ? seg1[3].y : seg1[1].y;
        const midpoint1 = [Math.floor((x1 + x2) / 2), Math.floor((y1 + y2) / 2)]
        tiling.midSeg[midpoint1].forEach(value => {
            adjArr.push(value);
        });
    }
    return adjArr
}

export function getNeighTiles(tile, tiling) {
    let neigh = []
    let segments1 = tile.segs // segments of tile
    for (let i = 0; i < segments1.length; i++) {
        const seg1 = segments1[i];
        let {x: x1, y: y1} = seg1[0];
        let x2 = seg1.length === 4 ? seg1[3].x : seg1[1].x;
        let y2 = seg1.length === 4 ? seg1[3].y : seg1[1].y;
        x1 = Math.floor(x1 / 2) + 1;
        y1 = Math.floor(y1 / 2) + 1;
        x2 = Math.floor(x2 / 2) + 1;
        y2 = Math.floor(y2 / 2) + 1;
        tiling.vert[[x1, y1]].forEach(value => {
            neigh.push(value);
        });
        tiling.vert[[x2, y2]].forEach(value => {
            neigh.push(value);
        });
    }
    // console.log(JSON.stringify(neigh));
    return neigh
}

export function getOrienTiles(tile, tiling) {
    let orien = []
    let segments = tile.segs // segments of tile
    let distArr = []
    for (let i = 0; i < segments.length; i++) {
        const seg1 = segments[i];
        const normSeg = normalizeCurve(seg1)
        for (let i = 0; i < normSeg.length; i++) {
            distArr.push(Math.round(normSeg[i].x * 10) / 10) // round to one dec place
            distArr.push(Math.round(normSeg[i].y * 10) / 10)
        }
    }
    orien = tiling.orien[distArr]
    return orien
}

function normalizeCurve(curve) {
    const translation = {x: curve[0].x, y: curve[0].y};
    const normCurve = curve.map(point => ({x: point.x - translation.x, y: point.y - translation.y}));
    // Scale the control points so that the length of the curve is 1
    let length = curve.length === 2 ? Math.sqrt(normCurve[1].x * normCurve[1].x + normCurve[1].y * normCurve[1].y) :
        Math.sqrt(normCurve[1].x * normCurve[1].x + normCurve[1].y * normCurve[1].y);

    return normCurve.map(point => ({x: point.x / length, y: point.y / length}));
}

export function isSymmetricalX(t) { // x axis
    let rows = t.grid[0]
    let points = rows.flat();

    const numPoints = points.length;
    let sumX = 0;

    // Sort the points by their x-coordinates
    points.sort((a, b) => a[0] - b[0]);
    console.log(points)
    // Calculate the sum of x-coordinates
    for (let i = 0; i < numPoints; i += 2) {
        sumX += points[i];
    }

    // Calculate the x-coordinate of the axis of symmetry
    const axisX = sumX / (numPoints / 2);

    // Check if the points are equidistant from the axis of symmetry
    for (let i = 0; i < numPoints; i += 2) {
        const expectedDistance = Math.abs(points[i] - axisX);
        const actualDistance = Math.abs(axisX - points[numPoints - i - 2]);
        if (Math.abs(expectedDistance - actualDistance) > 2) {
            return false;
        }
    }

    return true;

}

export function isSymmetricalY(t) { // y axis
    let rows = t.grid[0];
    let points = rows.flat();

    const numPoints = points.length;
    let sumY = 0;

    // Sort the points by their y-coordinates
    points.sort((a, b) => a[1] - b[1]);

    // Calculate the sum of y-coordinates
    for (let i = 0; i < numPoints; i += 2) {
        sumY += points[i+1];
    }

    // Calculate the y-coordinate of the axis of symmetry
    const axisY = sumY / (numPoints / 2);

    // Check if the points are within 2 units of the axis of symmetry along the y-axis
    for (let i = 0; i < numPoints; i += 2) {
        const expectedDistance = Math.abs(points[i+1] - axisY);
        const actualDistance = Math.abs(points[numPoints - i - 1] - axisY);
        if (Math.abs(expectedDistance - actualDistance) > 2) {
            return false;
        }
    }

    return true;
}