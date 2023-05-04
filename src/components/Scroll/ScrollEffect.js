import {gsap} from "gsap";
import {getOffsetY} from "./Offset";
import {setRefreshed} from "./PageScroll";

let done = true;
let oldOffset = 0

let overlay = false;
let scrollFade = true;

export function startEffect(prevCursorY, cursorY){
    if (overlay) {
        if (cursorY < prevCursorY) {
            gsap.to("#overlayBottom", {opacity: 1, duration: 2})
        } else if (cursorY > prevCursorY) {
            gsap.to("#overlayTop", {opacity: 1, duration: 2})
        }
    }

}

export function moveEffect(refreshed, offsetY, prevOffsetY){
    if (scrollFade) {
        let hiddenBottom = document.getElementById("hiddenBottom")
        let hiddenTop = document.getElementById("hiddenTop")
        if (done) {
            if (refreshed) {
                oldOffset -= prevOffsetY - 200;
                setRefreshed(false);
            }
            gsap.killTweensOf('#hiddenTop, #hiddenBottom')
            let twoPercentInPixels = (2 / 100) * window.innerHeight;
            // hiddenBottom.style.bottom = -(window.innerHeight + oldOffset - twoPercentInPixels) + 'px';
            // hiddenBottom.style.opacity = 1;
            hiddenTop.style.bottom = (window.innerHeight - oldOffset - twoPercentInPixels) + 'px';
            hiddenTop.style.opacity = 1;
            done = true;
        }
        // hiddenBottom.style.transform = `translate(0,-${offsetY}px)`;
        hiddenTop.style.transform = `translate(0,-${offsetY}px)`;
        gsap.to('#hiddenTop', {opacity: 0, delay: .5, duration: 10, ease: "Expo.easeNone"})
    }
}
export function endEffect(){
    if (overlay) {
        gsap.to("#overlayBottom, #overlayTop", {
            opacity: 0, duration: 5, onComplete: function () {
                gsap.set("#overlayBottom, #overlayTop", {opacity: 0});
            }
        })
    }
    done = true;
    if (scrollFade) {
        gsap.to('#hiddenTop', {
            opacity: 0, duration: 3, ease: "Expo.easeNone", onComplete: () => {
                gsap.killTweensOf('#hiddenTop')
            }
        })
        oldOffset = getOffsetY();
    }
}