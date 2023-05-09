import {completeTile, fillFirstColour, recompleteTile} from "./CompleteTile";
import {getOffsetY} from "../Scroll/PageScroll";
import {getActiveTileArr} from "../Effects/Watercolor";
import {getTile} from "../Tiling/Tiling2";
import {getBoundsTile} from "../Tiling/TilingBounds";
import {strokeArr} from "../Stroke/StrokeType/StrokeArr";
import {getTotalPixels} from "./FillTile/FillRatio";

let fillTileArr = {} // fully coloured tiles

export function redrawCompleteTiles(offsetY) {
    for (let tileId in fillTileArr) {
        redrawCompleteTile(tileId, offsetY)
    }
}

export function redrawCompleteTile(tileId, offsetY) {
    let ctx = document.getElementById('top-canvas').getContext('2d');
    let currTile;
    const tile = fillTileArr[tileId]
    if (tile) {
        if (!offsetY) offsetY = 0;
        else {
            currTile = findTile(tileId, offsetY)
        }
        // ctx.save();
        // ctx.translate(0, -offsetY);
        // recompleteTile(tile.tile)
        // ctx.fillStyle = tile.color
        // ctx.fill(tile.tile.path)
        // ctx.restore()
        if (offsetY !== 0 && currTile) {
            currTile.firstCol = tile.tile.firstCol
            currTile.fillType = tile.tile.fillType
            currTile.colors = tile.tile.colors
            currTile.allColors = tile.tile.allColors
            currTile.fillColors = tile.tile.fillColors
            getTotalPixels(currTile) // set inPath
            pushCompleteTile(currTile, tile.color)
            recompleteTile(currTile)

            delete fillTileArr[tileId]
        }

        // fillTileArr = {}
    }
}

export function pushCompleteTile(tile, color) {
    const complete = {
        tile: tile,
        color: color,
    }
    let id = tile.id
    // delete strokeArr[id]
    fillTileArr[id] = complete;
    tile.filled=true;
}

function findTile(id, offsetY) {
    const tile = fillTileArr[id]
    if (tile) {
        const bb = tile.tile.bounds // tileXMin, tileXMax, tileYMin, tileYMax
        const midX = bb[0] + (bb[1] - bb[0]) / 2
        const midY = bb[2] + (bb[3] - bb[2]) / 2

        let currTile;
        const ctx = document.getElementById('invis-canvas').getContext("2d");
        const invisCol = ctx.getImageData(midX, midY - offsetY, 1, 1).data.toString()
        console.log(midX + 'and y ' + (midY ))

        currTile = getTile(midY - offsetY, invisCol)
        if (currTile) return currTile
    }
    console.log('UH OH   ')
}