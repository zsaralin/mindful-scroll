import {getCurrColor} from "./Stroke";
import {getCurrentPathDict} from "./TilingArr";

let activeTileArr = []; // semi coloured tiles (gradient)
let fillTileArr = [] // fully coloured tiles

export function fillTile(x, y, invisCol, r2) {
    var tilingCanvas = document.getElementById('tiling-canvas');
    var tilingCtx = tilingCanvas.getContext('2d');

    let currColor = getCurrColor();
    let currTiling = getCurrentPathDict(y)
    let currTile = currTiling['rgb(' + invisCol.slice(0, -4) + ')']
    let fillCol = setInterval(function () {
        r2++
        let grd = tilingCtx.createRadialGradient(x, y, 25, x, y, r2);
        grd.addColorStop(0, currColor);
        grd.addColorStop(.5, "white");
        tilingCtx.fillStyle = grd
        tilingCtx.fill(currTile)
        tilingCtx.stroke(currTile)

        activeTileArr[activeTileArr.length] = ({path: currTile, color: currColor, r2: r2, x: x, y: y})
        if (r2 > 1000) {
            clearInterval(fillCol)
            activeTileArr.shift()
            fillTileArr.push(
                {
                    path: currTile,
                    color: currColor
                }
            )
        }
    }, 10)
}

export function redrawTiles(){
    var tilingCanvas = document.getElementById('tiling-canvas');
    var tilingCtx = tilingCanvas.getContext('2d');

    for (let i = 0; i < fillTileArr.length; i++) {
        let object = fillTileArr[i]
        tilingCtx.fillStyle = object.color
        tilingCtx.fill(new Path2D(object.path))
        tilingCtx.stroke(new Path2D(object.path))
        tilingCtx.closePath()
    }
    for (let i = 0; i < activeTileArr.length; i++) {
        let activeTile = activeTileArr[i]
        var grd = tilingCtx.createRadialGradient(activeTile.x, activeTile.y, 25, activeTile.x, activeTile.y, activeTile.r2);
        grd.addColorStop(0, activeTile.color);
        grd.addColorStop(.5, "white");
        tilingCtx.fillStyle = grd
        tilingCtx.fill((activeTile.path))
        tilingCtx.stroke((activeTile.path))
    }
}