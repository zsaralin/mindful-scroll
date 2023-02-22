let isRight = true;

export function setHand(str){
    if(str === "right") isRight = true;
    else isRight = false
}

export function isRightHand(){
    return isRight
}