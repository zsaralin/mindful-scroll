
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

export function getRandomShape(currYMax){
    let path = new Path2D()
    let index = getRandomNum(0,3)
    console.log(`index ${index}`)
    if (index === 0 ) { //circle
        path.ellipse(window.innerWidth / 2, currYMax + 150,70,70,0,0,Math.PI*2);
    }
    else if (index === 1 ) { //square
        path.moveTo(window.innerWidth / 2 - 50, currYMax + 100  )
        path.lineTo(window.innerWidth / 2 - 50, currYMax + 200 )
        path.lineTo(window.innerWidth / 2 + 50, currYMax + 200)
        path.lineTo(window.innerWidth / 2 + 50, currYMax + 100 )
        path.lineTo(window.innerWidth / 2 - 50, currYMax + 100 )
    }
    else if (index === 2) { //triangle
        path.moveTo(window.innerWidth / 2 , currYMax + 100  )
        path.lineTo(window.innerWidth / 2 + 80, currYMax + 200)
        path.lineTo(window.innerWidth / 2 - 80, currYMax + 200 )
        path.lineTo(window.innerWidth / 2 , currYMax + 100 )
    }
    return path;

}
