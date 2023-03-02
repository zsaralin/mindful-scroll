export function invert(rgb) {
    let ans = {r: 0, g: 0, b: 0};
    ans.r = 255 - rgb.r; ans.g = 255 - rgb.g; ans.b = 1 - rgb.b
    return ans
}

export function isSimilar(col0, col1) {
    if (col0.slice(0, 3) === 'hsl') {
        col0 = col0.match(/(\d+(\.\d+)?)/g).map(Number);
        col1 = col1.match(/(\d+(\.\d+)?)/g).map(Number);
    } else {
        col0 = [col0.data[0],col0.data[1],col0.data[2]]
        col1 = [col1.data[0],col1.data[1],col1.data[2]] // col1 = col1.substring(col1.indexOf("(") + 1, col1.lastIndexOf(")")).split(",").slice(0, 3).map((val) => parseInt(val, 10));
    }
    if (Math.abs(col0[0] - col1[0]) < 50 && Math.abs(col0[1] - col1[1]) < 50 && Math.abs(col0[2] - col1[2]) < 50) return true;
    else return false;
}

export function fillTileColors(tile) {
    let ctx = document.getElementById('canvas').getContext('2d');
    tile.inPath.forEach(i => {
        let x = i[0], y = i[1]
        if (ctx.getImageData(x, y, 1, 1).data.toString() !== '0,0,0,0') {
            tile.colors.push(ctx.getImageData(x, y, 1, 1))
        }
    })
}