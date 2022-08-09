import {mul, EdgeShape, tilingTypes, IsohedralTiling}
    from '../lib';

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

let scale;
let ST;
let currTiling;
let currEdges;
let segArr;
let tilingIndex;

let transition1x = 1;
let transition1y = 1;
let transition2x = 1;
let transition2y = 1;

let transition;
let list;

let xMin; let xMax;
let yMin; let yMax;

let numTile ;

function setSegArr() {
    segArr = []
    numTile = 0;
    for (let i of currTiling.fillRegionBounds(list[0], list[1], list[2], list[3])) {
        const T = mul(ST, i.T);
        let outOfBounds = false;
        let pathSeg = [] //contains segments of a path
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
            if (seg.length == 2) {
                if (seg[0].x >= (window.innerWidth - 50) || seg[0].x <= 50
                    || seg[1].x >= (window.innerWidth - 50) || seg[1].x <= 50) {
                    outOfBounds = true;
                }}
            else {
                if (seg[0].x >= (window.innerWidth - 50) || seg[0].x <= 50 || seg[3].x >= (window.innerWidth - 50) || seg[3].x <= 50) {
                    outOfBounds = true;
                }
            }
            pathSeg.push(seg)
        }
        if (outOfBounds === false){
            segArr.push(...pathSeg)
            numTile++;
        }
    }
}

function getRandomTransition() {
    return [0.98, 1.02][Math.floor(Math.random() * 2)]
}

export function getYBounds(offsetY) {
    yMin = null;
    yMax = null;

    for (let i = 0; i < segArr.length; i++) {
        let seg = segArr[i]
        if (seg.length === 2) {
            yMin = setYMin(yMin, seg[0].y + offsetY, seg[1].y + offsetY)
            yMax = setYMax(yMax, seg[0].y + offsetY, seg[1].y + offsetY)
        } else {
            yMin = setYMin(yMin, seg[0].y + offsetY, seg[3].y + offsetY)
            yMax = setYMax(yMax, seg[0].y + offsetY, seg[3].y + offsetY)
        }
    }
    return [yMin, yMax]
}

export function getXBounds() {
    let xMin = null;
    let xMax = null;

    for (let i = 0; i < segArr.length; i++) {
        let seg = segArr[i]
        if (seg.length === 2) {
            xMin = setYMin(xMin, seg[0].x, seg[1].x)
            xMax = setYMax(xMax, seg[0].x, seg[1].x)
        } else {
            xMin = setYMin(xMin, seg[0].x, seg[3].x)
            xMax = setYMax(xMax, seg[0].x, seg[3].x)
        }
    }
    return [xMin, xMax]
}

export function drawTiling(offsetX, offsetY) {
    let pathDict = {}
    let colorIndex = 0
    let cols = fillColourArray(numTile + 1)
    for (let i of currTiling.fillRegionBounds(list[0], list[1], list[2], list[3])) {
        let path = new Path2D()
        let start = true;
        let outOfBounds = false;
        const T = mul(ST, i.T);
        for (let si of currTiling.shape()) {
            const S = mul(T, si.T);
            let seg = [mul(S, {x: 0.0, y: 0.0})];

            if (si.shape != EdgeShape.I) {
                const ej = currEdges[si.id];
                seg.push(mul(S, ej[0]));
                seg.push(mul(S, ej[1]));
            }

            seg.push(mul(S, {x: 1.0, y: 0.0}));

            if (si.rev) {
                seg = seg.reverse();
            }

            if (start) {
                start = false;
                path.moveTo(seg[0].x + offsetX, seg[0].y + offsetY)
            }
            if (seg.length == 2) {
                if (seg[0].x < (window.innerWidth - 50) && seg[0].x > 50
                    && seg[1].x < (window.innerWidth - 50) && seg[1].x > 50) {
                    let midpointX = (seg[0].x + seg[1].x) / 2;
                    let midpointY = (seg[0].y + seg[1].y) / 2;
                    path.lineTo(midpointX + offsetX, midpointY * transition + offsetY);
                    path.lineTo(seg[1].x + offsetX, seg[1].y + offsetY);
                } else {
                    outOfBounds = true
                }
            } else {
                if (seg[0].x < (window.innerWidth - 50) && seg[0].x > 50 && seg[3].x < (window.innerWidth - 50) && seg[3].x > 50) {
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
                } else {
                    outOfBounds = true
                }
            }
        }
        if (outOfBounds === false) {
            pathDict[cols[colorIndex]] = path;
            colorIndex++;
        }
    }
    // let shapePath = new Path2D()
    // shapePath.moveTo(window.innerWidth/2 - 50, yMax  + 300  )
    // shapePath.lineTo(window.innerWidth/2 - 50, yMax   + 400)
    // shapePath.lineTo(window.innerWidth/2 + 50, yMax   + 400)
    // shapePath.lineTo(window.innerWidth/2 + 50, yMax + 300)
    // shapePath.lineTo(window.innerWidth/2 - 50 , yMax  + 300)
    //
    // pathDict[cols[colorIndex]] = shapePath;
    return pathDict
}

