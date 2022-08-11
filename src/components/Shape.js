
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

export function getRandomShape(currYMax){
    let path = new Path2D()
    console.log(currYMax)
    // let index = getRandomNum(0,15)
    let index = 3;
    if (index === 0 ) { //circle
        path.ellipse(window.innerWidth / 2, currYMax + 200,80,80,0,0,Math.PI*2);
    }
    if (index === 1) { // horizontal ellipse
        path.ellipse(window.innerWidth / 2, currYMax + 200,115,80,0,0,Math.PI*2);
    }
    if (index === 2) { // vertical ellipse
        path.ellipse(window.innerWidth / 2, currYMax + 200,80,115,0,0,Math.PI*2);
    }
    else if (index === 3 ) { //square
        path.moveTo(window.innerWidth / 2 - 75, currYMax + 125  )
        path.lineTo(window.innerWidth / 2 - 75, currYMax + 275 )
        path.lineTo(window.innerWidth / 2 + 75, currYMax + 275)
        path.lineTo(window.innerWidth / 2 + 75, currYMax + 125 )
        path.lineTo(window.innerWidth / 2 - 75, currYMax + 125 )
    }
    else if (index === 4) { // triangle
        path.moveTo(window.innerWidth / 2 , currYMax + 125  )
        path.lineTo(window.innerWidth / 2 + 100, currYMax + 275)
        path.lineTo(window.innerWidth / 2 - 100, currYMax + 275 )
        path.lineTo(window.innerWidth / 2 , currYMax + 125 )
    }
    else if (index === 5) { // up-side down triangle
        path.moveTo(window.innerWidth / 2 - 100, currYMax + 125)
        path.lineTo(window.innerWidth / 2 + 100, currYMax + 275 )
        path.lineTo(window.innerWidth / 2 , currYMax + 275 )
        path.lineTo(window.innerWidth / 2 - 100 , currYMax + 125  )
    }
    else if (index === 6) { // rhombus
        path.moveTo(window.innerWidth / 2 , currYMax + 125  )
        path.lineTo(window.innerWidth / 2 + 100, currYMax + 200)
        path.lineTo(window.innerWidth / 2 , currYMax + 275)
        path.lineTo(window.innerWidth / 2 - 100, currYMax + 200 )
        path.lineTo(window.innerWidth / 2 , currYMax + 125 )
    }
    else if (index === 7) { // parallelagram
        path.moveTo(window.innerWidth / 2 - 110, currYMax + 100  )
        path.lineTo(window.innerWidth / 2 - 25, currYMax + 300 )
        path.lineTo(window.innerWidth / 2 + 110, currYMax + 300)
        path.lineTo(window.innerWidth / 2 + 25, currYMax + 100 )
        path.lineTo(window.innerWidth / 2 - 110, currYMax + 100 )
    }
    else if (index === 8) { // parallelagram
        path.moveTo(window.innerWidth / 2 - 25, currYMax + 100  )
        path.lineTo(window.innerWidth / 2 - 110, currYMax + 300 )
        path.lineTo(window.innerWidth / 2 + 25, currYMax + 300)
        path.lineTo(window.innerWidth / 2 + 110, currYMax + 100 )
        path.lineTo(window.innerWidth / 2 - 25, currYMax + 100 )
    }
    else if (index === 9) { // trapezoid
        path.moveTo(window.innerWidth / 2 - 70, currYMax + 120  )
        path.lineTo(window.innerWidth / 2 - 110, currYMax + 280 )
        path.lineTo(window.innerWidth / 2 + 110, currYMax + 280)
        path.lineTo(window.innerWidth / 2 + 70, currYMax + 120 )
        path.lineTo(window.innerWidth / 2 - 70, currYMax + 120 )
    }
    else if (index === 10) { // up side down trapezoid
        path.moveTo(window.innerWidth / 2 - 110, currYMax + 120  )
        path.lineTo(window.innerWidth / 2 - 70, currYMax + 280 )
        path.lineTo(window.innerWidth / 2 + 70, currYMax + 280)
        path.lineTo(window.innerWidth / 2 + 110, currYMax + 120 )
        path.lineTo(window.innerWidth / 2 - 110, currYMax + 120 )
    }
    else if (index === 11) { // pentagon
        path.moveTo(window.innerWidth / 2, currYMax + 100  )
        path.lineTo(window.innerWidth / 2 + 110, currYMax + 180  )
        path.lineTo(window.innerWidth / 2 + 80, currYMax + 300  )
        path.lineTo(window.innerWidth / 2 - 80, currYMax + 300  )
        path.lineTo(window.innerWidth / 2 - 110, currYMax + 180  )
        path.lineTo(window.innerWidth / 2, currYMax + 100  )
    }
    else if (index === 12) { // hexagon
        path.moveTo(window.innerWidth / 2 - 60, currYMax + 100  )
        path.lineTo(window.innerWidth / 2 + 60, currYMax + 100  )
        path.lineTo(window.innerWidth / 2 + 115, currYMax + 200  )
        path.lineTo(window.innerWidth / 2 + 60, currYMax + 300  )
        path.lineTo(window.innerWidth / 2 - 60, currYMax + 300  )
        path.lineTo(window.innerWidth / 2 - 115, currYMax + 200  )
        path.lineTo(window.innerWidth / 2 - 60, currYMax + 100  )
    }
    else if (index === 13) { // heptagon
        path.moveTo(window.innerWidth / 2, currYMax + 100  )
        path.lineTo(window.innerWidth / 2 + 85, currYMax + 150  )
        path.lineTo(window.innerWidth / 2 + 115, currYMax + 225  )
        path.lineTo(window.innerWidth / 2 + 70, currYMax + 300  )
        path.lineTo(window.innerWidth / 2 - 70, currYMax + 300  )
        path.lineTo(window.innerWidth / 2 - 115, currYMax + 225  )
        path.lineTo(window.innerWidth / 2 - 85, currYMax + 150  )
        path.lineTo(window.innerWidth / 2, currYMax + 100  )
    }
    else if (index === 14 ) { //rectangle
        path.moveTo(window.innerWidth / 2 - 100, currYMax + 150  )
        path.lineTo(window.innerWidth / 2 - 100, currYMax + 250 )
        path.lineTo(window.innerWidth / 2 + 100, currYMax + 250)
        path.lineTo(window.innerWidth / 2 + 100, currYMax + 150 )
        path.lineTo(window.innerWidth / 2 - 100, currYMax + 150 )
    }
    return path;

}
