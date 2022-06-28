'use strict'
import {mul, EdgeShape, tilingTypes, IsohedralTiling}
    from './lib/tactile.js';

class Tiling{
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
            // Define a world-to-screen transformation matrix that scales by 50x.
            const ST = [50.0, 0.0, 0.0,
                0.0, 70.0, 0.0];

            for (let i of tiling.fillRegionBounds(-2, -2, 12, 12)) {
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

    makeRandomTiling() {
        // Construct a tiling
        const tp = tilingTypes[Math.floor(81 * Math.random())];
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
const tiling = new Tiling();
export default tiling;