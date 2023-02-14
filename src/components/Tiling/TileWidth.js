import {TILE_WIDTH} from "../Constants";
import {redrawCanvas, refreshPage} from "../Scroll/PageScroll";
import {changeLineWidth} from "../Stroke/StrokeWidth";
import {redrawTilings} from "./Tiling2";

let tileWidth = TILE_WIDTH

export function getTileWidth(){
    return tileWidth
}

export const changeTileWidth = (event: Event, newValue: number) => {
    tileWidth = newValue
    // redrawCanvas();
refreshPage()};