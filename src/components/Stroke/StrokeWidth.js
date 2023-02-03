import {LINE_WIDTH} from "../Constants";
import {redrawTilings} from "../Tiling/TilingArr";
import {redrawCanvas} from "../PageScroll";
let strokeWidth = LINE_WIDTH;
let tempWidth = LINE_WIDTH;

export function setLineWidth() {
    if (strokeWidth < 80) strokeWidth += 0.1;
}

export function resetLineWidth() {
    tempWidth = strokeWidth;
}

export function reduceLineWidth() {
    tempWidth = strokeWidth >= 25 ? strokeWidth - 10 : strokeWidth;
}

export function getLineWidth(){
    return tempWidth ? tempWidth : LINE_WIDTH;
}

export const changeLineWidth = (event: Event, newValue: number) => {
    strokeWidth = newValue
    tempWidth = strokeWidth
    // redrawCanvas();
};
