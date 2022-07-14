'use strict'
import {mul, EdgeShape, tilingTypes, IsohedralTiling}
    from './lib/tactile.js';

function getRandomColor() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')';
};

function generateRandomNum() {
    var num = Math.floor(81 * Math.random());
    return (num === 27 ? generateRandomNum() : num);
}

class Tiling {

    drawRandomTiling() {
        {
            var canvas = document.getElementById('tiling-canvas');
            var ctx = canvas.getContext('2d');
            const {tiling, edges} = this.makeRandomTiling();

            // Make some random colours.
            // let cols = [];
            // for (let i = 0; i < 3; ++i) {
            //     cols.push('rgb(' +
            //         Math.floor(Math.random() * 255.0) + ',' +
            //         Math.floor(Math.random() * 255.0) + ',' +
            //         Math.floor(Math.random() * 255.0) + ')');
            // }
            //
            ctx.lineWidth = 8.0;
            ctx.strokeStyle = '#000';

            const B = Math.abs(tiling.getT1().x*tiling.getT2.y - tiling.getT2().x*tiling.getT1.y)/tiling.numAspects()

            // Define a world-to-screen transformation matrix that scales by 50x.
            const ST = [Math.sqrt(80.0/B), 0.0, 0.0,
                0.0, Math.sqrt(90.0/B), 0.0];

            for (let i of tiling.fillRegionBounds(-2, -2, 8, 8)) {
                const T = mul(ST, i.T);
                // ctx.fillStyle = cols[ tiling.getColour( i.t1, i.t2, i.aspect ) ];
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
                let start = true;
                ctx.beginPath();
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
                        ctx.moveTo(seg[0].x, seg[0].y);
                    }

                    if (seg.length == 2) {
                        ctx.lineTo(seg[1].x, seg[1].y);
                    } else {
                        ctx.bezierCurveTo(
                            seg[1].x, seg[1].y,
                            seg[2].x, seg[2].y,
                            seg[3].x, seg[3].y);
                    }
                }

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
    }

