import {getOffsetY} from "./components/PageScroll";
import {getCurrentPathDict, getShapeDimensions, getTilingIndex} from "./components/TilingArr";

export function shapeGlow(y) {
    let tilingCtx = document.getElementById('tiling-canvas').getContext("2d");
    let context = document.getElementById('canvas').getContext("2d");

    let offset = getOffsetY()
    let tilingIndex = getTilingIndex(y + offset)
    let currTiling = getCurrentPathDict(tilingIndex);
    let topShape = getShapeDimensions(tilingIndex)

    let currTile = currTiling['rgb(0,255,0)']

    tilingCtx.strokeStyle = 'yellow'
    let col = context.getImageData(window.innerWidth / 2 - 75 + 25, topShape - offset + 125 + 25, 100, 100)
    if (col.data.filter(v => v === 0).length / col.data.length === 0) {
        tilingCtx.stroke(currTile)
    }
}