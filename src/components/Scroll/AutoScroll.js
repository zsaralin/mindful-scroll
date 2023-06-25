import {redrawCanvas} from "./PageScroll";
import {getOffsetY, setOffsetY} from "./Offset";

import {FIFTH_WINDOW} from "../Constants";
import {logAutoScrollEnd} from "../Logging/LogAutoScroll";
let autoScroll = false;
let autoScrollOn = true;

export function startAutoScroll(cursorY) {
    if (!autoScroll && autoScrollOn) {
        autoScroll = true;
        let timesRun = 0;
        autoScroll = setInterval(function () {
            timesRun += 1;
            let offset = getOffsetY()
            setOffsetY(offset+1)
            const bubble = document.getElementById("bubble")
            bubble.style.top = parseInt(bubble.style.top) - 1 + 'px';
            redrawCanvas()

            if (timesRun === 60) {
                endAutoScroll()
                logAutoScrollEnd()
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