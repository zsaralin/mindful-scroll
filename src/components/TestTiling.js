import {mul, EdgeShape, tilingTypes, IsohedralTiling}
    from '../lib';
import {sumArray} from "./TilingArr";

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

class TestTiling {

    getSegArr(tiling, edges) {
        let segArr = [];
        const scaler = getScaler(tiling)
        const ST = [1 * scaler * (window.innerHeight / 4), 0.0, 0.0, 0.0, (1 * scaler) * (window.innerWidth / 4), 0.0];

        for (let i of tiling.fillRegionBounds(-2 / scaler, 0, 3 / scaler, 6 / scaler)) {
            const T = mul(ST, i.T);

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
                segArr.push(seg)
            }
        }
        return segArr;
    }

    getYBounds(tiling, edges, offsetY) {
        const scaler = getScaler(tiling)

        let yMin = null;
        let yMax = null;
        const ST = [1 * scaler * (window.innerHeight / 4), 0.0, 0.0, 0.0, (1 * scaler) * (window.innerWidth / 4), 0.0];

        for (let seg of this.getSegArr(tiling, edges)) {
            // const T = mul(ST, i.T);
            //
            // for (let si of tiling.shape()) {
            //     const S = mul(T, si.T);
            //     let seg = [mul(S, {x: 0.0, y: 0.0})];
            //
            //     if (si.shape != EdgeShape.I) {
            //         const ej = edges[si.id];
            //         seg.push(mul(S, ej[0]));
            //         seg.push(mul(S, ej[1]));
            //     }
            //
            //     seg.push(mul(S, {x: 1.0, y: 0.0}));
            //
            //     if (si.rev) {
            //         seg = seg.reverse();
            //     }

                if (seg.length == 2) {
                    yMin = this.setYMin(yMin, seg[0].y+ offsetY, seg[1].y + offsetY)
                    yMax = this.setYMax(yMax, seg[0].y+ offsetY, seg[1].y + offsetY)
                } else {
                    yMin = this.setYMin(yMin, seg[0].y+ offsetY, seg[3].y+ offsetY)
                    yMax = this.setYMax(yMax, seg[0].y+ offsetY, seg[3].y+ offsetY)
                // }
            }
        }
        return [yMin, yMax]
    }

    drawTiling(offsetY, tiling, edges, transition) {
        const scaler = getScaler(tiling)

        let numTile = 0

        let pathDict = {}

        // console.log(`B is ${B} and num aspects is ${tiling.numAspects()}  and scale is ${scaler}`)
        // Define a world-to-screen transformation matrix that scales by 50x.
        const ST = [1 * scaler * (window.innerHeight / 4), 0.0, 0.0, 0.0, (1 * scaler) * (window.innerWidth / 4), 0.0];
        //*Math.sqrt(1500/(yMax-yMin))
        let transition1y = 1;
        let transition2y = 1;
        let transition1x = 1;
        let transition2x = 1;

        let colorIndex = 0

        // offsetY -= this.getYBounds(tiling, edges)[0]
        for (let i of tiling.fillRegionBounds(-2 / scaler, 0, 3 / scaler, 6 / scaler)) {
            numTile++
            let path = new Path2D()
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
                    path.moveTo(seg[0].x, seg[0].y + offsetY)
                }

                if (seg.length == 2) {
                    let transitionX = 0;
                    if (si.shape === EdgeShape.I) {
                        transition = 1
                    }
                    let midpointX = (seg[0].x + seg[1].x) / 2;
                    let midpointY = (seg[0].y + seg[1].y) / 2;


                    path.lineTo(midpointX - transitionX, midpointY * transition + offsetY);
                    path.lineTo(seg[1].x, seg[1].y + offsetY);

                } else {
                    // yMin = this.setYMin(yMin, seg[2].y, seg[1].y)
                    // yMax = this.setYMax(yMax, seg[2].y, seg[1].y)

                    let midpointY = (seg[0].y + seg[3].y) / 2;
                    let midpointX = (seg[0].x + seg[3].x) / 2;

                    if (seg[1].y < midpointY) {
                        transition1y = 1.02
                    } else {
                        transition1y = .97
                    }
                    if (seg[2].y < midpointY) {
                        transition2y = 1.02
                    } else {
                        transition2y = .97
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
                        seg[1].x - transition1x, seg[1].y * transition1y + offsetY,
                        seg[2].x - transition2x, seg[2].y * transition2y + offsetY,
                        seg[3].x, seg[3].y + offsetY);
                }

            }
            let cols = fillColourArray(numTile)
            pathDict[cols[colorIndex]] = path;
            colorIndex++;
        }

        return pathDict
    }

    fillTiling(pathDict, triangles, vertices) {
        var tilingCanvas = document.getElementById('tiling-canvas');
        var tilingCtx = tilingCanvas.getContext('2d');
        tilingCtx.fillStyle = "rgba(255, 255, 255, 0)"; //white transparent canvas
        var invisCan = document.getElementById('invis-canvas');
        var ctx = invisCan.getContext('2d');

        tilingCtx.lineWidth = 50;
        tilingCtx.lineJoin = "round";
        tilingCtx.lineCap = "round"
        tilingCtx.strokeStyle = '#000';
        ctx.lineWidth = 50;

        ctx.lineJoin = "round";
        ctx.strokeStyle = '#000';

        for (let p in pathDict) {
            tilingCtx.fill(pathDict[p])
            tilingCtx.stroke(pathDict[p])
            ctx.fillStyle = p

            ctx.fill(pathDict[p])
            ctx.stroke(pathDict[p])
        }
        tilingCtx.strokeStyle = 'red'
        tilingCtx.fillStyle = 'blue'
        if (triangles !== undefined) {
            for (let i = 0; i < triangles.length; i += 3) {
                var p0 = triangles[i];
                var p1 = triangles[i + 1];
                var p2 = triangles[i + 2];
                tilingCtx.moveTo(vertices[p0][0], vertices[p0][1]);
                if (Math.abs(vertices[p1][1] - vertices[p0][1]) > 22) {
                    tilingCtx.lineTo(vertices[p1][0], vertices[p1][1]);
                }
                if (Math.abs(vertices[p1][1] - vertices[p2][1]) > 22) {
                    tilingCtx.lineTo(vertices[p2][0], vertices[p2][1])
                }
                // tilingCtx.stroke();
            }
        }
        for (let i=0; i< vertices?.length; i++){
        tilingCtx.fillRect(vertices[i][0], vertices[i][1], 9, 9 )}

}

    setYMin(yMin, y0, y1) {
        if (yMin === null) return Math.min(y0, y1)
        return Math.min(Math.min(yMin, y0), y1)
    }

    setYMax(yMax, y0, y1) {
        if (yMax === null) return Math.max(y0, y1)
        return Math.max(Math.max(yMax, y0), y1)
    }

    findBottom(tiling, edges, yMin, yMax, sumArray) {
        const scaler = getScaler(tiling)

        let topVerts = []; // top and bottom vertices of tiling
        let bottomVerts = [];

        // console.log(`B is ${B} and num aspects is ${tiling.numAspects()}  and scale is ${scaler}`)
        // Define a world-to-screen transformation matrix that scales by 50x.
        const ST = [1 * scaler * (window.innerHeight / 4), 0.0, 0.0, 0.0, (1 * scaler) * (window.innerWidth / 4), 0.0];
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
                    if (seg[0].y < seg[1].y && seg[0].y <= yMin + (yMax - yMin) / 55 ) {
                        topVerts.push([seg[0].x, seg[0].y + sumArray - yMin])
                    } else if (seg[0].y > seg[1].y && seg[1].y <= yMin + (yMax - yMin) / 55) {
                        topVerts.push([seg[1].x, seg[1].y + sumArray- yMin])
                    }
                    if (seg[0].y > seg[1].y && seg[0].y >= yMax - (yMax - yMin) / 55) {
                        bottomVerts.push([seg[0].x, seg[0].y + sumArray- yMin])
                    } else if (seg[0].y < seg[1].y && seg[1].y >= yMax - (yMax - yMin) / 55) {
                        bottomVerts.push([seg[1].x, seg[1].y + sumArray- yMin])
                    }

                } else {
                    if (seg[0].y < seg[3].y && seg[0].y <= yMin + (yMax - yMin) / 55) {
                        topVerts.push([seg[0].x, seg[0].y + sumArray- yMin])

                    } else if (seg[0].y > seg[3].y && seg[3].y <= yMin + (yMax - yMin) / 55) {
                        topVerts.push([seg[3].x, seg[3].y + sumArray- yMin])
                    }
                    if (seg[0].y > seg[3].y && seg[0].y >= yMax - (yMax - yMin) / 55) {
                        bottomVerts.push([seg[0].x, seg[0].y + sumArray- yMin])

                    } else if (seg[0].y < seg[3].y && seg[3].y >= yMax - (yMax - yMin) / 55) {
                        bottomVerts.push([seg[3].x, seg[3].y + sumArray- yMin])
                    }

                }

            }
        }
        return [topVerts, bottomVerts]
    }

    makeRandomTiling() {
        // Construct a tiling
        let theTiling = generateRandomNum()
        const tp = tilingTypes[theTiling];
        // console.log( 'THE SPECIFIC TILING ' + theTiling)

        // const tp = tilingTypes[Math.floor(72)]; //64 is the squares, 27 is super large
        let tiling = new IsohedralTiling(tp);

        // Randomize the tiling vertex parameters
        let ps = tiling.getParameters();
        for (let i = 0; i < ps.length; ++i) {
            ps[i] += Math.random() * 0.1 - 0.05;
        }
        tiling.setParameters(ps);// Make some random edge shapes.  Note that here, we sidestep the
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

        return {tiling: tiling, edges: edges}
    }

    makeTiling() {
        // Construct a tiling
        const tp = tilingTypes[Math.floor(12)];
        let tiling = new IsohedralTiling(tp);

        // Randomize the tiling vertex parameters
        let ps = tiling.getParameters();
        for (let i = 0; i < ps.length; ++i) {
            ps[i] += 1 * 0.1 - 0.05;
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
            if (shp == EdgeShape.I) {
                // Pass
            } else if (shp == EdgeShape.J) {
                ej.push({x: 1 * 0.6, y: 1 - 0.5});
                ej.push({x: 1 * 0.6 + 0.4, y: 1 - 0.5});
            } else if (shp == EdgeShape.S) {
                ej.push({x: 1 * 0.6, y: 1 - 0.5});
                ej.push({x: 1.0 - ej[0].x, y: -ej[0].y});
            } else if (shp == EdgeShape.U) {
                ej.push({x: 1 * 0.6, y: 1 - 0.5});
                ej.push({x: 1.0 - ej[0].x, y: ej[0].y});
            }

            edges.push(ej);
        }

        return {tiling: tiling, edges: edges}
    }
}

const tiling = new TestTiling();
export default tiling;