import './App.css';
import './components/Bubble/Bubble.css';
import {useEffect, useRef} from "react";
import {Helmet} from "react-helmet";
import Music, {changeAudio, reduceAudio, triggerAudio} from './components/Audio.js'
import {drawStroke} from './components/Stroke/Stroke'
import {drawShrinkingStroke, isShrinkStroke} from './components/Stroke/ShrinkingStroke'
import {stopColorChange, colorDelay, getCurrColor} from './components/Stroke/StrokeColor'
import {pushStroke, pushShrinkingLine, removeLastStroke} from './components/Stroke/StrokeArr'
import {addToTilingArr, getTile, redrawTilings} from "./components/Tiling/TilingArr";
import {doScroll, getOffsetY, startAutoScroll, triggerScroll} from "./components/PageScroll";
import {watercolor} from "./components/Effects/Watercolor";
import {changeLineWidth, reduceLineWidth, resetLineWidth, setLineWidth} from "./components/Stroke/StrokeWidth";
import {getFillRatio} from "./components/Effects/FillRatio";
import {BUBBLE_DIST, FILL_RATIO, SHAPE_COLOR} from "./components/Constants";
import {completeTile, triggerCompleteTile} from "./components/Tile/CompleteTile";
import {gsap} from "gsap";
import {shapeGlow} from "./components/Tile/Shape";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {Stack, styled} from "@mui/material";
import {SwitchProps} from "@mui/material/Switch";
import SliderGrey from "./components/ControlPanel/SliderGrey";
import ControlPanel, {hideControlPanel, isPanelOn, showControlPanel} from "./components/ControlPanel/ControlPanel";
import SwitchGrey, {IOSSwitch} from "./components/ControlPanel/SwitchGrey";
import {findDir} from "./components/Effects/Pattern";
import Bubble, {
    hideColourPreview, resetColourPreview,
    showColourPreview,
    toCloud,
    toSpeech
} from "./components/Bubble/Bubble";
import Snap from 'snapsvg-cjs'


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
    let endX;
    let endY;

    // coordinates of our cursor
    let cursorX;
    let cursorY;
    let prevCursorX;
    let prevCursorY;

    // color of tile on invisible buffer canvas

    let insidePoly = [0, 0] // number of points inside and outside polygon
    let tooFast = false;
    let expandTimer;

    function toTrueY(y) {
        return (y) + getOffsetY();
    }

    useEffect(() => {
        addToTilingArr()
        const canvas = document.getElementById("canvas");
        const invisCanvas = document.getElementById("invis-canvas")
        const tilingCanvas = document.getElementById("tiling-canvas")
        const fillCanvas = document.getElementById("fill-canvas")


        // set the canvas to the size of the window
        canvas.width = invisCanvas.width = tilingCanvas.width = fillCanvas.width = window.innerWidth;
        canvas.height = invisCanvas.height = tilingCanvas.height  = fillCanvas.height = window.innerHeight*3;

        console.log('inner height ' + window.innerHeight*2)

        ctx = document.getElementById('invis-canvas').getContext("2d", { alpha: false });

        redrawTilings();
        hideControlPanel()

    }, []);

    let hidePreviewInterval;

    function onMouseDown(event) {
        // detect left clicks
        if (event.button === 0) {
            leftMouseDown = true;
            rightMouseDown = false;
            const prevScaledX = prevCursorX;
            const prevScaledY = toTrueY(prevCursorY);
            stopColorChange()

            hidePreviewInterval = setTimeout(hideColourPreview, 1000)

            // showFeedback(cursorX, cursorY)
            clearTimeout(expandTimer)

            invisCol = ctx.getImageData(prevCursorX, prevScaledY, 1, 1).data.toString()

            currTile = getTile(prevCursorY, invisCol)
            console.log('is it trueeee ? ' +  currTile)
            if (currTile && ctx.isPointInPath(currTile.path, prevCursorX, prevScaledY)) {
                pushStroke(prevScaledX, prevScaledY, prevScaledX, prevScaledY);
                drawStroke(prevScaledX, prevScaledY, prevScaledX, prevScaledY);

                expandTimer = setTimeout(watercolor, 1500, prevScaledX, prevScaledY, 25, currTile)
                if (!currTile.filled && getFillRatio(currTile) > FILL_RATIO) {
                    completeTile(currTile, getCurrColor())
                    if (`rgb(${invisCol.substring(0, 7)})` === SHAPE_COLOR) {
                        shapeGlow(currTile)
                    }
                }
            } else {
                startX = prevCursorX;
                startY = prevCursorY;
            }
        }

        // detect right clicks
        if (event.button === 2) {
            rightMouseDown = true;
            leftMouseDown = false;
        }

        // update the cursor coordinates
        cursorX = event.pageX
        cursorY = event.pageY;
        prevCursorX = event.pageX;
        prevCursorY = event.pageY;

        // cursorX = (event.pageX / 16) - (45 / 16) + 'rem'
        // cursorY = (event.pageY / 16) - (45 / 16) + 'rem'
        // prevCursorX = (event.pageX / 16) - (45 / 16) + 'rem'
        // prevCursorY = (event.pageY / 16) - (45 / 16) + 'rem'
    }

    function onMouseMove(event) {
        // get mouse position
        cursorX = event.pageX;
        cursorY = event.pageY;
        const scaledX = cursorX;
        const scaledY = toTrueY(cursorY);
        const prevScaledX = prevCursorX;
        const prevScaledY = toTrueY(prevCursorY);

        if (cursorX <= 0 || cursorY >= canvas.height) {
            return
        }
        clearTimeout(expandTimer)


        if (leftMouseDown) {
            insidePoly[0] += 1;

            // moveFeedback(prevCursorX, prevCursorY, cursorX, cursorY)

            if (currTile && ctx.isPointInPath(currTile.path, prevCursorX, prevScaledY) && ctx.isPointInPath(currTile.path, cursorX, scaledY)) {
                mouseSpeed = [event.movementX, event.movementY] // speed of stroke
                hideColourPreview()
                if (!currTile.filled && getFillRatio(currTile) > FILL_RATIO) {
                    completeTile(currTile, getCurrColor())
                    if (`rgb(${invisCol.substring(0, 7)})` === SHAPE_COLOR) {
                        shapeGlow(currTile)
                    }
                }

                if ((Math.abs(mouseSpeed[0]) > 10 || Math.abs(mouseSpeed[1]) > 10) && isShrinkStroke()) {
                    pushShrinkingLine(prevScaledX, prevScaledY, scaledX, scaledY);
                    drawShrinkingStroke(prevScaledX, prevScaledY, scaledX, scaledY);
                    reduceLineWidth()
                    tooFast = true;
                } else {
                    // setLineWidth(mouseSpeed)
                    pushStroke(prevScaledX, prevScaledY, scaledX, scaledY);
                    drawStroke(prevScaledX, prevScaledY, scaledX, scaledY);
                }
                changeAudio(mouseSpeed)
                startAutoScroll(cursorY);
            } else {
                insidePoly[1] += 1;
            }
        } else if (rightMouseDown) {
            doScroll(cursorY, prevCursorY)
        } else {
        }
        prevCursorX = cursorX;
        prevCursorY = cursorY;

    }


    function onMouseUp() {
        isSwiped(startX, prevCursorX)

        if (rightMouseDown == false) { // do not move colour preview when triggering control panel
            if (!isPanelOn()) {
                showColourPreview(cursorX, cursorY, prevTile !== currTile);
                onStrokeEnd()
            } else resetColourPreview()
        }
        leftMouseDown = false;
        rightMouseDown = false;
        // onStrokeEnd()
        // hideFeedback()

        // isSwiped(startX, prevCursorX)
        findDir(startX, startY, prevCursorX, prevCursorY)
        startX = undefined;
        startY = undefined;

    }

    // touch functions
    const prevTouches = [null, null]; // up to 2 touches
    let singleTouch = false;
    let doubleTouch = false;

    function onTouchStart(event) {
        if (event.touches.length === 1) {
            singleTouch = true;
            doubleTouch = false;
            const touch0X = event.touches[0].pageX;
            const touch0Y = event.touches[0].pageY;
            const prevTouch0X = prevTouches[0]?.pageX;
            const prevTouch0Y = prevTouches[0]?.pageY;

            const scaledX = touch0X;
            const scaledY = toTrueY(touch0Y);
            invisCol = ctx.getImageData(touch0X, touch0Y, 1, 1).data.toString()
            currTile = getTile(touch0Y, invisCol)

            hideColourPreview()
            // showFeedback(touch0X, touch0Y)

            if (currTile && ctx.isPointInPath(currTile.path, prevTouch0X, prevTouch0Y)) {
                pushStroke(scaledX, scaledY, scaledX, scaledY + 0.5)
                drawStroke(scaledX, scaledY, scaledX, scaledY + 0.5)
                expandTimer = setTimeout(watercolor, 1500, scaledX, scaledY, 25, currTile)
                if (getFillRatio(currTile) > FILL_RATIO) {
                    completeTile(currTile, getCurrColor())
                    if (`rgb(${invisCol.substring(0, 7)})` === SHAPE_COLOR) {
                        shapeGlow(currTile)
                    }
                }
            } else {
                startX = touch0X;
                startY = touch0Y;
            }

            stopColorChange()
        }

        if (event.touches.length >= 2) {
            removeLastStroke(event.touches[0], event.touches[1], getOffsetY())
            singleTouch = false;
            doubleTouch = true;
        }

        // store the last touches
        prevTouches[0] = event.touches[0];
        prevTouches[1] = event.touches[1];

    }

    function onTouchMove(event) {
        const touch0X = event.touches[0].pageX;
        const touch0Y = event.touches[0].pageY;
        const prevTouch0X = prevTouches[0]?.pageX;
        const prevTouch0Y = prevTouches[0]?.pageY;

        const scaledX = touch0X;
        const scaledY = toTrueY(touch0Y);
        const prevScaledX = prevTouch0X;
        const prevScaledY = toTrueY(prevTouch0Y);

        clearTimeout(expandTimer)
        hideColourPreview()

        if (singleTouch) {
            insidePoly[0] += 1;

            // scroll when dragging on white space
            if (invisCol && invisCol === '0,0,0,0' && ctx.getImageData(touch0X, touch0Y, 1, 1).data.toString().trim() === '0,0,0,0') {
                doubleTouch = true;
                doScroll(touch0Y, prevTouch0Y)
            }

            if (currTile && ctx.isPointInPath(currTile.path, prevTouch0X, prevTouch0Y) && ctx.isPointInPath(currTile.path, touch0X, touch0Y)) {
                touchSpeed = [touch0X - prevTouch0X, touch0Y - prevTouch0Y]
                moveFeedback(prevTouch0X, prevTouch0Y, touch0X, touch0Y)

                if (getFillRatio(currTile) > FILL_RATIO) {
                    completeTile(currTile, getCurrColor())
                    if (`rgb(${invisCol.substring(0, 7)})` === SHAPE_COLOR) {
                        shapeGlow(currTile)
                    }
                }
                if ((Math.abs(touchSpeed[0]) > 10 || Math.abs(touchSpeed[1]) > 10) && isShrinkStroke()) {
                    pushShrinkingLine(prevScaledX, prevScaledY, scaledX, scaledY);
                    drawShrinkingStroke(prevScaledX, prevScaledY, scaledX, scaledY);
                    reduceLineWidth()
                    tooFast = true;
                } else {
                    // setLineWidth(touchSpeed)
                    pushStroke(prevScaledX, prevScaledY, scaledX, scaledY)
                    drawStroke(prevScaledX, prevScaledY, scaledX, scaledY)
                }
                // speed of stroke
                changeAudio(touchSpeed)
                startAutoScroll(touch0Y);

            } else {
                insidePoly[1] += 1;
            }
        } else if (doubleTouch) {
            doScroll(touch0Y, prevTouch0Y)
        }
        prevTouches[0] = event.touches[0];
        prevTouches[1] = event.touches[1];
    }

    function onTouchEnd(event) {
        if (!doubleTouch) {
            showColourPreview(prevTouches[0]?.pageX, prevTouches[0]?.pageY, prevTile !== currTile)
        }
        // hideFeedback()
        singleTouch = false;
        doubleTouch = false;
        onStrokeEnd()

        isSwiped(startX, prevTouches[0]?.pageX)
    }

    function onStrokeEnd() {
        resetLineWidth()
        reduceAudio()
        colorDelay()
        clearTimeout(expandTimer)
        clearInterval(reduceOpac)
        sendAlert()
        insidePoly = [0, 0]
        tooFast = false;
        prevTile = currTile;
        clearTimeout(hidePreviewInterval)
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
    let goodArr = ['good', 'feel', 'grow', 'unwind', 'embrace', 'observe', 'reflect', ]
    let focusArr = ['focus', 'notice', 'recognize', "concentrate", "center"]

    let word = ''

    function generateAlert() {
        let ratio = insidePoly[1] / insidePoly[0]
        if (tooFast) {
            word = slowArr[Math.floor(Math.random() * slowArr.length)]
            toSpeech(word)
        } else if (ratio >= 1) {
            toSpeech(focusArr[Math.floor(Math.random() * focusArr.length)])
        } else if (ratio < 0.5 && insidePoly[0] !== 0) {
            toCloud(goodArr[Math.floor(Math.random() * goodArr.length)])
        }
    }

    function sendAlert() {
        if (!isPanelOn()) generateAlert()
        // let prevFeedback = document.getElementById('alert').innerHTML;
        // let returnFeedback = generateAlert()
        // document.getElementById('alert').innerHTML = returnFeedback

        // if (prevFeedback === returnFeedback) {
        //     document.getElementById('alert').innerHTML = ''
        // } else if (returnFeedback !== '') {
        //     document.getElementById('alert').innerHTML = returnFeedback
        // }
    }

    function isSwiped(startX, endX) {
        if (startX < endX && startX < 50) {
            showControlPanel()
        }
    }

    return (
        <div className="App">
            <Helmet>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            </Helmet>
            <ControlPanel/>
            <div id="feedbackBar"></div>
            <div id="thought" style={{transform: 'scale(.7)',}}></div>
            <Music/>
            <div className="wrapper">
                <canvas id="fill-canvas"></canvas>
                <canvas ref={canvas} id="canvas"></canvas>
                <canvas id="invis-canvas" style={{display: 'none'}}
                ></canvas>
                <canvas id="tiling-canvas" style={{display: ''}}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        onTouchCancel={onTouchEnd}
                        onTouchMove={onTouchMove}
                ></canvas>
            </div>
            <Bubble/>
        </div>
    );
}

export default App;