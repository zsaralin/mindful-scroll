import {LINE_WIDTH} from "../Constants";
import {redrawTilings} from "../Tiling/TilingArr";
import {redrawCanvas} from "../PageScroll";
let strokeWidth = LINE_WIDTH

export function setLineWidth() {
    if (strokeWidth < 80) strokeWidth += 0.1;
}

export function resetLineWidth() {
    strokeWidth = LINE_WIDTH;
}
export function reduceLineWidth() {
    strokeWidth = strokeWidth >= 30 ? strokeWidth - 10 : strokeWidth;
}

export function getLineWidth(){
    return strokeWidth;
}

export const changeLineWidth = (event: Event, newValue: number) => {
    strokeWidth = newValue
    redrawCanvas();
};