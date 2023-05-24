import {refreshTilings} from "./Tiling3";


let yPadding = 5;

export const changeTilingSize = (event: Event, newValue: number) => {
    yPadding = -newValue
    refreshTilings()
};


export function getYPadding(){
    return yPadding;
}

