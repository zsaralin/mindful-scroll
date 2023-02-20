import {LINE_WIDTH} from "../Constants";
import {redrawTilings} from "../Tiling/TilingArr";
import {redrawCanvas} from "../Scroll/PageScroll";
let strokeWidth = LINE_WIDTH;
let tempWidth;

export function resetLineWidth() {
    tempWidth = strokeWidth;
}

export function getLineWidth(){
    return tempWidth ? tempWidth : strokeWidth;
}

export function geStrokeWidth(){
    return strokeWidth;
}

export const changeLineWidth = (event: Event, newValue: number) => {
    strokeWidth = newValue
    tempWidth = strokeWidth
    // redrawCanvas();
};

export const setLineWidth = (newValue) => {
    tempWidth = newValue
};
