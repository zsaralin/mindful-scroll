import {gsap} from "gsap";
import {BUBBLE_DIST} from "../Constants";
import {colorDelay, getCurrColor} from "../Stroke/Color/StrokeColor";
import Snap from "snapsvg-cjs";
import {useEffect} from "react";
import {isRightHand} from "../Effects/Handedness";
import {sqrt} from "mathjs";
import {
    getIsChanging,
    isChanging,
    setCirclePoints,
    setCloudPoints,
    setSpeechPoints,
    stopShapeChange,
    currShape, setIsChanging
} from "./ShapeChange";

let colourInterval;

let s;
let circle;
let speech;
let cloud;
let circlePoints;

let bubble;
const mina = window.mina;

let prevTop;
let prevLeft;

let isHiding = false;
let dontShow = false;
let cloudType = '#circlesR';

export function setIsHiding(input) {
    isHiding = input
}

export function showColourPreview(x, y, newTile, handChange) {
    if (isMoving) {
        dontShow = true;
        return
    }
    if (bubble.style.opacity === 0 && (newTile || handChange)) {
        let loc = bubbleHelper(x, y)
        gsap.to("#bubble", {
            duration: 0, x: loc[0] + 'px', y: loc[1] + 'px', onComplete:
                gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0, onComplete: startColourPreview})
        })
    } else gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0, onComplete: startColourPreview})
}


export async function hideColourPreview() {
    if (isHiding) return
    else if (!isHiding) {
        gsap.killTweensOf("#bubble", "x,y");
        clearInterval(colourInterval)
        stopShapeChange()
        startColourPreview()
        isHiding = true;

        document.getElementById('speech-text').innerHTML = ''
        document.getElementById('cloud-text').innerHTML = ''
        circle?.stop()
        gsap.killTweensOf(cloudType);

        gsap.to(cloudType, {opacity: 0, duration: 0}) // remove cloud bubbles
        circle?.animate({d: circlePoints}, 100, mina.linear);

        gsap.to("#bubble", {
            opacity: 0, duration: 0
        })
        prevTop = bubble.style.top;
        prevLeft = bubble.style.left;
    }
}

function bubbleHelper(x, y) {
    let xDist = isRightHand() ? -85 : 10;
    let newX = x + xDist
    let newY = y - BUBBLE_DIST;
    if (newX < 30) newX = 30;
    if (newX > window.innerWidth) newX = window.innerWidth;
    if (newY < 60) newY = 60;
    return [newX, newY] //left, top
}

export function pauseColourPreview() {
    clearInterval(colourInterval)
    bubble.style.setProperty('--col', "white");
}

export function startColourPreview() {
    if (getIsChanging()) return
    clearInterval(colourInterval)
    colourInterval = setInterval(function () {
        bubble.style.setProperty('--col', getCurrColor());
    }, 300);
}

export function resetColourPreview() {
    gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0})
    startColourPreview()
    bubble.style.top = prevTop
    bubble.style.left = prevLeft
}

export let isMoving = false;
const delay = ms => new Promise(res => setTimeout(res, ms));


export const moveFeedback = async (prevX, prevY, x, y, newTile) => {
    // getCircle()?.animate({d: circlePoints}, 1000, mina.linear);
    if (!newTile) return
    if (isMoving) {
        gsap.killTweensOf("#bubble")
    }
    isMoving = true;
    // gsap.killTweensOf('#circlesR, #circlesL, #cloud-text, #speech-text, #bubble')
    if (currShape !== 'circle') {
        stopShapeChange()
        gsap.killTweensOf('#circlesR, #circlesL, #cloud-text, #speech-text, #bubble, #circle')
        circle?.stop()

        setIsChanging(false)
        // document.getElementById('#' + currShape + '-text')
        gsap.to('#' + currShape + '-text, #circlesR, #circlesL', {
            opacity: 0, duration: .5, onComplete: () => {
                gsap.to("#circle", {stroke: 'white', strokeWidth: 10, duration: 1})
                circle?.animate({d: circlePoints}, 500, mina.linear);
                delay(1000)
                startColourPreview()
                moveFeedbackHelper(prevX, prevY, x, y, newTile)
            }
        })
    }
    else{
        moveFeedbackHelper(prevX, prevY, x, y, newTile)
    }

}

const moveFeedbackHelper = async (prevX, prevY, x, y, newTile) => {
    if (x === undefined) {
        gsap.to("#bubble", {
            duration: .5, delay: 0, opacity: 0, onComplete() {
                return
            }
        })
    }
    // if (!newTile) return
    // if (isMoving) {
    //     gsap.killTweensOf("#bubble")
    // }
    // isMoving = true;
    let loc = bubbleHelper(x, y)
    let dist = sqrt((prevY - loc[1]) ** 2 + (prevX - loc[0]) ** 2)
    gsap.to("#bubble", {
        duration: Math.round(dist / 15),
        x: loc[0] + 'px',
        y: loc[1] + 'px',
        ease: "power1.inOut",
    })
    gsap.to("#bubble", {
        duration: 1, delay: 1, opacity: 0, onComplete: () => {
            gsap.killTweensOf("#bubble", "x,y");
            let loc = bubbleHelper(x, y)
            gsap.to("#bubble", {
                duration: 0, delay: 1, x: loc[0] + 'px', y: loc[1] + 'px', onComplete: () => {
                    if (dontShow) {
                        gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0, onComplete: isMoving = false})
                        dontShow = false;
                    } else isMoving = false;
                }
            })
        }
    })
}

