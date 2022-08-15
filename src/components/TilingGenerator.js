import {mul, EdgeShape, tilingTypes, IsohedralTiling}
    from '../lib';
import {LINE_WIDTH} from "./ScaleConstants";
import {getBoundsTile} from "./TilingBounds";

function generateRandomNum() {
    var num = Math.floor(81 * Math.random());
    return (num === 27 ? generateRandomNum() : num);
}

function getScaler(tiling) {
    let t1 = tiling.getT1()
    let t2 = tiling.getT2()
    const B = Math.abs((t1.x * t2.y) - (t2.x * t1.y)) / (tiling.numAspects())
    const A = 5
    return Math.sqrt(A / B)
}

function fillColourArray(segArr) {
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
const ST = [150 / scale, 0.0, 0.0, 0.0, 150 / scale, 0.0];
const list = [0, 0, (window.innerWidth / 50) / scale, 9 / scale]

// let segArr; // array of paths for a tile
let tilingIndex;

let transition1x = 1;
let transition1y = 1;
let transition2x = 1;
let transition2y = 1;

let transition;

function getSegArr(tiling, edges) {
    let segArr = []
    for (let i of tiling.fillRegionBounds(list[0], list[1], list[2], list[3])) {
        const T = mul(ST, i.T);
        let outXBounds = false; // tile is outside width of window
        let pathSeg = [] //contains segments of a tile
        for (let si of tiling.shape()) {
            const S = mul(T, si.T);
            let seg = [mul(S, {x: 0.0, y: 0.0})];

            if (si.shape != EdgeShape.I) {
                const ej = edges[si.id];
                seg.push(mul(S, ej[0]));
                seg.push(mul(S, ej[1]));
                if (tilingIndex !== 67) transition = 1;
            }
            seg.push(mul(S, {x: 1.0, y: 0.0}));

            if (si.rev) {
                seg = seg.reverse();
            }
            if (isOutsideWindow(seg)) {
                outXBounds = true;
            }
            pathSeg.push(seg)
        }
        if (!outXBounds) {
            segArr.push(pathSeg)
        }
    }
    return segArr
}

function getRandomTransition() {
    return [0.98, 1.02][Math.floor(Math.random() * 2)]
}

export function drawTiling(segArr, offsetX, offsetY) {
    let pathDict = {}
    let colorIndex = 0
    let cols = fillColourArray(segArr)
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
        // console.log(`tile : ${getBoundsTile(tile)}`)
        let bounds = getBoundsTile(tile)
        bounds[0] = bounds[0] + offsetX
        bounds[1] = bounds[1] + offsetX
        bounds[2] = bounds[2] + offsetY
        bounds[3] = bounds[3] + offsetY
        pathDict[cols[colorIndex]] = {path: path, tile: bounds}
        colorIndex++;
    }
    return pathDict //return false if no tile was drawn (i.e., no tile was within the bounds)
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
        tilingCtx.fill(pathDict[p].path)
        if (pathDict[p].tile !== undefined && blue) {
            tilingCtx.strokeStyle = 'green'
            tilingCtx.strokeRect(pathDict[p].tile[0], pathDict[p].tile[2], pathDict[p].tile[1] - pathDict[p].tile[0], pathDict[p].tile[3] - pathDict[p].tile[2])
            // blue = false;
        }
        tilingCtx.strokeStyle = '#000';

        tilingCtx.stroke(pathDict[p].path)
        tilingCtx.closePath()
        ctx.fillStyle = p
        ctx.fill(pathDict[p].path)
        ctx.stroke(pathDict[p].path)
        ctx.closePath()
    }
}

let blue = true;

export function makeRandomTiling() {
    let segArr = makeRandomTilingHelper()
    while (segArr.length === 0) {
        segArr = makeRandomTilingHelper()
    }
    transition = getRandomTransition()

    return segArr;
}

export function makeRandomTilingHelper() {
    // Construct a tiling
    const tp = tilingTypes[generateRandomNum()];
    let tiling = new IsohedralTiling(tp);

    // Randomize the tiling vertex parameters
    let ps = tiling.getParameters();
    for (let i = 0; i < ps.length; ++i) {
        ps[i] += Math.random() * 0.1 - 0.05;
    }
    tiling.setParameters(ps);
    scale = getScaler(tiling)

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
    return getSegArr(tiling, edges)

}

function isOutsideWindow(seg) { // returns true if tile is outside x bounds of screen
    let x0 = seg[0].x;
    let x1 = seg.length === 2 ? seg[1].x : seg[3].x
    let rightEdge = (window.innerWidth - 50)
    let leftEdge = 50;
    if (x0 > leftEdge && x0 < rightEdge && x1 > leftEdge && x1 < rightEdge) {
        return false; // tile is inside x bounds of the screen
    }
    return true;
}


