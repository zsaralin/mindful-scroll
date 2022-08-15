function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

export function getRandomShape(currYMax) {
    let path = new Path2D()
    let dimension = []
    // console.log(currYMax)
    let index = getRandomNum(0,15)
    console.log(index)
    // let index =14;
    if (index === 0) { //circle
        path.ellipse(window.innerWidth / 2, currYMax + 200, 100, 100, 0, 0, Math.PI * 2);
        dimension = [window.innerWidth / 2 - 100, window.innerWidth / 2 + 100, currYMax + 100, currYMax + 300]
    }
    if (index === 1) { // horizontal ellipse
        path.ellipse(window.innerWidth / 2, currYMax + 200, 115, 80, 0, 0, Math.PI * 2);
        dimension = [window.innerWidth / 2 - 115, window.innerWidth / 2 + 115, currYMax + 120, currYMax + 280]
    }
    if (index === 2) { // vertical ellipse
        path.ellipse(window.innerWidth / 2, currYMax + 200, 80, 115, 0, 0, Math.PI * 2);
        dimension = [window.innerWidth / 2 - 80, window.innerWidth / 2 + 80, currYMax + 85, currYMax + 315]
    } else if (index === 3) { //square
        path.moveTo(window.innerWidth / 2 - 75, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 75, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 75, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 75, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 75, currYMax + 125)
        dimension = [window.innerWidth / 2 - 75, window.innerWidth / 2 + 75, currYMax + 125, currYMax + 275]
    } else if (index === 4) { // triangle
        path.moveTo(window.innerWidth / 2, currYMax + 125)
        path.lineTo(window.innerWidth / 2 + 75, currYMax + 275)
        path.lineTo(window.innerWidth / 2 - 75, currYMax + 275)
        path.lineTo(window.innerWidth / 2, currYMax + 125)
        dimension = [window.innerWidth / 2 - 75, window.innerWidth / 2 + 75, currYMax + 125, currYMax + 275]
    } else if (index === 5) { // up-side down triangle
        path.moveTo(window.innerWidth / 2 - 75, currYMax + 125)
        path.lineTo(window.innerWidth / 2 + 75, currYMax + 125)
        path.lineTo(window.innerWidth / 2, currYMax + 275)
        path.lineTo(window.innerWidth / 2 - 75, currYMax + 125)
        dimension = [window.innerWidth / 2 - 75, window.innerWidth / 2 + 75, currYMax + 125, currYMax + 275]
    } else if (index === 6) { // rhombus
        path.moveTo(window.innerWidth / 2, currYMax + 125)
        path.lineTo(window.innerWidth / 2 + 75, currYMax + 200)
        path.lineTo(window.innerWidth / 2, currYMax + 275)
        path.lineTo(window.innerWidth / 2 - 75, currYMax + 200)
        path.lineTo(window.innerWidth / 2, currYMax + 125)
        dimension = [window.innerWidth / 2 - 75, window.innerWidth / 2 + 75, currYMax + 125, currYMax + 275]
    } else if (index === 7) { // parallelagram
        path.moveTo(window.innerWidth / 2 - 110, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 25, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 110, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 25, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 110, currYMax + 125)
        dimension = [window.innerWidth / 2 - 110, window.innerWidth / 2 + 110, currYMax + 125, currYMax + 275]
    } else if (index === 8) { // parallelagram
        path.moveTo(window.innerWidth / 2 - 25, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 110, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 25, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 110, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 25, currYMax + 125)
        dimension = [window.innerWidth / 2 - 110, window.innerWidth / 2 + 110, currYMax + 125, currYMax + 275]
    } else if (index === 9) { // trapezoid
        path.moveTo(window.innerWidth / 2 - 60, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 110, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 110, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 60, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 60, currYMax + 125)
        dimension = [window.innerWidth / 2 - 110, window.innerWidth / 2 + 110, currYMax + 125, currYMax + 275]
    } else if (index === 10) { // up side down trapezoid
        path.moveTo(window.innerWidth / 2 - 110, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 60, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 60, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 110, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 110, currYMax + 125)
        dimension = [window.innerWidth / 2 - 110, window.innerWidth / 2 + 110, currYMax + 125, currYMax + 275]
    } else if (index === 11) { // pentagon
        path.moveTo(window.innerWidth / 2, currYMax + 125)
        path.lineTo(window.innerWidth / 2 + 100, currYMax + 180)
        path.lineTo(window.innerWidth / 2 + 70, currYMax + 275)
        path.lineTo(window.innerWidth / 2 - 70, currYMax + 275)
        path.lineTo(window.innerWidth / 2 - 100, currYMax + 180)
        path.lineTo(window.innerWidth / 2, currYMax + 125)
        dimension = [window.innerWidth / 2 - 100, window.innerWidth / 2 + 100, currYMax + 125, currYMax + 275]
    } else if (index === 12) { // hexagon
        path.moveTo(window.innerWidth / 2 - 60, currYMax + 125)
        path.lineTo(window.innerWidth / 2 + 60, currYMax + 125)
        path.lineTo(window.innerWidth / 2 + 100, currYMax + 200)
        path.lineTo(window.innerWidth / 2 + 60, currYMax + 275)
        path.lineTo(window.innerWidth / 2 - 60, currYMax + 275)
        path.lineTo(window.innerWidth / 2 - 100, currYMax + 200)
        path.lineTo(window.innerWidth / 2 - 60, currYMax + 125)
        dimension = [window.innerWidth / 2 - 100, window.innerWidth / 2 + 100, currYMax + 125, currYMax + 275]
    } else if (index === 13) { // heptagon
        path.moveTo(window.innerWidth / 2, currYMax + 125)
        path.lineTo(window.innerWidth / 2 + 60, currYMax + 155)
        path.lineTo(window.innerWidth / 2 + 75, currYMax + 220)
        path.lineTo(window.innerWidth / 2 + 40, currYMax + 275)
        path.lineTo(window.innerWidth / 2 - 40, currYMax + 275)
        path.lineTo(window.innerWidth / 2 - 75, currYMax + 220)
        path.lineTo(window.innerWidth / 2 - 60, currYMax + 155)
        path.lineTo(window.innerWidth / 2, currYMax + 125)
        dimension = [window.innerWidth / 2 - 75, window.innerWidth / 2 + 75, currYMax + 125, currYMax + 275]
    } else if (index === 14) { //rectangle
        path.moveTo(window.innerWidth / 2 - 115, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 115, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 115, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 115, currYMax + 125)
        path.lineTo(window.innerWidth / 2 - 115, currYMax + 125)
        dimension = [window.innerWidth / 2 - 115, window.innerWidth / 2 + 115, currYMax + 125, currYMax + 275]
    }
    return [path, dimension];

}
