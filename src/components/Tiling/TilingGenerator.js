import {mul, EdgeShape, tilingTypes, IsohedralTiling}
    from '../../lib';
import {LINE_WIDTH} from "../Constants";
import {getCurrColor} from "../Stroke/StrokeColor";
import {getTile} from "./TilingArr";
import {getLineWidth} from "../Stroke/StrokeWidth";
import {getTileWidth} from "./TileWidth";

function generateRandomNum() {
    var num = Math.floor(81 * Math.random());
    return (num === 27 ? generateRandomNum() : num);
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
    return segArr
}

export function drawTiling(pathDict) {
    let tilingCanvas = document.getElementById('tiling-canvas');
    let tilingCtx = tilingCanvas.getContext('2d');
    tilingCtx.fillStyle = "rgba(255, 255, 255, 0)"; //white transparent canvas

    var invisCan = document.getElementById('invis-canvas');
    var ctx = invisCan.getContext('2d');

    tilingCtx.lineWidth = getTileWidth();
    ctx.lineWidth = tilingCtx.lineWidth/2
        tilingCtx.lineJoin = tilingCtx.lineCap = ctx.lineJoin = ctx.lineCap = "round";
    tilingCtx.strokeStyle = ctx.strokeStyle = '#000';

    for (let p in pathDict) {
        tilingCtx.fill(pathDict[p].path)
        tilingCtx.stroke(pathDict[p].path)
        tilingCtx.closePath()
        ctx.fillStyle = p
        ctx.fill(pathDict[p].path)
        ctx.stroke(pathDict[p].path)
        ctx.closePath()
    }
}


export function makeRandomTiling() {
    let segArr = makeRandomTilingHelper()
    while (segArr.length === 0) {
        segArr = makeRandomTilingHelper()
    }
    return segArr;
}

export function makeRandomTilingHelper() {
    // Construct a tiling
    tilingIndex = generateRandomNum()
    const tp = tilingTypes[tilingIndex];
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


