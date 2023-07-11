import {getRandomHSV} from "../Stroke/Color/StrokeColor";

let cols = {}
export function initCols(){
    for (let i = 0; i <= 14; i++) {
        cols[i] = getRandomHSV();
    }
    console.log(cols)
    // return cols;
}

export function getShapeCol(i){
    if(Object.keys(cols).length === 0) initCols()
    console.log('HI ' + i  + ' ' + cols[i])
    return cols[i]
}
