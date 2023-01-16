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
    let numIntervals = 0;
    // let hsvArr = color.match(/\d+/g)
    // if (hsvArr[0] + colorChange < 0) {
    //     colorChange = 25;
    // } else if (hsvArr[0] + colorChange > 360) {
    //     colorChange = -25;
    // }
    // let hue = parseInt(hsvArr[0]) + colorChange;
    shortPause = setInterval(function () {
        let hsvArr = color.match(/\d+/g)
        colorChange = 2
        let hue = parseInt(hsvArr[0]) + colorChange;
        if (Math.abs(hue) > 360) {
            hue-= 360
        }
        color = 'hsl(' + hue + ',' + hsvArr[1] + '%,' + hsvArr[2] + '%)'
        numIntervals++
        if (numIntervals === 20){ // 6 seconds (6000)
            color = getStrokeColor();
            numIntervals = 0
        }
    }, 300);
}

// triggered onMouseDown / onTouchStart
export function stopColorChange() {
    clearInterval(shortPause)
}

export function getCurrColor() {
    return color
}