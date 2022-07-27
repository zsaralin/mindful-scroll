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

    getYBounds(tiling, edges) {
        const scaler = getScaler(tiling)

        let yMin = null;
        let yMax = null;
        const ST = [50 * scaler, 0.0, 0.0, 0.0, 50 * scaler, 0.0];

        for (let i of tiling.fillRegionBounds(0, 0, 7 / scaler, 15 / scaler)) {
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

                if (seg.length == 2) {
                    yMin = this.setYMin(yMin, seg[0].y, seg[1].y)
                    yMax = this.setYMax(yMax, seg[0].y, seg[1].y)
                } else {
                    yMin = this.setYMin(yMin, seg[0].y, seg[3].y)
                    yMax = this.setYMax(yMax, seg[0].y, seg[3].y)
                }
            }
        }
        console.log(`YMIN AND MAX: ${yMax - yMin}`)
        return [yMin, yMax]
    }

    drawTiling(offsetX, offsetY, tiling, edges, transition) {
        const scaler = getScaler(tiling)
        let yBounds = this.getYBounds(tiling, edges)
        let yMin = yBounds[0]
        let yMax = yBounds[1]

        let currYMin = null;
        let currYMax = null;
        let numTile = 0
        for (let tile of tiling.fillRegionBounds(0, 0, 7 / scaler, 15 / scaler)) {
            numTile++;
        }

        let cols = fillColourArray(numTile)
        var pathDict = {}
        // console.log(`B is ${B} and num aspects is ${tiling.numAspects()}  and scale is ${scaler}`)
        offsetY += yMin;
        console.log('importaint ' + (50 * scaler) * Math.sqrt(50 / (yMax - yMin)))
        // Define a world-to-screen transformation matrix that scales by 50x.
        const ST = [(50 * scaler) * Math.sqrt((yMax - yMin) / 1500), 0.0, 0.0, 0.0, (50 * scaler) * Math.sqrt((yMax - yMin) / 1500), 0.0];

        let transition1y = 1;
        let transition2y = 1;
        let transition1x = 1;
        let transition2x = 1;

        let colorIndex = 0

        // let yMin = null;
        // let yMax = null;

        for (let i of tiling.fillRegionBounds(0, 0, 7 / scaler, 15 / scaler)) {
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
                    path.moveTo(seg[0].x - offsetX, seg[0].y - offsetY)
                }

                if (seg.length == 2) {
                    let transitionX = 0;
                    let midpointX = (seg[0].x + seg[1].x) / 2;
                    let midpointY = (seg[0].y + seg[1].y) / 2;
                    currYMin = this.setYMin(yMin, seg[0].y, seg[1].y)
                    currYMax = this.setYMax(yMax, seg[0].y, seg[1].y)

                    path.lineTo(midpointX - transitionX - offsetX, midpointY * transition - offsetY);
                    path.lineTo(seg[1].x - offsetX, seg[1].y - offsetY);

                } else {
                    currYMin = this.setYMin(yMin, seg[0].y, seg[3].y)
                    currYMax = this.setYMax(yMax, seg[0].y, seg[3].y)

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
                        seg[1].x - transition1x - offsetX, seg[1].y * transition1y - offsetY,
                        seg[2].x - transition2x - offsetX, seg[2].y * transition2y - offsetY,
                        seg[3].x - offsetX, seg[3].y - offsetY);
                }

            }
            pathDict[cols[colorIndex]] = path;
            colorIndex++;
        }
        console.log(currYMax - currYMin)

        this.fillTiling(pathDict, yMin, yMax)
        // console.log(`yMin : ${yMin - offsetY}`)
        // console.log(`yMax : ${yMax - offsetY}`)
        // console.log('yMin: ' + {$yMin+offsetX} + ' yMax: ' + {yMax + offsetY})
        return [yMin, yMax, pathDict]
    }

    fillTiling(pathDict, yMin, yMax) {
        var tilingCanvas = document.getElementById('tiling-canvas');
        var tilingCtx = tilingCanvas.getContext('2d');
        // tilingCtx.translate(0, -(yMin))

        // tilingCtx.scale(2000 / (yMax - yMin), 2000 / (yMax - yMin))
        tilingCtx.fillStyle = "rgba(255, 255, 255, 0)"; //white transparent canvas

        var invisCan = document.getElementById('invis-canvas');
        var ctx = invisCan.getContext('2d');
        // ctx.translate(0, -(yMin))
        // ctx.scale(2000 / (yMax - yMin), 2000 / (yMax - yMin))

        tilingCtx.lineWidth = 50;
        tilingCtx.lineJoin = "round";
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
        // tilingCtx.setTransform(1, 0, 0, 1, 0, 0);
        // ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    setYMin(yMin, y0, y1) {
        if (yMin === null || (y0 < yMin && y0 < y1)) {
            return y0
        }
        if (yMin === null || (y1 < yMin && y1 < y0)) {
            return y1
        }
        return yMin
    }

    setYMax(yMax, y0, y1) {
        if (yMax === null || (y0 > yMax && y0 > y1)) {

            return y0
        }
        if (yMax === null || (y1 > yMax && y1 > y0)) {

            return y1
        }
        return yMax
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
}

const tiling = new TestTiling();
export default tiling;