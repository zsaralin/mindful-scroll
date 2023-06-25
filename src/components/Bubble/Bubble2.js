import {gsap} from "gsap";
import {startColourPreview} from "./Bubble";
import {smallOffset} from "../Tiling/Tiling3";
import {getOffsetY} from "../Scroll/Offset";

export function showBubble(tile, newTile, handChange) {
        let x = tile.bounds[0] - 50;
        let y = tile.bounds[2] - 25 - smallOffset - getOffsetY();

        if (x < 20) x = 20;
        if (x > window.innerWidth) x = window.innerWidth;
        if (y > window.innerHeight) y = window.innerHeight;
        if (y < 60) y = 60;

        const bubble = document.getElementById("bubble");
        bubble.style.left = x + "px"; // Update the left position
        bubble.style.top = y + "px"; // Update the top position
        if(newTile || handChange) bubble.style.opacity = 0;
        gsap.to("#bubble", {opacity: 1, duration: 2, onComplete: startColourPreview});
}

export function hideBubble() {
    gsap.to("#bubble", { opacity: 0, duration: 1});
}