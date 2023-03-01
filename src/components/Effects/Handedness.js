let isRight = true;
let handChange = false;

export function setHand(str){
    if(str === "right" && !isRight) {
        isRight = true;
        handChange = true;
    }
    else if (str === "left" && isRight) {
        isRight = false
        handChange = true;
    }
}

export function isRightHand(){
    return isRight
}

export function setHandChanged(bool){
    handChange = bool;
}

export function getHandChange(){
    return handChange
}