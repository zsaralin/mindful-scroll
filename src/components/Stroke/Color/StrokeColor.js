import {generateColourPal} from "./ColourPalette";
import {basicVersion} from "../../Tiling/SortingHat/CompleteTile2";

let colorChange = 15;
let shortPause;
let longPause;

let colourPal;// = basicVersion ? generateColourPal() : generateColourPal().cols
let color ;//= basicVersion ? colourPal[0] :colourPal[Math.floor(Math.random() * 4)]
let speed = 300;
// let color = getRandomHSV()
let randomColour = true;

export function getRandomHSV() {
    return 'hsl(' + Math.ceil(360 * Math.random()) + ',' + Math.floor((100 - 20 + 1) * Math.random() + 20) + '%,' + Math.floor((90 - 20 + 1) * Math.random() + 20) + '%)'
}

export function getRandomRGB() {
}

// changes color after a 2s pause, or changes hue slightly after a 500ms pause
export function colorDelayOld() {
    stopColorChange()
    let numIntervals = 0;
    if (typeof color === "string" && color?.slice(0, 4) === 'rgba') {
        const rgbValues = color.match(/\d+/g).slice(0, 3).map(Number);
        const hslValues = rgbToHsl(...rgbValues);
        color = `hsl(${Math.round(hslValues[0] * 360)}, ${Math.round(hslValues[1] * 100)}%, ${Math.round(hslValues[2] * 100)}%)`;
    }
    shortPause = setInterval(function () {
        let hsvArr = color.match(/\d+/g)
        colorChange = 5
        let hue = parseInt(hsvArr[0]) + colorChange;
        if (Math.abs(hue) > 360) {
            hue -= 360
        }
        color = 'hsl(' + hue + ',' + hsvArr[1] + '%,' + hsvArr[2] + '%)'
        numIntervals++
        if (numIntervals === 20 && randomColour) { // 6 seconds (6000)
            color = getRandomHSV();
            numIntervals = 0
        }
    }, speed);
}

export function colorDelay() {
    if(!basicVersion && color){
    // changes color after a 2s pause, or changes hue slightly after a 500ms pause
    stopColorChange()
    let decreasing = false;
    let numIntervals = 0;
    shortPause = setInterval(function () {
        let hsvArr = color.match(/\d+/g)
        colorChange = 3
        let l = parseInt(hsvArr[2]);
        if (l <= 30) l = 30;
        else if (l >= 70) l = 70;

        // Check if l is currently decreasing or increasing
        if (decreasing) {
            hsvArr[2] = (l - colorChange).toString();
            if (hsvArr[2] <= 30) {
                decreasing = false;
            }
        } else {
            hsvArr[2] = (l + colorChange).toString();
            if (hsvArr[2] >= 70) {
                decreasing = true;
            }
        }
        color = 'hsl(' + hsvArr[0] + ',' + hsvArr[1] + '%,' + hsvArr[2] + '%)'
        // console.log('color is ' + color)
        numIntervals++
        if (numIntervals === 20 && randomColour) { // 6 seconds (6000)
            const oldCol = color
            while (color === oldCol) color = colourPal[Math.floor(Math.random() * 4)]
            numIntervals = 0
        }
    }, speed);
}}

// triggered onMouseDown / onTouchStart
export function stopColorChange() {
    clearInterval(shortPause);
}

export function getCurrColor() {
    return color
}

export function changeColourSpeed(event: Event, newValue: number) {
    speed = -newValue;
    clearInterval(shortPause)
    colorDelay()
}

export function triggerRandomColour() {
    randomColour = !randomColour;
    clearInterval(shortPause)
    colorDelay()
}

export function setCurrColor(col) {
    color = col
    // const rgbValues = col.match(/\d+/g).slice(0, 3).map(Number);
    // const hslValues = rgbToHsl(...rgbValues);
    // color = `hsl(${Math.round(hslValues[0] * 360)}, ${Math.round(hslValues[1] * 100)}%, ${Math.round(hslValues[2] * 100)}%)`;
    // console.log(color)
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        const d = max - min;
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

export function getColourPal() {
    return colourPal
}

export function setColourPal(inp) {
    colourPal = inp ? inp : basicVersion ? generateColourPal() : generateColourPal().cols
    color = basicVersion ? colourPal : colourPal[Math.floor(Math.random() * colourPal.length)]
    // console.log(colourPal)
    clearInterval(shortPause)
    // colorDelay()
}