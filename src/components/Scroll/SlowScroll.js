let slowScrollOn = true;

export function triggerSlowScroll() {
    slowScrollOn = !slowScrollOn
}

export function isSlowScrollOn(){
    return slowScrollOn
}