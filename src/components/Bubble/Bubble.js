import {gsap} from "gsap";
import {BUBBLE_DIST} from "../Constants";
import {colorDelay, getCurrColor} from "../Stroke/StrokeColor";
import Snap from "snapsvg-cjs";
import {useEffect} from "react";
import {isRightHand} from "../Effects/Handedness";
import {sqrt} from "mathjs";

let startWhite;
let startInterval;
let endInterval;
let colourInterval;

let s;
let circle;
let speech;
let cloud;
let circlePoints;
let speechPoints;
let cloudPoints;
let bubble;
const mina = window.mina;

let prevTop;
let prevLeft;

export function showColourPreview(x, y, newTile, handChange) {
    if (newTile || handChange) {
        let loc = bubbleHelper(x, y)
        bubble.style.x = loc[0] + 'px'
        bubble.style.y = loc[1] + 'px'
    }
    // bubble.style.opacity = 0;
    gsap.killTweensOf("#bubble", "opacity");
    gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0})
    isHiding = false;

    startColourPreview()
}

let isHiding = false;

export async function hideColourPreview() {
    if (isHiding) return
    else if (!isHiding) {
        isHiding = true;
        clearInterval(colourInterval)
        document.getElementById('speech-text').innerHTML = ''
        document.getElementById('cloud-text').innerHTML = ''
        circle?.stop()
        circle?.animate({d: circlePoints}, 100, mina.linear);
        clearTimeout(startWhite)
        clearTimeout(startInterval)
        clearTimeout(endInterval)
        console.log('hiding')
        gsap.to("#bubble", {opacity: 0, duration: 1, delay: 2})

        prevTop = bubble.style.top;
        prevLeft = bubble.style.left;
    }

}

function bubbleHelper(x, y) {
    let xDist = isRightHand() ? -125 : 10;
    let newX = x + xDist
    let newY = y - BUBBLE_DIST;
    if (newX < 30) newX = 30;
    if (newX > window.innerWidth) newX = window.innerWidth;
    if (newY < 30) newY = 30;
    return [newX, newY] //top, left
    // bubble.style.top =  newY + 'px';
    // bubble.style.left = newX + 'px';
}

function pauseColourPreview() {
    clearInterval(colourInterval)
    bubble.style.setProperty('--col', "white");
}

function startColourPreview() {
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

export function toSpeech(str) {
    gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0})
    s = Snap(bubble)
    let speechType = isRightHand() ? "#speechR" : "#speechL"
    console.log(speechType)
    speech = s.select(speechType);
    speechPoints = speech?.node.getAttribute('d');

    circle?.animate({d: speechPoints}, 1500, mina.linear);
    // bubble.style.width = 140 + 'px'
    // bubble.style.height = 98 + 'px'
    startWhite = setTimeout(function () {
        pauseColourPreview()
    }, 1000);
    startInterval = setTimeout(function () {
        gsap.to("#speech-text", {opacity: 1, duration: 1.3, delay: 0})
        document.getElementById('speech-text').innerHTML = str
    }, 2000);
    endInterval = setTimeout(function () {
        circle?.animate({d: circlePoints}, 500, mina.linear);
        gsap.to("#speech-text", {opacity: 0, duration: .5, delay: 0})
        // gsap.to("#bubble", {width: 73+'px', height: 73+'px', duration: 1, delay: 1.5})
        startColourPreview()
        isHiding = false;
    }, 4000);
}

export function toCloud(s) {
    gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0})

    let cloudType = isRightHand() ? "#circlesR" : "#circlesL"
    circle?.animate({d: cloudPoints}, 1500, mina.linear);

    // bubble.style.width = 150 + 'px' //change dimensions of bounding box
    // bubble.style.height = 109 + 'px'
    startWhite = setTimeout(function () {
        pauseColourPreview()
    }, 1500);
    startInterval = setTimeout(function () {
        gsap.to("#cloud-text", {opacity: 1, duration: 1.3, delay: 0})
        gsap.to(cloudType, {opacity: 1, duration: 1, delay: 0})
        document.getElementById('cloud-text').innerHTML = s
    }, 2000);
    endInterval = setTimeout(function () {
        circle?.animate({d: circlePoints}, 500, mina.linear);
        gsap.to("#cloud-text", {opacity: 0, duration: .5, delay: 0})
        gsap.to(cloudType, {opacity: 0, duration: .5, delay: 0})
        isHiding = false;
        // gsap.to("#bubble", {width: 73+'px', height: 73+'px', duration: 1, delay: 1.5})
        startColourPreview()
    }, 4000);
}

let isMoving = false;
const delay = ms => new Promise(res => setTimeout(res, ms));

export const moveFeedback = async (prevX, prevY, x, y) => {
    if (isMoving) {
        return;
    } else if (!isMoving) {
        isMoving = true;
        console.log('in ere')
        isMoving = true;
        let loc = bubbleHelper(x, y)

        // bubble.style.transition = 'top 6s, left 6s'
        let dist = sqrt((prevY - loc[1]) ** 2 + (prevX - loc[0]) ** 2)
        console.log(dist)
        gsap.to("#bubble", {duration: dist/15, x: loc[0], y: loc[1]})
        // bubble.style.top = loc[0]
        // bubble.style.left = loc[1]
        // isMoving = false;
        await delay(6000);
        isMoving = false;
    }
    // else {
    //     isMoving = false;
    //     await delay(6000);
    //
    // }

    // gsap.to("#bubble", {duration: 1, top: loc[1]})


    // if (Math.abs(prevX - x) > 15 || Math.abs(prevY - y) > 15) {
    // bubble.style.transition = 'top 6s, left 6s'
    // gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0,})
    // bubbleHelper(x,y)
    // }
}

