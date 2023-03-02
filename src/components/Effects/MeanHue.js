import {invert} from "./ColorTheory";

export function getAverageRGB(tile, colArr) {
    var rgb = {r: 0, g: 0, b: 0},
        count = 0;

    colArr.forEach(data => {
        ++count;
        rgb.r += data.data[0];
        rgb.g += data.data[0 + 1];
        rgb.b += data.data[0 + 2];
    })

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;

}

export function fillMeanHue(tile) {
    let fillCtx = document.getElementById('canvas').getContext('2d');
    let rgb = (getAverageRGB(tile, tile.colors))
    fillCtx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',1)'
    fillCtx.fill(tile.path)
    tile.filled = true;
}

export function fillInverseMeanHue(tile){
    let fillCtx = document.getElementById('canvas').getContext('2d');
    let rgb = invert(getAverageRGB(tile, tile.colors))
    fillCtx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',1)'
    fillCtx.fill(tile.path)
    tile.filled = true;
}


