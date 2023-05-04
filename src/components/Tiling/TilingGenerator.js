import {mul, EdgeShape, tilingTypes, IsohedralTiling}
    from '../../lib';
import {LINE_WIDTH} from "../Constants";
import {getCurrColor} from "../Stroke/Color/StrokeColor";
import {getTile} from "./TilingArr";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {getTileWidth} from "./TileWidth";
import {getYPadding} from "./TilingSize";
import {getBoundsTiling, getBoundsTiling2} from "./TilingBounds";
import {createPath, getPathPadding} from "./TilingPath";

function generateRandomNum() {
    var num =  Math.floor(81 * Math.random());
    return num;
    // return (num === 27 ? generateRandomNum() : num);
}

function getScaler(tiling) {
    let t1 = tiling.getT1()
    let t2 = tiling.getT2()
    const B = Math.abs((t1.x * t2.y) - (t2.x * t1.y)) / (tiling.numAspects())
    const A = 2
    return Math.sqrt(A / B)
}

let scale = 1;
let ST;
let list;

export let tilingIndex;

function getSegArr(tiling, edges) {
    let segArr = [] // array of paths for a tile
    ST = [100 * scale, 0.0, 0.0, 0.0, 100 * scale, 0.0];
    list = [0, 0, (window.innerWidth / 50) / scale, 9 / scale]
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
    segArr.t = tiling; segArr.e = edges;
    return createPath(segArr)
}

let rem = 0;
export function drawTiling(tiling) {
    console.log('tiling ' + tiling)
    let pathDict = tiling.pathDict
    let tilingCtx = document.getElementById('tiling-canvas').getContext('2d');
    let offCtx = document.getElementById('off-canvas').getContext('2d');
    tilingCtx.fillStyle = offCtx.fillStyle = "transparent";

    var invisCtx = document.getElementById('invis-canvas').getContext('2d');

    tilingCtx.lineWidth = offCtx.lineWidth = getTileWidth();
    invisCtx.lineWidth = tilingCtx.lineWidth / 2;

    tilingCtx.lineJoin = tilingCtx.lineCap = invisCtx.lineJoin = invisCtx.lineCap = offCtx.lineJoin = offCtx.lineCap = "round";
    tilingCtx.strokeStyle = invisCtx.strokeStyle = offCtx.strokeStyle = '#000';

    // // Define the gradient
    let [xMin, xMax, yMin, yMax] = tiling.bounds; //getBoundsTiling2(tiling)
    const gradient = offCtx.createLinearGradient(0, rem, 0, (yMax-yMin) + 150 + 75);
    rem = yMax + yMax - yMin
    // Add color stops to the gradient
    // gradient.addColorStop(0, '#EBECF0');
    // gradient.addColorStop(0.2, '#000');
    // gradient.addColorStop(0.6, '#000');
    // gradient.addColorStop(.8, '#fff');
    // gradient.addColorStop(.81, '#000');
    // gradient.addColorStop(0, '#EBECF0');
    // gradient.addColorStop(.99, '#000');
    // gradient.addColorStop(1, 'pink');


    // Set the stroke style to the gradient
    // tilingCtx.strokeStyle = invisCtx.strokeStyle = offCtx.strokeStyle  = gradient;

    for (let p in pathDict) {
        offCtx.fill(pathDict[p].path)
        offCtx.stroke(pathDict[p].path)
        offCtx.closePath()
        invisCtx.fillStyle = p
        invisCtx.fill(pathDict[p].path)
        invisCtx.stroke(pathDict[p].path)
        invisCtx.closePath()
    }
}


export function makeRandomTiling(t) { //add tiling here option
    if(t){
        return makeRandomTilingHelper(t)
    }
    let segArr = makeRandomTilingHelper(t ? t: '')
    while (segArr.length === 0) {
        segArr = makeRandomTilingHelper()
    }
    return segArr;
}

export function makeRandomTilingHelper(t) {
    let tiling;
    // Construct a tiling
    if (t){
        scale = getScaler(t.t)
        return getSegArr(t.t, t.e)
    }
    tilingIndex = generateRandomNum()
    const tp = tilingTypes[tilingIndex];
     tiling = new IsohedralTiling(tp);

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
    let y = seg[0].y
    let rightEdge = (window.innerWidth - getYPadding())
    let leftEdge = getYPadding()
    if (x0 > leftEdge && x0 < rightEdge && x1 > leftEdge && x1 < rightEdge) {
        return false; // tile is inside x bounds of the screen
    }
    return true;
}


export function makeTilingHelper(tiling, edges) {
    scale = getScaler(tiling)
    return getSegArr(tiling, edges)

}
