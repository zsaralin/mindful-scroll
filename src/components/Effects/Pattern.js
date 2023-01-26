function isLeft(startX, endX) {
    if (startX > endX) {
        console.log('left');
    }
}

function isRight(startX, endX) {
    if (startX < endX) {
        console.log('right');
    }
}

function isUp(startY, endY) {
    if (startY > endY) {
        console.log('up');
    }
}

function isDown(startY, endY) {
    if (startY < endY) {
        console.log('down');
    }
}

export function findDir(startX, startY, endX, endY){
    isLeft(startX,endX);
    isRight(startX,endX);
    isUp(startY,endY);
    isDown(startY,endY)
    findSlope(startX, startY, endX, endY)
}

function findSlope(startX, startY, endX, endY){
    let slope = (endX-startX)/(endY-startY)
    console.log('slope :' + slope)
}