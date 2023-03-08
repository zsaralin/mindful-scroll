export function invertHue(col) {
    let hsl = col;
    if (typeof col === "string" && col?.slice(0, 4) === 'rgba') {
        const rgbaValues = col.substring(5, hsl.length - 1).split(",");
        hsl = rgbToHsl(parseInt(rgbaValues[0]),parseInt(rgbaValues[1]), parseInt(rgbaValues[2]));
    } else if (typeof col === "string" && col?.slice(0, 3) === 'hsl') {
        hsl = hsl.match(/\d+(\.\d+)?%?/g).map(e => e.includes('%') ? parseInt(e) : parseFloat(e));
    }
    hsl[0] = 360 - hsl[0]
    let ans = hslToRgb(hsl[0], hsl[1], hsl[2])
    return 'rgba(' + ans.r + ',' + ans.g + ',' + ans.b + ',1)'
}

export function invert(col){
    let rgb = {r: 0, g: 0, b: 0};
    if (typeof col === "string" && col?.slice(0, 4) === 'rgba') {
        const rgbaValues = col.substring(5, rgb.length - 1).split(",");
        rgb = {r: parseInt(rgbaValues[0]), g: parseInt(rgbaValues[1]), b: parseInt(rgbaValues[2])}
    } else if(typeof col === "string" && col?.slice(0,3) === 'hsl') {
        const match = col.match(/hsl\((\d+),(\d+)%?,(\d+)%?\)/);
        rgb = match ? hslToRgb(parseInt(match[1]), parseInt(match[2]), parseInt(match[3])) : null;
    }
    let ans = {r: 0, g: 0, b: 0};
    ans.r = 255 - rgb.r;
    ans.g = 255 - rgb.g;
    ans.b = 1 - rgb.b
    return 'rgba(' + ans.r + ',' + ans.g + ',' + ans.b + ',1)'
}

export function isSimilar(col0, col1) {
    if (typeof col0 === "string" && col0.slice(0, 3) === 'hsl') {
        col0 = col0.match(/(\d+(\.\d+)?)/g).map(Number);
        col1 = col1.match(/(\d+(\.\d+)?)/g).map(Number);
    } else {
        col0 = [col0.data[0], col0.data[1], col0.data[2]]
        col1 = [col1.data[0], col1.data[1], col1.data[2]] // col1 = col1.substring(col1.indexOf("(") + 1, col1.lastIndexOf(")")).split(",").slice(0, 3).map((val) => parseInt(val, 10));
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

export function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1.0 / 3.0);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1.0 / 3.0);
    }

    return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
}

export function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h, s, l];
}

export function meanHue(tile, colArr) {
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

export function complem(rgb) {
    const firstNumber = rgb.match(/^hsl\((\d+)/)?.[1] ?? 'No match found';
    return rgb.replace(/^hsl\(\d+/, `hsl(${HueShift(firstNumber, 180.0)}`)
}

//Adding HueShift via Jacob (see comments)
function HueShift(h, s) {
    h += s;
    while (h >= 360.0) h -= 360.0;
    while (h < 0.0) h += 360.0;
    return h;
}