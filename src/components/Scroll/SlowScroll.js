let slowScrollOn = false;

export function triggerSlowScroll() {
    slowScrollOn = !slowScrollOn
}

export function isSlowScrollOn(){
    return slowScrollOn
}