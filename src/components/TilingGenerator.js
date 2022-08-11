import {mul, EdgeShape, tilingTypes, IsohedralTiling}
    from '../lib';
import {LINE_WIDTH} from "./ScaleConstants";

function generateRandomNum() {
    var num = Math.floor(81 * Math.random());
    return (num === 27 ? generateRandomNum() : num);
}

function getScaler(tiling) {
    let t1 = tiling.getT1()
    let t2 = tiling.getT2()
    const B = Math.abs((t1.x * t2.y) - (t2.x * t1.y)) / (tiling.numAspects())
    const A = 2.5
    return Math.sqrt(A / B)
}

function fillColourArray() {
    let numTile = segArr.length
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

let scale = 1;
const ST = [50 + scale * Math.sqrt(3000), 0.0, 0.0, 0.0, 50 + scale * Math.sqrt(3000), 0.0];
const list =  [0, 0, (window.innerWidth / 50) / scale, 9 / scale]

let currTiling;
let currEdges;
let segArr; // array of paths for a tile
let tilingIndex;

let transition1x = 1;
let transition1y = 1;
let transition2x = 1;
let transition2y = 1;

let transition;

let xMin;
let xMax;
let yMin;
let yMax;

let tileDimensions = []

function setSegArr() {
    segArr = []
    for (let i of currTiling.fillRegionBounds(list[0], list[1], list[2], list[3])) {
        const T = mul(ST, i.T);
        let outXBounds = false; // tile is outside width of window
        let pathSeg = [] //contains segments of a tile
        for (let si of currTiling.shape()) {
            const S = mul(T, si.T);
            let seg = [mul(S, {x: 0.0, y: 0.0})];

            if (si.shape != EdgeShape.I) {
                const ej = currEdges[si.id];
                seg.push(mul(S, ej[0]));
                seg.push(mul(S, ej[1]));
                if (tilingIndex !== 67) transition = 1;
            }
            seg.push(mul(S, {x: 1.0, y: 0.0}));

            if (si.rev) {
                seg = seg.reverse();
            }
            if ((seg.length == 2 && isOutsideXBounds(seg[0].x, seg[1].x)) || (seg.length > 2 && isOutsideXBounds(seg[0].x, seg[3].x))) {
                outXBounds = true;
            }
            pathSeg.push(seg)
        }
        if (!outXBounds) {
            segArr.push(pathSeg)
        }
    }
}

function getRandomTransition() {
    return [0.98, 1.02][Math.floor(Math.random() * 2)]
}

export function getYBounds() {
    tileDimensions = []
    yMin = null;
    yMax = null;

    for (let i = 0; i < segArr.length; i++) {
        let tile = segArr[i]
        for (let j = 0; j < tile.length; j++) {
            let tileYMin = null;
            let tileYMax = null;
            let seg = tile[j]
            if (seg.length === 2) {
                tileYMin = setYMin(tileYMin, seg[0].y, seg[1].y)
                tileYMax = setYMax(tileYMax, seg[0].y, seg[1].y)
            } else {
                tileYMin = setYMin(tileYMin, seg[0].y, seg[3].y)
                tileYMax = setYMax(tileYMax, seg[0].y, seg[3].y)
            }
            if (yMin === null || tileYMin < yMin) {
                yMin = tileYMin;
            }
            if (yMax === null || tileYMax > yMax) {
                yMax = tileYMax;
            }
            tileDimensions.push([tileYMin, tileYMax])
        }
    }
    return [yMin, yMax]
}

export function getXBounds() {
    let xMin = null;
    let xMax = null;

    for (let i = 0; i < segArr.length; i++) {
        let tile = segArr[i]
        for (let j = 0; j < tile.length; j++) {
            let seg = tile[j]
            if (seg.length === 2) {
                xMin = setYMin(xMin, seg[0].x, seg[1].x)
                xMax = setYMax(xMax, seg[0].x, seg[1].x)
            } else {
                xMin = setYMin(xMin, seg[0].x, seg[3].x)
                xMax = setYMax(xMax, seg[0].x, seg[3].x)
            }
        }
    }
    return [xMin, xMax]
}

function isOutsideXBounds(x0, x1) { // returns true if tile is outside x bounds of screen
    let rightEdge = (window.innerWidth - 50)
    let leftEdge = 50;
    if (x0 > leftEdge && x0 < rightEdge && x1 > leftEdge && x1 < rightEdge ) {
        return false; // tile is inside x bounds of the screen
    }
    return true;
}

export function drawTiling(offsetX, offsetY) {
    let pathDict = {}
    let colorIndex = 0
    let cols = fillColourArray()
    let pathDrawn = false;
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
                    path.lineTo((seg[0].x + seg[1].x) / 2 + offsetX, (seg[0].y + seg[1].y) / 2 * transition + offsetY);
                    path.lineTo(seg[1].x + offsetX, seg[1].y + offsetY);
            } else {
                    let midpointY = (seg[0].y + seg[3].y) / 2;
                    let midpointX = (seg[0].x + seg[3].x) / 2;

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
            pathDict[cols[colorIndex]] = path
            colorIndex++;
            pathDrawn = true;
        }
    return !pathDrawn ? false : pathDict //return false if no tile was drawn (i.e., no tile was within the bounds)
}

