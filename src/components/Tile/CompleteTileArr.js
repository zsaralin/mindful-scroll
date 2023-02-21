import {fillFirstColour} from "./CompleteTile";
import {getOffsetY} from "../Scroll/PageScroll";
import {getActiveTileArr} from "../Effects/Watercolor";
let fillTileArr = [] // fully coloured tiles

export function redrawCompleteTiles(offsetY) {
    let ctx = document.getElementById('canvas').getContext('2d');

    // stopWatercolor();
    ctx.save();
    // ctx.translate(0, -offsetY);
    fillTileArr.forEach(tile => {
        ctx.translate(0, -offsetY);

        ctx.fillStyle = tile.color
        // tile.transform = `translate(0,+${900}px)`;
        // fillFirstColour(tile, offsetY)
        ctx.fill(tile.path)
        ctx.restore()

    })
    // getActiveTileArr().forEach(tile => {
    //     ctx.fillStyle = (tile.color)
    //     ctx.fill(tile.path);
    // })
    // ctx.restore()
    fillTileArr = []
}

export function pushCompleteTile(tile, color) {
    fillTileArr.push(
        {
            path: tile,
            color: color
        }
    )
}