export default function Bubble() {
    useEffect(() => {
        bubble = document.getElementById("bubble");
        s = Snap(bubble)
        circle = s.select('#circle');
        speech = s.select('#speechR');
        cloud = s.select('#cloud');

        circlePoints = circle?.node.getAttribute('d');
        speechPoints = speech?.node.getAttribute('d');
        cloudPoints = cloud?.node.getAttribute('d');

        colorDelay()
        gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0})
        startColourPreview()

    }, []);
// viewBox="-10 -20 150 150"
    return (
        <svg id="bubble" opacity='0'> >
            <path id="circle" d=
                "M89.6371 7.13647C89.6371 7.13647 96.7017 11.3069 101.652 19.3415C106.092 27.8726 107.068 31.3795 106.502 40.8758C106.502 40.8758 105.946 48.872 101.898 55.8441C97.8493 62.8162 90.6371 67.1905 90.6371 67.1905C90.6371 67.1905 86.2974 70.2364 79.2837 72.1877C72.2699 74.139 63.784 72.0799 63.784 72.0799C63.784 72.0799 57.7876 71.5382 49.333 64.9793C40.8784 58.4204 38.7495 50.8297 38.7495 50.8297C38.7495 50.8297 34.4932 41.8756 37.0731 30.3932C38.8266 19.9809 45.51 13.3758 45.51 13.3758C45.51 13.3758 54.2604 3.51181 68.267 2.60902C80.7806 0.696059 89.6371 7.13647 89.6371 7.13647Z"
                  opacity='1'/>
            <path id="speechR" d=
                "M120 0.971771C120 0.971771 138.5 -0.499996 138.5 16.9998C138.5 26 138.5 35.6052 138.5 57.5C138.5 57.5 136.5 75 112 75C103.5 87.5003 97.5004 95.5 97.5004 95.5C97.5004 95.5 89.9999 85.0003 83.0004 75C73.9999 75 66.0004 75 66.0004 75C66.0004 75 57.9999 75 50.0003 75C39.9999 75 19.0003 75 19.0003 75C19.0003 75 0.500391 76 0.500392 54C0.500392 28.9997 1.00018 19.9998 1.00018 19.9998C1.00018 19.9998 -0.49958 0.500013 19.0003 0.500013C32.0007 0.971751 120 0.971771 120 0.971771Z"
                  opacity='0'/>
            <path id="speechL" d=
                "M122 1C122 1 139.5 1.00024 139.5 15.5C139.5 25.0001 140.066 46.0038 139.5 55.5001C139.5 55.5001 138.001 75.0001 118 75.0001C97.9998 75.0001 58.4522 75.0001 58.4522 75.0001C58.4522 75.0001 50.9522 85.5 44.4522 94.5001C38.4522 85 30.4522 75.0001 30.4522 75.0001C30.4522 75.0001 24.4999 75.0001 16.0002 75.0001C1.00031 75.0001 1.00031 56.0001 1.00031 56.0001C1.00031 56.0001 0.99938 27 0.999395 15.5001C0.999395 -3.04591e-06 18.4999 1.00005 18.4999 1.00005C18.4999 1.00005 54.0005 1.0002 68.0004 1.00011C82.0002 1.00002 122 1 122 1Z"
                  opacity='0'/>
            <text id="speech-text" x='71px' y='45px'></text>
            <path id="cloud" d=
                "M105.5 8.49984C105.5 8.49984 116.5 8.49984 123.5 20.9999C139 20.9999 144.5 33.5 145.999 38.5002C145.999 38.5002 151 60 133.499 69.5003C135 80.5 125.999 90.0003 125.999 90.0003C125.999 90.0003 113 103.5 93.4991 95.0003C83 109.5 66.4991 107 66.4991 107C66.4991 107 50 106 40.4991 88.5001C6.99959 91 2.50013 66.9998 2.50013 66.9998C2.50013 66.9998 -8.00041 38.5002 25.0001 25.9998C27.4996 4.50026 51.9997 1.49988 51.9997 1.49988C51.9997 1.49988 73.4996 -2.99976 86.9998 11.4998C96.5 6.5 105.5 8.49984 105.5 8.49984Z"
                  opacity='0'/>
            <text id="cloud-text" x='75px' y='60px'></text>
            <svg id="circlesR">
                <circle xmlns="http://www.w3.org/2000/svg" cx="132.5" cy="133.5" x='75px' y='60px' r="6" fill="white"
                        stroke="grey"/>
                <circle xmlns="http://www.w3.org/2000/svg" cx="113.5" cy="117.5" x='75px' y='60px' r="12" fill="white"
                        stroke="grey"/>
            </svg>
            <svg id="circlesL">
                <circle xmlns="http://www.w3.org/2000/svg" cx="19" cy="134" r="6" transform="rotate(90 19 134)"
                        fill="white" stroke="grey"/>
                <circle xmlns="http://www.w3.org/2000/svg" cx="35" cy="115" r="12" transform="rotate(90 35 115)"
                        fill="white" stroke="grey"/>
            </svg>
        </svg>
    );
}
