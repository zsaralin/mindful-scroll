import {getBoundsTile, getBoundsTiling2} from "./TilingBounds";
import {getTile} from "./Tiling2";
import {drawStroke} from "../Stroke/DrawStroke";
import {getRandomHSV} from "../Stroke/StrokeColor";

export function getRowCol(pathDict) {
    let tilingBounds = getBoundsTiling2(pathDict)
    let tilingLeft = tilingBounds[0], tilingRight = tilingBounds[1]
    let tilingTop = tilingBounds[2], tilingBottom = tilingBounds[3]
    const topRow = [];
    const bottomRow = [];
    const leftCol = [];
    const rightCol = [];

    for (const key in pathDict) {
        const tile = pathDict[key];
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

function minWidth(pathDict) {
    let ansY;
    let ansX;
    for (let key in pathDict) {
        let tile = pathDict[key]
        let [xmin, xmax, ymin, ymax] = tile.bounds
        let newX = xmax - xmin
        let newY = ymax - ymin
        if (!ansX || newX < ansX) ansX = newX
        if (!ansY || newY < ansY) ansY = newY
    }
    return [ansX, ansY]
}


export function getGrid(pathDict) {
    let middleDict = {}
    for (let key in pathDict) {
        let tile = pathDict[key]
        let [xmin, xmax, ymin, ymax] = tile.bounds
        let w = xmax - xmin
        let h = ymax - ymin
        let mid = [Math.floor(xmin + w / 2), Math.floor(ymin + h / 2)]
        mid[1] = Math.floor(mid[1]/150) + 1
        if(!middleDict[mid]) middleDict[mid] = []
        middleDict[mid].push(tile)
    }
    let points = Object.keys(middleDict)
    points = points.map(elem => elem.split(',').map(Number));

    // Sort the array based on x values first, and then y values for elements with the same x value
    points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let outputDict = {};
    for (let i = 0; i < points.length; i++) {
        let [x, y] = points[i];
        if(!outputDict[y]){
            outputDict[y] = [];
        }
            outputDict[y].push(x)
            outputDict[y].push(y)
    }

    let outputArr = Object.values(outputDict);
    return [outputArr, middleDict];
}


let midpointDict = {}
let vertDict = {} //vertices
let orienDict = {}

export function setMidpointDict(pathDict) {
    let midpointDict = {}

    for (const key in pathDict) {
        const tile = pathDict[key]
        const segments = tile.segs;
        const distArr = []
        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];
            let {x: x1, y: y1} = seg[0];
            let x2 = seg.length === 4 ? seg[3].x : seg[1].x;
            let y2 = seg.length === 4 ? seg[3].y : seg[1].y;
            const midP = [Math.floor((x1 + x2) / 2), Math.floor((y1 + y2) / 2)];
            if (!midpointDict[midP]) {
                midpointDict[midP] = [];
            }
            midpointDict[midP].push(tile);

            const vertArr = [Math.floor(x1 / 2) + 1, Math.floor(y1 / 2) + 1, Math.floor(x2 / 2) + 1, Math.floor(y2 / 2) + 1];
            if (!vertDict[[vertArr[0], vertArr[1]]]) {
                vertDict[[vertArr[0], vertArr[1]]] = [];
            }
            vertDict[[vertArr[0], vertArr[1]]].push(tile);
            if (!vertDict[[vertArr[2], vertArr[3]]]) {
                vertDict[[vertArr[2], vertArr[3]]] = [];
            }
            vertDict[[vertArr[2], vertArr[3]]].push(tile);

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
    return midpointDict
}

export function getAdjacentTiles(tile) {
    let adjArr = []
    let segments = tile.segs // segments of tile
    for (let i = 0; i < segments.length; i++) {
        const seg1 = segments[i];
        const {x: x1, y: y1} = seg1[0];
        const x2 = seg1.length === 4 ? seg1[3].x : seg1[1].x;
        const y2 = seg1.length === 4 ? seg1[3].y : seg1[1].y;
        const midpoint1 = [Math.floor((x1 + x2) / 2), Math.floor((y1 + y2) / 2)]
        midpointDict[midpoint1].forEach(value => {
            adjArr.push(value);
        });
    }
    return adjArr
}

export function getNeighbourTiles(tile) {
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
        vertDict[[x1, y1]].forEach(value => {
            neigh.push(value);
        });
        vertDict[[x2, y2]].forEach(value => {
            neigh.push(value);
        });
    }
    return neigh
}

export function getOrienTiles(tile) {
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
    orien = orienDict[distArr]
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