export function getCircle() {
    return circle
}

export default function Bubble() {
    useEffect(() => {
        bubble = document.getElementById("bubble");
        s = Snap(bubble)
        circle = s.select('#circle');
        speech = s.select('#speechR');
        cloud = s.select('#cloud');

        circlePoints = circle?.node.getAttribute('d');
        setCirclePoints(circlePoints);
        setSpeechPoints(speech?.node.getAttribute('d'));
        setCloudPoints(cloud?.node.getAttribute('d'));

        colorDelay()
        // gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0})
        startColourPreview()

    }, []);
    return (
        <svg id="bubble" opacity='0'> >
            <path id="circle" d=
                "M100.235 68.6081C100.235 68.6081 103.822 70.7256 106.335 74.8052C108.59 79.137 109.086 80.9176 108.798 85.7394C108.798 85.7394 108.516 89.7995 106.461 93.3396C104.405 96.8797 100.743 99.1008 100.743 99.1008C100.743 99.1008 98.5393 100.647 94.9781 101.638C91.4168 102.629 87.108 101.583 87.108 101.583C87.108 101.583 84.0633 101.308 79.7705 97.978C75.4776 94.6477 74.3966 90.7935 74.3966 90.7935C74.3966 90.7935 72.2355 86.247 73.5454 80.4168C74.4358 75.1299 77.8293 71.7761 77.8293 71.7761C77.8293 71.7761 82.2724 66.7676 89.3843 66.3092C95.7381 65.3379 100.235 68.6081 100.235 68.6081Z"
                  opacity='1'/>
            <path id="speechR" d=
                "M141 46.9738C141 46.9738 159.5 45.5021 159.5 63.0019C159.5 72.0021 159.5 81.6073 159.5 103.502C159.5 103.502 157.5 121.002 133 121.002C124.5 133.502 118.5 141.502 118.5 141.502C118.5 141.502 111 131.002 104 121.002C94.9999 121.002 87.0004 121.002 87.0004 121.002C87.0004 121.002 78.9999 121.002 71.0003 121.002C60.9999 121.002 40.0003 121.002 40.0003 121.002C40.0003 121.002 21.5004 122.002 21.5004 100.002C21.5004 75.0017 22.0002 66.0019 22.0002 66.0019C22.0002 66.0019 20.5004 46.5021 40.0003 46.5021C53.0007 46.9738 141 46.9738 141 46.9738Z"
                  opacity='0'/>
            <path id="speechL" d=
                "M21.3237 104.994C21.3237 104.994 21.8231 78.4936 21.8238 63.9936C21.8245 49.4937 30.8232 44.9936 48.8233 44.9937C48.8233 44.9937 88.3243 44.9937 97.8238 44.9937C107.323 44.9937 134.824 44.9936 134.824 44.9936C134.824 44.9936 159.824 43.9936 159.824 64.4937C159.824 70.9936 159.824 104.994 159.824 104.994C159.824 104.994 159.824 120.494 141.824 120.494C128.824 120.494 80.3242 120.494 80.3242 120.494C80.3242 120.494 74.3238 127.494 65.27 139.994C57.8238 128.494 52.824 120.494 52.824 120.494C52.824 120.494 43.8234 120.494 35.8238 120.494C21.8236 120.494 21.3237 104.994 21.3237 104.994Z"
                  opacity='0'/>
            <text id="speech-text" x='90px' y='91px'></text>
            <path id="cloud" d=
                "M122.936 40.0677C122.936 40.0677 133.937 40.0677 140.936 52.5677C156.437 52.5677 161.937 65.0679 163.435 70.0681C163.435 70.0681 168.437 91.5679 150.936 101.068C152.437 112.068 143.436 121.568 143.436 121.568C143.436 121.568 130.437 135.068 110.936 126.568C100.437 141.068 83.9356 138.568 83.9356 138.568C83.9356 138.568 67.4365 137.568 57.9356 120.068C24.4361 122.568 19.9367 98.5677 19.9367 98.5677C19.9367 98.5677 9.43611 70.0681 42.4366 57.5677C44.9361 36.0681 69.4363 33.0678 69.4363 33.0678C69.4363 33.0678 90.9362 28.5681 104.436 43.0677C113.937 38.0679 122.936 40.0677 122.936 40.0677Z"
                  opacity='0'/>
            <text id="cloud-text" x='93px' y='90px'></text>
            <svg id="circlesR">
                <circle cx="149.5" cy="164.5" r="6" fill="white"/>
                <circle cx="130.5" cy="148.5" r="12" fill="white"/>
            </svg>
            <svg id="circlesL">
                <circle cx="36.5" cy="164.5" r="6" transform="rotate(90 36.5 164.5)" fill="white"/>
                <circle cx="52.5" cy="145.5" r="12" transform="rotate(90 52.5 145.5)" fill="white"/>
            </svg>
        </svg>
    );
}
