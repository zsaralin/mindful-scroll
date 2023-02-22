import {gsap} from "gsap";
import {BUBBLE_DIST} from "../Constants";
import {colorDelay, getCurrColor} from "../Stroke/StrokeColor";
import Snap from "snapsvg-cjs";
import {useEffect} from "react";
import {isRightHand} from "../Effects/Handedness";

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

export function showColourPreview(x, y, newTile) {
    if (newTile) bubbleHelper(x, y)
    // bubble.style.opacity = 0;
    gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0})
    startColourPreview()
}


export function hideColourPreview() {
    clearInterval(colourInterval)

    document.getElementById('speech-text').innerHTML = ''
    document.getElementById('cloud-text').innerHTML = ''

    circle?.stop()
    circle?.animate({d: circlePoints}, 100, mina.linear);

    clearTimeout(startWhite)
    clearTimeout(startInterval)
    clearTimeout(endInterval)

    gsap.to("#bubble", {opacity: 0, duration: 1, delay: 0})

    prevTop = bubble.style.top;
    prevLeft = bubble.style.left;
}

function bubbleHelper(x, y) {
    let newX = x - BUBBLE_DIST;
    let newY = y - BUBBLE_DIST;
    if (newX < 30) newX = 30;
    if (newX > window.innerWidth) newX = window.innerWidth;
    if (newY < 30) newY = 30;
    bubble.style.top = newY + 'px';
    bubble.style.left = newX + 'px';
}

function pauseColourPreview() {
    clearInterval(colourInterval)
    bubble.style.setProperty('--col', "white");
}

function startColourPreview() {
    clearInterval(colourInterval)
    colourInterval = setInterval(function () {
        bubble.style.setProperty('--col', getCurrColor());
    }, 1000);
}

export function resetColourPreview() {
    gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0})

    startColourPreview()
    bubble.style.top = prevTop
    bubble.style.left = prevLeft
}

export function toSpeech(str) {
    s = Snap(bubble)
    let speechType = isRightHand() ? "#speechR" : "#speechL"
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
        circle?.animate({d: circlePoints}, 1500, mina.linear);
        gsap.to("#speech-text", {opacity: 0, duration: .5, delay: 0})
        // gsap.to("#bubble", {width: 73+'px', height: 73+'px', duration: 1, delay: 1.5})
        startColourPreview()
    }, 4000);
}

