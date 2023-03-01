let colDict = {}

export function addToColDict(tile, data) {
    colDict[tile.id] = colDict[tile.id] || [];
    colDict[tile.id].push(data)
}

export function getAverageRGB(tile) {
    let colArr = colDict[tile.id]
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

export function fillColDict(tile) {
    let ctx = document.getElementById('canvas').getContext('2d');
    tile.inPath.forEach(i => {
        let x = i[0], y = i[1]
        let id = ctx.getImageData(x, y, 1, 1)
        if (id.data.toString() !== '0,0,0,0') {
            addToColDict(tile, ctx.getImageData(x, y, 1, 1))
        }
    })
}

export function fillMeanHue(tile) {
    let fillCtx = document.getElementById('canvas').getContext('2d');
    if (!colDict[tile.id]) fillColDict(tile)
    let rgb = getAverageRGB(tile)
    fillCtx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',1)'
    fillCtx.fill(tile.path)
    tile.filled = true;
}

export function getColArr(tile){
    return colDict[tile.id]
}