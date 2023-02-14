import {redrawCanvas, refreshPage} from "../Scroll/PageScroll";

let yPadding = 50;

export const changeTilingSize = (event: Event, newValue: number) => {
    yPadding = -newValue
    refreshPage()
};


export function getYPadding(){
    return yPadding;
}