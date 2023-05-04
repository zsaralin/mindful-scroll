export function invertHue(col) {
    let hsl = col;
    if (typeof col === "string" && col?.slice(0, 4) === 'rgba') {
        const rgbaValues = col.substring(5, col.length - 1).split(",");
        console.log('col is : ' + col + ' ' + rgbaValues)
        const [h, s, l] = rgbToHsl(parseInt(rgbaValues[0]), parseInt(rgbaValues[1]), parseInt(rgbaValues[2]))
        hsl = [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]

    } else if (typeof col === "string" && col?.slice(0, 3) === 'hsl') {
        hsl = hsl.match(/\d+(\.\d+)?%?/g).map(e => e.includes('%') ? parseInt(e) : parseFloat(e));
    }
    hsl[0] = 360 - hsl[0]
    console.log('LOOOK IEEEE : ' + hsl[0], hsl[1], hsl[2])
    let ans = hslToRgb(hsl[0], hsl[1], hsl[2])
    console.log('rgba(' + ans.r + ',' + ans.g + ',' + ans.b + ',1)')
    return 'rgba(' + ans.r + ',' + ans.g + ',' + ans.b + ',1)'
}

export function invert(col) {
    let rgb = {r: 0, g: 0, b: 0};
    if (typeof col === "string" && col?.slice(0, 4) === 'rgba') {
        const rgbaValues = col.substring(5, col.length - 1).split(",");
        rgb = {r: parseInt(rgbaValues[0]), g: parseInt(rgbaValues[1]), b: parseInt(rgbaValues[2])}
    } else if (typeof col === "string" && col?.slice(0, 3) === 'hsl') {
        const match = col.match(/hsl\((\d+),(\d+)%?,(\d+)%?\)/);
        rgb = match ? hslToRgb(parseInt(match[1]), parseInt(match[2]), parseInt(match[3])) : null;
    }
    let ans = {r: 0, g: 0, b: 0};
    ans.r = 255 - rgb.r;
    ans.g = 255 - rgb.g;
    ans.b = 1 - rgb.b
    return 'rgba(' + ans.r + ',' + ans.g + ',' + ans.b + ',1)'
}

// gradient thres = 50
export function isSimilar(col0, col1, thres) {
    // make sure both colors are of the same type (converts to rgb)
    if (typeof col0 === "string" && typeof col1 === "string" && col0.slice(0, 3) === 'hsl' && col1.slice(0, 3) === 'rgb') {
        const hslArr = col0.match(/\d+(\.\d+)?%?/g).map(e => e.includes('%') ? parseInt(e) : parseFloat(e));
        let ans = hslToRgb(parseInt(hslArr[0]), parseInt(hslArr[1]), parseInt(hslArr[2]))
        col0 = [ans.r,ans.g ,ans.b]
        col1 = col1.match(/\d+/g).map(Number).slice(0,3);
        console.log('after ' + col0)
    } else if (typeof col0 === "string" && typeof col1 === "string" && col0.slice(0, 3) === 'rgb' && col1.slice(0, 3) === 'hsl') {
        const hslArr = col1.match(/\d+(\.\d+)?%?/g).map(e => e.includes('%') ? parseInt(e) : parseFloat(e));
        let ans = hslToRgb(hslArr[0], hslArr[1], hslArr[2])
        col1 = [ans.r,ans.g ,ans.b]
        col0 = col0.match(/\d+/g).map(Number).slice(0,3);
    }
    else if (typeof col0 === "string" && col0.slice(0, 3) === 'hsl') { // both are hsl
        col0 = col0.match(/(\d+(\.\d+)?)/g).map(Number);
        col1 = col1.match(/(\d+(\.\d+)?)/g).map(Number);
    } else {
        col0 = col0.match(/\d+/g).map(Number).slice(0,3);
        col1 = col1.match(/\d+/g).map(Number).slice(0,3);
    }
    console.log('final is ' + col0 + ' and ' + col1)
    if (Math.abs(col0[0] - col1[0]) < 50 && Math.abs(col0[1] - col1[1]) < 50 && Math.abs(col0[2] - col1[2]) < 50) return true;
    else return false;
}

export function fillTileColors(tile) {
    let ctx = document.getElementById('top-canvas').getContext('2d');
    tile.inPath.forEach(i => {
        let x = i[0], y = i[1]
        if (ctx.getImageData(x, y, 1, 1).data.toString() !== '0,0,0,0') {
            tile.allColors.push(ctx.getImageData(x, y, 1, 1))
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
    // console.log('r : ' + r + ' g ' + g + 'and + ' + b)
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

export function meanHue(colArr) {
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

    return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',1)'
}

function hslToObj(hsl) {
    const [h, s, l] = hsl.match(/\d+(\.\d+)?%?/g).map(e => e.includes('%') ? parseInt(e) : parseFloat(e));
    return { h: h / 360, s: s / 100, l: l / 100 };
}

function objToHsl(obj) {
    const h = Math.round(obj.h * 360);
    const s = Math.round(obj.s * 100);
    const l = Math.round(obj.l * 100);
    return `hsl(${h}, ${s}%, ${l}%)`;
}
export function interpolateHslColor(hsl1, hsl2) {
    const color1 = hslToObj(hsl1);
    const color2 = hslToObj(hsl2);
    const h = (color1.h + color2.h) / 2;
    const s = (color1.s + color2.s) / 2;
    const l = (color1.l + color2.l) / 2;
    return objToHsl({ h: h, s: s, l: l });
}

export function complem(hsl) {
    if (typeof hsl === "string" && hsl?.slice(0, 4) === 'rgba') {
        const rgbaValues = hsl.substring(5, hsl.length - 1).split(",");
        let [h, s, l] = rgbToHsl(rgbaValues[0], rgbaValues[1], rgbaValues[2]);
        hsl = [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
        hsl = 'hsl(' + hsl[0] + ',' + hsl[1] + '%,' + hsl[2] + '%)'
        // console.log('hsl is ' + hsl)
    }
    const firstNumber = hsl.match(/^hsl\((\d+)/)?.[1] ?? 'No match found';
    return hsl.replace(/^hsl\(\d+/, `hsl(${HueShift(firstNumber, 180.0)}`)
}

export function splitComplem(hsl) {
    let complem1 = complem(hsl)
    // console.log('hsl coopmelx ' + complem1)
    const hslValues = complem1.match(/\d+/g);

// Convert HSL values to numbers
    const hue = parseInt(hslValues[0]);
    const saturation = parseInt(hslValues[1]);
    const lightness = parseInt(hslValues[2]);
    let complementHsl = [hue, saturation, lightness]
    // Calculate split complements
    const splitComplements = [
        (complementHsl[0] + 30) % 360,
        (complementHsl[0] - 30 + 360) % 360,
    ];
    // let ans = hslToRgb(hue, complements[])
    // Convert split complements to RGB or any other format as needed
    let ans = splitComplements.map((hue) => (hslToRgb(hue, complementHsl[1], complementHsl[2])))
    for (let q = 0; q < ans.length; q++) {
        ans[q] = `rgba(${ans[q].r}, ${ans[q].g}, ${ans[q].b}, 1)`;
    }
    console.log(ans + ' and is ' + ans.toString())
    return ans;
}

//Adding HueShift via Jacob (see comments)
function HueShift(h, s) {
    h += s;
    while (h >= 360.0) h -= 360.0;
    while (h < 0.0) h += 360.0;
    return h;
}
