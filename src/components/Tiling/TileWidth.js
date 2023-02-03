import {TILE_WIDTH} from "../Constants";
import {redrawCanvas} from "../PageScroll";
import {changeLineWidth} from "../Stroke/StrokeWidth";

let tileWidth = TILE_WIDTH

export function getTileWidth(){
    return tileWidth
}

export const changeTileWidth = (event: Event, newValue: number) => {
    tileWidth = newValue
    redrawCanvas();
};