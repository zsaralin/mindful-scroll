let colorChange = 15;
let shortPause;
let longPause;

let color = getRandomHSV()
let speed = 300;
let randomColour = true;

export function getRandomHSV() {
    return 'hsl(' + Math.ceil(360 * Math.random()) + ',' + Math.floor((100 - 20 + 1) * Math.random() + 20) + '%,' + Math.floor((90 - 20 + 1) * Math.random() + 20) + '%)'
}

export function getRandomRGB() {
}

// changes color after a 2s pause, or changes hue slightly after a 500ms pause
export function colorDelay() {
    stopColorChange()
    let numIntervals = 0;
    shortPause = setInterval(function () {
        let hsvArr = color.match(/\d+/g)
        colorChange = 10
        let hue = parseInt(hsvArr[0]) + colorChange;
        if (Math.abs(hue) > 360) {
            hue-= 360
        }
        color = 'hsl(' + hue + ',' + hsvArr[1] + '%,' + hsvArr[2] + '%)'
        numIntervals++
        if (numIntervals === 20 && randomColour){ // 6 seconds (6000)
            color = getRandomHSV();
            numIntervals = 0
        }
    }, speed);
}

// triggered onMouseDown / onTouchStart
export function stopColorChange() {
    clearInterval(shortPause);
}

export function getCurrColor() {
    return color
}

export function changeColourSpeed(event: Event, newValue: number){
    speed = -newValue;
    clearInterval(shortPause)
    colorDelay()
}

export function triggerRandomColour(){
    randomColour = !randomColour;
    clearInterval(shortPause)
    colorDelay()
}