export function toCloud(s) {
    let cloudType = isRightHand() ? "#circlesR" : "#circlesL"
    circle?.animate({d: cloudPoints}, 1500, mina.linear);

    // bubble.style.width = 150 + 'px' //change dimensions of bounding box
    // bubble.style.height = 109 + 'px'
    startWhite = setTimeout(function () {
        pauseColourPreview()
    }, 1500);
    startInterval = setTimeout(function () {
        gsap.to("#cloud-text", {opacity: 1, duration: 1.3, delay: 0})
        gsap.to(cloudType, {opacity: 1, duration: 1.5, delay: 0})
        document.getElementById('cloud-text').innerHTML = s
    }, 2000);
    endInterval = setTimeout(function () {
        circle?.animate({d: circlePoints}, 1500, mina.linear);
        gsap.to("#cloud-text", {opacity: 0, duration: .5, delay: 0})
        gsap.to(cloudType, {opacity: 0, duration: .5, delay: 0})

        // gsap.to("#bubble", {width: 73+'px', height: 73+'px', duration: 1, delay: 1.5})
        startColourPreview()
    }, 4000);
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
                    "M35.0018 42.0981C35.0018 42.0981 35.8131 35.4792 40.9934 27.5912C46.8392 19.954 49.6023 17.5843 58.4438 14.0733C58.4438 14.0733 65.9222 11.1883 73.9529 11.9013C81.9836 12.6142 89.0017 17.2935 89.0017 17.2935C89.0017 17.2935 93.5995 19.9338 98.3388 25.46C103.078 30.9862 104.809 39.5451 104.809 39.5451C104.809 39.5451 106.859 45.2061 104.5 55.6434C102.142 66.0807 96.168 71.2253 96.168 71.2253C96.168 71.2253 89.8609 78.8747 78.3671 81.4031C68.1926 84.2267 59.3779 80.9717 59.3779 80.9717C59.3779 80.9717 46.7355 77.2252 39.9829 64.9206C32.9479 54.3964 35.0018 42.0981 35.0018 42.0981Z"
                  opacity='1' />
            <path id="speechR" d=
                "M1.00554 18.5C1.00554 18.5 0.00194168 1 25.0016 1C52.0016 0.999999 58.0019 1 58.0019 1C58.0019 1 73.1962 1 83.1981 1C93.2001 1 79.5 1 104.002 1C135.5 1 138.502 2.8184 138.502 25.5C138.502 43.3184 138.502 60 138.502 60C138.502 60 138.698 75.5 111.698 75.5C107.2 81 97.6981 94.6816 97.6981 94.6816C97.6981 94.6816 84.5019 75.5 83.1981 75.5C81.9865 75.5 21.6997 75.5 21.6997 75.5C21.6997 75.5 1.0046 74.5 1.00554 60C1.00607 52 1.00554 18.5 1.00554 18.5Z"
                  opacity='0'/>
            <path id="speechL" d=
                "M1.00554 18.5C1.00554 18.5 0.00194168 1 25.0016 1C52.0016 0.999999 58.0019 1 58.0019 1C58.0019 1 73.1962 1 83.1981 1C93.2001 1 79.5 1 104.002 1C135.5 1 138.502 2.8184 138.502 25.5C138.502 43.3184 138.502 60 138.502 60C138.502 60 138.698 75.5 111.698 75.5C108 75.5 52.5 75.5 52.5 75.5C52.5 75.5 51.5 77.5 40.1981 93.5C29.5 77 27.6997 75.5 27.6997 75.5C27.6997 75.5 1.00421 75.5 1.00554 55C1.00607 47 1.00554 18.5 1.00554 18.5Z"
                  opacity='0'/>
            <text id="speech-text" x='71px' y='45px'></text>
            <path id="cloud" d=
                "M25.3054 25.6816C25.3054 25.6816 27.3053 7.68161 47.3055 2.68161C74.3053 -4.06825 86.8054 11.6816 86.8054 11.6816C86.8054 11.6816 93.9129 7.72053 104.805 8.68161C115.698 9.64269 123.806 21.1816 123.806 21.1816C126.898 19.6914 144.305 25.6816 146.805 42.6816C149.305 59.6816 133.806 69.6816 133.806 69.6816C133.806 69.6816 135.055 84.1816 122.305 93.1816C109.556 102.182 93.3054 95.1816 93.3054 95.1816C93.3054 95.1816 82.3052 109.085 64.3052 106.182C46.3052 103.279 40.3055 88.6816 40.3055 88.6816C40.3055 88.6816 7.80522 94.1816 1.80521 64.1816C-4.19481 34.1816 25.3054 25.6816 25.3054 25.6816Z"
                  opacity='0'/>
            <text id="cloud-text" x='75px' y='60px'></text>
            <svg id="circlesR">
                <circle xmlns="http://www.w3.org/2000/svg" cx="132.5" cy="133.5" x='75px' y='60px' r="6" fill="white"
                        stroke="grey"/>
                <circle xmlns="http://www.w3.org/2000/svg" cx="113.5" cy="117.5" x='75px' y='60px' r="12" fill="white"
                        stroke="grey"/>
            </svg>
            <svg id="circlesL">
                <circle xmlns="http://www.w3.org/2000/svg" cx="19" cy="134" r="6" transform="rotate(90 19 134)" fill="white" stroke="grey"/>
                <circle xmlns="http://www.w3.org/2000/svg" cx="35" cy="115" r="12" transform="rotate(90 35 115)" fill="white" stroke="grey"/>
            </svg>
        </svg>
    );
}
