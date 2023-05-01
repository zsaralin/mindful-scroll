import {redrawCanvas, refreshPage} from "../Scroll/PageScroll";

let yPadding = 80;

export const changeTilingSize = (event: Event, newValue: number) => {
    yPadding = -newValue
    refreshPage()
};


export function getYPadding(){
    return yPadding;
}

