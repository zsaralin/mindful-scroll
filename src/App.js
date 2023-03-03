import './App.css';
import './components/Bubble/Bubble.css';
import {useEffect, useRef} from "react";
import {Helmet} from "react-helmet";
import Music, {changeAudio, reduceAudio, triggerAudio} from './components/Audio.js'
import {drawClover, drawFlower, drawStroke} from './components/Stroke/Stroke'
import {drawShrinkingStroke, isShrinkStroke} from './components/Stroke/ShrinkingStroke'
import {stopColorChange, colorDelay, getCurrColor} from './components/Stroke/StrokeColor'
import {pushStroke, pushShrinkingLine, removeLastStroke} from './components/Stroke/StrokeArr'
import {addToTilingArr, getYMax, redrawTilings, sumArray} from "./components/Tiling/TilingArr";
import {getOffsetY} from './components/Scroll/Offset'
import {
    doScroll, endScroll,
    redrawCanvas,
    redrawCanvas2, setUpCanvas, startScroll,
    triggerScroll
} from "./components/Scroll/PageScroll";
import {watercolor} from "./components/Effects/Watercolor";
import {
    changeLineWidth,
    getLineWidth,
    reduceLineWidth,
    resetLineWidth,
    setLineWidth
} from "./components/Stroke/StrokeWidth";
import {changeBool, getFillMin, getFillRatio, isCircleInPath} from "./components/Effects/FillRatio";
import {BUBBLE_DIST, FILL_RATIO, SCROLL_DELTA, SCROLL_DIST, SHAPE_COLOR, SWIPE_THRESHOLD} from "./components/Constants";
import {completeTile, fillEachPixel, triggerCompleteTile} from "./components/Tile/CompleteTile";
import {gsap} from "gsap";
import {shapeGlow} from "./components/Tile/Shape";
import ControlPanel, {hideControlPanel, isPanelOn, showControlPanel} from "./components/ControlPanel/ControlPanel";
import Bubble, {
    hideColourPreview,
    showColourPreview,
    toCloud,
    toSpeech
} from "./components/Bubble/Bubble";
import {getTile} from "./components/Tiling/Tiling2";
import {isSlowScrollOn} from "./components/Scroll/SlowScroll";
import {startAutoScroll} from "./components/Scroll/AutoScroll";
import {getHandChange, handChanged, isRightHand, setHand, setHandChanged} from "./components/Effects/Handedness";


