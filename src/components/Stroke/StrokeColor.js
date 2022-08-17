let colorChange = 15;
let shortPause;
let longPause;

let color = getStrokeColor()

export function getStrokeColor() {
    return 'hsl(' + Math.ceil(360 * Math.random()) + ',' + Math.floor((100 - 20 + 1) * Math.random() + 20) + '%,' + Math.floor((90 - 20 + 1) * Math.random() + 20) + '%)'
}

// changes color after a 2s pause, or changes hue slightly after a 500ms pause
export function colorDelay() {
    stopColorChange()
    let hsvArr = color.match(/\d+/g)
    if (hsvArr[0] + colorChange < 0) {
        colorChange = 5;
    } else if (hsvArr[0] + colorChange > 360) {
        colorChange = -5;
    }
    let hue = parseInt(hsvArr[0]) + colorChange;
    shortPause = setTimeout(function () {
        color = 'hsl(' + hue + ',' + hsvArr[1] + '%,' + hsvArr[2] + '%)'
    }, 500);
    longPause = setTimeout(function () {
        color = getStrokeColor();
    }, 2000);
}

// triggered onMouseDown / onTouchStart
export function stopColorChange() {
    clearTimeout(shortPause)
    clearTimeout(longPause)
}

export function getCurrColor() {
    return color
}