export function fillTiling(pathDict) {
    var tilingCanvas = document.getElementById('tiling-canvas');
    var tilingCtx = tilingCanvas.getContext('2d');
    tilingCtx.fillStyle = "rgba(255, 255, 255, 0)"; //white transparent canvas
    var invisCan = document.getElementById('invis-canvas');
    var ctx = invisCan.getContext('2d');

    // tilingCtx.lineWidth = 15 + Math.sqrt(window.innerHeight * window.innerWidth) / 30
    tilingCtx.lineWidth = 40;
    tilingCtx.lineJoin = "round";
    tilingCtx.lineCap = "round"
    tilingCtx.strokeStyle = '#000';

    // ctx.lineWidth = 15 + Math.sqrt(window.innerHeight * window.innerWidth) / 30
    ctx.lineWidth = 40;
    ctx.lineJoin = "round";
    ctx.lineCap = "round"

    ctx.strokeStyle = '#000';

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

function findBottom(tiling, edges, yMin, yMax, sumArray) {
    const scaler = getScaler(tiling)

    let topVerts = []; // top and bottom vertices of tiling
    let bottomVerts = [];

    // console.log(`B is ${B} and num aspects is ${tiling.numAspects()}  and scale is ${scaler}`)
    // Define a world-to-screen transformation matrix that scales by 50x.
    // const ST = [1 * scaler * (window.innerHeight / 4), 0.0, 0.0, 0.0, (1 * scaler) * (window.innerWidth / 4), 0.0];
    const ST = [50,0,0,0,50,0]
    //*Math.sqrt(1500/(yMax-yMin))

    for (let i of tiling.fillRegionBounds(0, 0, 4 / scaler, 6 / scaler)) {
        const T = mul(ST, i.T);
        let start = true;
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

            if (start) {
                start = false;
            }

            if (seg.length == 2) {
                if (seg[0].y < seg[1].y && seg[0].y <= yMin + (yMax - yMin) / 55) {
                    topVerts.push([seg[0].x, seg[0].y + sumArray - yMin])
                } else if (seg[0].y > seg[1].y && seg[1].y <= yMin + (yMax - yMin) / 55) {
                    topVerts.push([seg[1].x, seg[1].y + sumArray - yMin])
                }
                if (seg[0].y > seg[1].y && seg[0].y >= yMax - (yMax - yMin) / 55) {
                    bottomVerts.push([seg[0].x, seg[0].y + sumArray - yMin])
                } else if (seg[0].y < seg[1].y && seg[1].y >= yMax - (yMax - yMin) / 55) {
                    bottomVerts.push([seg[1].x, seg[1].y + sumArray - yMin])
                }

            } else {
                if (seg[0].y < seg[3].y && seg[0].y <= yMin + (yMax - yMin) / 55) {
                    topVerts.push([seg[0].x, seg[0].y + sumArray - yMin])

                } else if (seg[0].y > seg[3].y && seg[3].y <= yMin + (yMax - yMin) / 55) {
                    topVerts.push([seg[3].x, seg[3].y + sumArray - yMin])
                }
                if (seg[0].y > seg[3].y && seg[0].y >= yMax - (yMax - yMin) / 55) {
                    bottomVerts.push([seg[0].x, seg[0].y + sumArray - yMin])

                } else if (seg[0].y < seg[3].y && seg[3].y >= yMax - (yMax - yMin) / 55) {
                    bottomVerts.push([seg[3].x, seg[3].y + sumArray - yMin])
                }

            }

        }
    }
    return [topVerts, bottomVerts]
}

export function makeRandomTiling() {
    // Construct a tiling
    tilingIndex = generateRandomNum()
    const tp = tilingTypes[tilingIndex]; //67
    // console.log( 'THE SPECIFIC TILING ' + theTiling)

    // const tp = tilingTypes[Math.floor(72)]; //64 is the squares, 27 is super large
    let tiling = new IsohedralTiling(tp);

    // Randomize the tiling vertex parameters
    let ps = tiling.getParameters();
    for (let i = 0; i < ps.length; ++i) {
        ps[i] += Math.random() * 0.1 - 0.05;
    }
    tiling.setParameters(ps);

    // Make some random edge shapes.  Note that here, we sidestep the
    // potential complexity of using .shape() vs. .parts() by checking
    // ahead of time what the intrinsic edge shape is and building
    // Bezier control points that have all necessary symmetries.

    let edges = [];
    for (let i = 0; i < tiling.numEdgeShapes(); ++i) {
        let ej = [];
        const shp = tiling.getEdgeShape(i);
        // console.log('EDGE SHAPE' + tiling.getEdgeShape(i))
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
    scale = getScaler(tiling)
    list = [0, 0, (window.innerWidth/50) / scale, 9 / scale]
    let area = 3000;
    ST = [50 + scale * Math.sqrt(area), 0.0, 0.0, 0.0, 50 + scale * Math.sqrt(area), 0.0];

    currTiling = tiling;
    currEdges = edges;
    transition = getRandomTransition()
    setSegArr()

    return {tiling: tiling, edges: edges}
}