function App() {
    const canvas = useRef();
    let ctx;
    let invisCol; // color of tile on invisible buffer canvas
    let currTile;
    let prevTile;

    // mouse functions
    let leftMouseDown = false;
    let rightMouseDown = false;

    let mouseSpeed = [];
    let touchSpeed = [];

    let startX;
    let startY;

    // coordinates of our cursor
    let cursorX;
    let cursorY;
    let prevCursorX;
    let prevCursorY;

    let d; // scroll distance (change in y)

    let insidePoly = [0, 0] // number of points inside and outside polygon
    let tooFast = false;
    let watercolorTimer;

    let hidePreviewInterval;
    let ratio = 0;


    function toTrueY(y) {
        return (y) + getOffsetY();
    }

    useEffect(() => {
        const canvasIds = ['tiling-canvas', 'off-canvas', 'invis-canvas', 'canvas', 'fill-canvas'];

        canvasIds.forEach(id => {
            const canvas = document.getElementById(id);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 9;
        });
        setUpCanvas()
        ctx = document.getElementById('invis-canvas').getContext("2d");
        d = SCROLL_DIST
    }, []);

    let currColor;
    function onStrokeStart(prevScaledX, prevScaledY, x) {
        invisCol = ctx.getImageData(prevScaledX, prevScaledY, 1, 1).data.toString()
        currTile = getTile(x, invisCol)
        currColor = getCurrColor()
        if (currTile && isCircleInPath(currTile.path, prevScaledX, prevScaledY)) {
            pushStroke(currTile, prevScaledX, prevScaledY, prevScaledX, touchType === "direct" ? prevScaledY + .5: prevScaledY, currColor);
            drawStroke(prevScaledX, prevScaledY, prevScaledX, touchType === "direct" ? prevScaledY + .5: prevScaledY, currColor);
            watercolorTimer = setTimeout(watercolor, 1500, prevScaledX, prevScaledY, 25, currTile)
            if (currTile.firstCol === "white") currTile.firstCol = currColor
            // currTile.colors.push(getCurrColor())
            if (!currTile.filled && getFillRatio(currTile) > getFillMin()) completeTile(currTile)
        } else {
            startX = prevCursorX;
            startY = prevCursorY;
        }
    }

    function onStrokeMove(prevScaledX, prevScaledY, scaledX, scaledY, speed){
        insidePoly[0] += 1;
        // moveFeedback(prevCursorX, prevCursorY, cursorX, cursorY)
        // scroll when dragging on white space
        if (invisCol && invisCol === '0,0,0,0' && ctx.getImageData(scaledX, scaledY, 1, 1).data.toString().trim() === '0,0,0,0') {
            doubleTouch = true; rightMouseDown = true;
            startScroll(Math.abs(speed[1]), prevCursorY, cursorY)
        }
        if (currTile && isCircleInPath(currTile.path, prevScaledX, prevScaledY) && isCircleInPath(currTile.path, scaledX, scaledY)) {
            hideColourPreview()
            if (!currTile.filled && getFillRatio(currTile) > getFillMin()) {
                currTile.filled = true;
                completeTile(currTile, invisCol)
            }
            if ((isShrinkStroke() && (Math.abs(speed[0]) > 10 || Math.abs(speed[1]) > 10))) {
                pushShrinkingLine(currTile, prevScaledX, prevScaledY, scaledX, scaledY, currColor);
                drawShrinkingStroke(prevScaledX, prevScaledY, scaledX, scaledY, currColor);
                tooFast = true;
            } else {
                pushStroke(currTile, prevScaledX, prevScaledY, scaledX, scaledY, currColor);
                drawStroke(prevScaledX, prevScaledY, scaledX, scaledY, currColor);
            }
            changeAudio(mouseSpeed)
            startAutoScroll(cursorY);
        } else {
            insidePoly[1] += 1;
        }
    }

    function onMouseDown(event) {
        let strokeR = getLineWidth() / 2 // stroke radius
        // detect left clicks
        if (event.button === 0) {
            leftMouseDown = true;
            rightMouseDown = false;
            const prevScaledX = prevCursorX;
            const prevScaledY = toTrueY(prevCursorY);
            onStrokeStart(prevScaledX, prevScaledY, cursorX)
        }
        // detect right clicks
        if (event.button === 2) {
            rightMouseDown = true;
            leftMouseDown = false;
        }
        // update the cursor coordinates
        prevCursorX = event.pageX - strokeR;
        prevCursorY = event.pageY - strokeR;

    }

    function onMouseMove(event) {
        // get mouse position
        let strokeR = getLineWidth() / 2
        cursorX = event.pageX - strokeR;
        cursorY = event.pageY - strokeR;
        const scaledX = cursorX;
        const scaledY = toTrueY(cursorY);
        const prevScaledX = prevCursorX;
        const prevScaledY = toTrueY(prevCursorY);
        mouseSpeed = [event.movementX, event.movementY] // speed of stroke

        clearTimeout(watercolorTimer)
        if (leftMouseDown) {
            onStrokeMove(prevScaledX, prevScaledY, scaledX, scaledY,mouseSpeed)
        } else if (rightMouseDown) {
            startScroll(Math.abs(mouseSpeed[1]), prevCursorY, cursorY)
        }
        prevCursorX = cursorX ;
        prevCursorY = cursorY;

    }

    function onMouseUp() {
        if (rightMouseDown === false) { // do not move colour preview when triggering control panel
            if (!isPanelOn()) {
                showColourPreview(cursorX, cursorY, prevTile !== currTile, getHandChange);
                onStrokeEnd()
            }
        }

        startX = undefined;
        startY = undefined;
        leftMouseDown = false;
        rightMouseDown = false;
        endScroll();


    }

    // touch functions
    const prevTouches = [null, null]; // up to 2 touches
    let singleTouch = false;
    let doubleTouch = false;
    let timerId;
    let angle = 0;

    let touchType;

    function onTouchStart(event) {
        touchType = event.touches[0]?.touchType;
        if (event.touches.length === 1) {
            if(event.touches[0]?.touchType === "stylus") {
                angle = event.touches[0].azimuthAngle;
                if(angle < 4.7 && angle > 1.5 && isRightHand()){ // left hand
                    setHand("left")
                    setHandChanged(true)
                }
                else if(angle >= 4.7 && angle <= 1.5 && !isRightHand()) {
                    setHand('right')
                    setHandChanged(true)
                }
                document.getElementById("angle").innerHTML = event.touches[0]["force"];
            }
            let r = getLineWidth() / 2
            singleTouch = true;
            doubleTouch = false;
            const touch0X = event.touches[0]?.pageX - r;
            const touch0Y = event.touches[0]?.pageY - r;

            const scaledX = touch0X;
            const scaledY = toTrueY(touch0Y);

            onStrokeStart(scaledX, scaledY, touch0X)

        }
        else if (event.touches.length >= 2) {
            removeLastStroke(event.touches[0], event.touches[1], getOffsetY())
            singleTouch = false;
            doubleTouch = true;
        }

        // store the last touches
        prevTouches[0] = event.touches[0];
        prevTouches[1] = event.touches[1];

        cursorX = event.touches[0].pageX
        cursorY = event.touches[0].pageY

        prevCursorX = prevTouches[0].pageX
        prevCursorY = prevTouches[0].pageY
    }

    let firstMove = false;

    function onTouchMove(event) {
        let r = getLineWidth() / 2

        const touch0X = event.touches[0].pageX - r;
        const touch0Y = event.touches[0].pageY - r;
        const prevTouch0X = prevTouches[0]?.pageX - r;
        const prevTouch0Y = prevTouches[0]?.pageY - r;

        cursorX = event.touches[0].pageX - r;
        cursorY = event.touches[0].pageY - r;

        const scaledX = touch0X;
        const scaledY = toTrueY(touch0Y);
        const prevScaledX = prevTouch0X;
        const prevScaledY = toTrueY(prevTouch0Y);

        clearTimeout(watercolorTimer)
        touchSpeed = [touch0X - prevTouch0X, touch0Y - prevTouch0Y]

        if (singleTouch) {
            onStrokeMove(prevScaledX,prevScaledY, scaledX,scaledY, touchSpeed)
        } else if (doubleTouch) {
            startScroll(Math.abs(touchSpeed[1]), prevCursorY, cursorY)
        }
        prevTouches[0] = event.touches[0];
        prevTouches[1] = event.touches[1];

        prevCursorX = cursorX
        prevCursorY = cursorY
    }

    function callRatio(currTile) {
        clearInterval(timerId)

        timerId = setInterval(function () {
            ratio = getFillRatio(currTile)
        }, 500);

    }

    function onTouchEnd(event) {
        if (!doubleTouch) {
            if (!isPanelOn()) {
                showColourPreview(prevTouches[0]?.pageX, prevTouches[0]?.pageY, prevTile !== currTile, getHandChange())
                onStrokeEnd()
            }
        }

        singleTouch = false;
        doubleTouch = false;
        endScroll();

        startX = undefined;
        startY = undefined;

    }

    function onStrokeEnd() {
        resetLineWidth()
        reduceAudio()
        colorDelay()
        clearTimeout(watercolorTimer)
        clearInterval(reduceOpac)
        sendAlert()
        insidePoly = [0, 0]
        tooFast = false;
        prevTile = currTile;
        clearTimeout(hidePreviewInterval)
        clearInterval(timerId)
        ratio = 0;
        firstMove = false;
        setHandChanged(false)
    }

    let reduceOpac;

    function reduceOpacityFeedback() {
        let opacity = 0
        let increaseOpac = true;
        reduceOpac = setInterval(function () {
            if (opacity < 1 && increaseOpac) {
                opacity = opacity + .1;
            } else {
                increaseOpac = false;
                opacity = opacity - .1
            }
            document.getElementById("feedbackBar").style.color = 'rgba(0,0,0,' + opacity + ')'
            if (opacity <= 0) {
                clearInterval(reduceOpac)
            }
        }, 100)
    }

    function moveFeedback(prevX, prevY, x, y) {
        if (Math.abs(prevX - x) > 15 || Math.abs(prevY - y) > 15) {
            // bubble.style.transition = 'top 6s, left 6s'
            gsap.to("#bubble", {opacity: 1, duration: 1, delay: 0,})
            // bubbleHelper(x,y)
        }
    }

    function showFeedback(x, y) {
        // circle?.animate({ d: cloudPoints }, 1500, mina.easeout);
        // bubble.style.transition = 'top 10s, left 10s'
        // bubbleHelper(x,y)
        // gsap.to(".thought", {opacity: 1, duration: 1, delay: 0,})
    }

    let slowArr = ['slow', 'soften', 'release', 'calm', 'rest', 'ease', 'soothe', 'relax']
    let goodArr = ['good', 'feel', 'grow', 'unwind', 'embrace', 'observe', 'reflect',]
    let focusArr = ['focus', 'notice', 'recognize', "concentrate", "center"]

    let word = ''

    function generateAlert() {
        console.log('in speech')

        let insideRatio = insidePoly[1] / insidePoly[0]
        console.log(insideRatio)
        if (tooFast) {
            word = slowArr[Math.floor(Math.random() * slowArr.length)]
            toSpeech(word)
        } else if (insideRatio >= .6) {
            toSpeech(focusArr[Math.floor(Math.random() * focusArr.length)])
        } else if (insideRatio < 0.5 && insidePoly[0] !== 0) {
            toCloud(goodArr[Math.floor(Math.random() * goodArr.length)])
        }
    }

    function sendAlert() {
        if (!isPanelOn()) generateAlert()
    }


    return (
        <div className="App">
            <style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400&display=swap');</style>
            <Helmet>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            </Helmet>
            <button id = "cp-button" onClick = {showControlPanel}></button>
            <ControlPanel/>
            <div id="feedbackBar"></div>
            {/*<div id = "angle" style = {{position: "absolute", top: 0}}> {angle}</div>*/}
            <div id="thought" style={{transform: 'scale(.9)',}}></div>
            <Music/>
            <div className="wrapper">
                <canvas id="fill-canvas"></canvas>
                <canvas ref={canvas} id="canvas"></canvas>
                <canvas id="invis-canvas" style={{display: 'none',}}
                ></canvas>
                <canvas id="off-canvas" style={{display: 'none', background: ''}}
                ></canvas>
                <canvas id="tiling-canvas" style={{display: '', background: ''}}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        onTouchCancel={onTouchEnd}
                        onTouchMove={onTouchMove}
                >
                </canvas>
                <Bubble/>

            </div>
        </div>
    );
}

export default App;