    drawTiling(offsetX, offsetY, tiling, edges, transition) {
        var tilingCanvas = document.getElementById('tiling-canvas');
        var tilingCtx = tilingCanvas.getContext('2d');

        var invisCan = document.getElementById('invis-canvas');
        var ctx = invisCan.getContext('2d');

        // const {tiling, edges} = this.makeTiling();
        tilingCtx.fillStyle = "rgba(255, 255, 255, 0.1)";

        // Make some random colours.
        let cols = ['red', 'blue', 'green', 'purple', 'pink', 'yellow', 'orange', 'grey', 'turquoise', 'maroon', 'lime', 'olive', 'teal', 'navy'];
        // for (let i = 0; i < 30; ++i) {
        //     cols.push('rgb(' +
        //         Math.floor(Math.random() * 255.0) + ',' +
        //         Math.floor(Math.random() * 255.0) + ',' +
        //         Math.floor(Math.random() * 255.0) + ')');
        // }

        let t1 = tiling.getT1()
        let t2 = tiling.getT2()

        const B = Math.abs((t1.x * t2.y) - (t2.x * t1.y)) / (tiling.numAspects())
        const A = 0.5
        const scaler = Math.sqrt(A/B)

        // console.log(`B is ${B} and num aspects is ${tiling.numAspects()}  and scale is ${scaler}`)
        // tilingCtx.scale(scaler, scaler)

        tilingCtx.lineWidth = 40;
        tilingCtx.lineJoin = "round";
        tilingCtx.strokeStyle = '#000';

        ctx.lineWidth = 40.0;
        ctx.lineJoin = "round";
        ctx.strokeStyle = '#000';

        // Define a world-to-screen transformation matrix that scales by 50x.
        const ST = [200, 0.0, 0.0,
            0.0, 200, 0.0];

        let transition1y = 1;
        let transition2y = 1;
        let transition1x = 1;
        let transition2x = 1;

        let colorIndex = 0;

        // tilingCtx.scale(scaler, scaler)

        for (let i of tiling.fillRegionBounds(0,0,3,8)) {
            // for (let i of tiling.fillRegionBounds(0,0,0,0)) {
            const T = mul(ST, i.T);
            // ctx.fillStyle = 'rgb(' +
            //     Math.floor(Math.random() * 255.0) + ',' +
            //     Math.floor(Math.random() * 255.0) + ',' +
            //     Math.floor(Math.random() * 255.0) + ')';
            ctx.fillStyle = cols[colorIndex % cols.length];
            colorIndex++;
            // ctx.fillStyle = "rgba(255, 255, 255, 0)"
            // tilingCtx.fillStyle = 'red'
            let start = true;
            tilingCtx.beginPath();
            ctx.beginPath();

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
                    tilingCtx.moveTo(seg[0].x - offsetX, seg[0].y - offsetY);
                    ctx.moveTo(seg[0].x - offsetX, seg[0].y - offsetY);
                }

                if (seg.length == 2) {
                    let transitionX = 0;
                    let midpointX = (seg[0].x + seg[1].x) / 2;
                    let midpointY = (seg[0].y + seg[1].y) / 2;
                    if (seg[0].x === seg[1].x) {
                        // transitionX = 0.5 * midpointY
                        // transition = 1
                    }

                    tilingCtx.lineTo(midpointX - transitionX - offsetX, midpointY * transition - offsetY);
                    tilingCtx.lineTo(seg[1].x - offsetX, seg[1].y - offsetY);

                    ctx.lineTo(midpointX - transitionX - offsetX, midpointY * transition - offsetY);
                    ctx.lineTo(seg[1].x - offsetX, seg[1].y - offsetY);

                    // var canv = document.getElementById('canvas');
                    // var ctx = canv.getContext('2d');
                    // ctx.fillStyle = "pink"
                    // ctx.fillRect(seg[1].x - offsetX, seg[1].y - offsetY, 30, 30)
                    // ctx.stroke()
                    // ctx.fillStyle = "black"
                    // ctx.fillText(seg[0].x + " " + seg[1].x,seg[1].x + 10- offsetX, seg[1].y - offsetY - 10)
                    // ctx.fillStyle = "rgba(255, 255, 255, 0)"

                } else {
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

                    // if (seg[1].y < midpointY && seg[2].y < midpointY) {
                    //     transition1y =  1.03; transition2y = 1.03;
                    // }
                    // console.log('SEG 1 ' + seg[1].y)
                    // console.log('SEG 2 ' + seg[2].y)

                    tilingCtx.bezierCurveTo(
                        seg[1].x - transition1x - offsetX, seg[1].y * transition1y - offsetY,
                        seg[2].x - transition2x - offsetX, seg[2].y * transition2y - offsetY,
                        seg[3].x - offsetX, seg[3].y - offsetY);
                    // tilingCtx.stroke();

                    ctx.bezierCurveTo(
                        seg[1].x - transition1x - offsetX, seg[1].y * transition1y - offsetY,
                        seg[2].x - transition2x - offsetX, seg[2].y * transition2y - offsetY,
                        seg[3].x - offsetX, seg[3].y - offsetY);
                    // ctx.fillStyle = "blue"
                    // ctx.fillRect(seg[1].x - offsetX, seg[1].y - offsetY, 10, 10)
                    //
                    // ctx.fillStyle = "red"
                    // ctx.fillRect(seg[2].x - oit ends with usffsetX, seg[2].y - offsetY, 10, 10)
                    //
                    // ctx.fillStyle = "purple"
                    // ctx.fillRect(midpointX - offsetX, midpointY - offsetY, 10, 10)
                    //
                    // ctx.fillStyle = "green"
                    // ctx.fillRect(seg[1].x - offsetX, seg[1].y * transition1y - offsetY, 10, 10)
                    //
                    // ctx.fillStyle = "pink"
                    // ctx.fillRect(seg[2].x - offsetX, seg[2].y * transition2y - offsetY, 10, 10)
                    //
                    // ctx.fillStyle = "rgba(255, 255, 255, 0)"
                    // ctx.stroke();
                }
            }
            tilingCtx.closePath();
            tilingCtx.fill();
            tilingCtx.stroke();

            ctx.closePath();
            ctx.fill();
            ctx.stroke();

        }
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

const tiling = new Tiling();
export default tiling;