export function fillTiling(pathDict) {
    let tilingCanvas = document.getElementById('tiling-canvas');
    let tilingCtx = tilingCanvas.getContext('2d');
    tilingCtx.fillStyle = "rgba(255, 255, 255, 0)"; //white transparent canvas

    var invisCan = document.getElementById('invis-canvas');
    var ctx = invisCan.getContext('2d');

    tilingCtx.lineWidth = ctx.lineWidth = LINE_WIDTH;
    tilingCtx.lineJoin = tilingCtx.lineCap = ctx.lineJoin = ctx.lineCap = "round";
    tilingCtx.strokeStyle = ctx.strokeStyle = '#000';

    for (let p in pathDict) {
        tilingCtx.fill(pathDict[p])
        tilingCtx.stroke(pathDict[p])
        tilingCtx.closePath()
        ctx.fillStyle = p
        ctx.fill(pathDict[p])
        ctx.stroke(pathDict[p])
        ctx.closePath()
    }
}

function setYMin(yMin, y0, y1) {
    if (yMin === null) return Math.min(y0, y1)
    return Math.min(Math.min(yMin, y0), y1)
}

function setYMax(yMax, y0, y1) {
    if (yMax === null) return Math.max(y0, y1)
    return Math.max(Math.max(yMax, y0), y1)
}

export function makeRandomTiling() {
    makeRandomTilingHelper()
    while (segArr.length === 0){
        makeRandomTilingHelper()
    }
    scale = getScaler(currTiling)
    transition = getRandomTransition()

    return {tiling: currTiling, edges: currEdges}
}

export function makeRandomTilingHelper(){
    // Construct a tiling
    const tp = tilingTypes[generateRandomNum()];
    let tiling = new IsohedralTiling(tp);

    // Randomize the tiling vertex parameters
    let ps = tiling.getParameters();
    for (let i = 0; i < ps.length; ++i) {
        ps[i] += Math.random() * 0.1 - 0.05;
    }
    tiling.setParameters(ps);

    let edges = [];
    for (let i = 0; i < tiling.numEdgeShapes(); ++i) {
        let ej = [];
        const shp = tiling.getEdgeShape(i);
        if (shp == EdgeShape.I) {
            // Pass
        } else if (shp == EdgeShape.J) {
            ej.push({x: Math.random() * 0.6, y: Math.random() - 0.5});
            ej.push({x: Math.random() * 0.6 + 0.4, y: Math.random() - 0.5});
        } else if (shp == EdgeShape.S) {
            ej.push({x: Math.random() * 0.6, y: Math.random() - 0.5});
            ej.push({x: 1.0 - ej[0].x, y: -ej[0].y});
        } else if (shp == EdgeShape.U) {
            ej.push({x: Math.random() * 0.6, y: Math.random() - 0.5});
            ej.push({x: 1.0 - ej[0].x, y: ej[0].y});
        }
        edges.push(ej);
    }
    currTiling = tiling;
    currEdges = edges;
    setSegArr()
}

