import {redrawCanvas} from "./PageScroll";
import {getOffsetY, setOffsetY} from "./Offset";

import {FIFTH_WINDOW} from "../Constants";
let autoScroll = false;
let autoScrollOn = true;

export function startAutoScroll(cursorY) {
    if (!autoScroll && cursorY > FIFTH_WINDOW && autoScrollOn) {
        autoScroll = true;
        let timesRun = 0;
        autoScroll = setInterval(function () {
            timesRun += 1;
            let offset = getOffsetY()
            setOffsetY(offset+1)
            redrawCanvas()
            if (timesRun === 60) {
                endAutoScroll()
            }
        }, 100);
    }
}

export function endAutoScroll() {
    clearInterval(autoScroll)
    autoScroll = false;
}

export function triggerScroll() {
    autoScrollOn = !autoScrollOn
}

export function isAutoScrollActive(){
    return autoScroll
}