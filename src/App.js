import './App.css';
import {useEffect, useRef} from "react";
import {Helmet} from "react-helmet";
import Music, {changeAudio, reduceAudio, triggerAudio} from './components/Audio.js'
import {drawStroke} from './components/Stroke/Stroke'
import {drawShrinkingStroke} from './components/Stroke/ShrinkingStroke'
import {stopColorChange, colorDelay, getCurrColor} from './components/Stroke/StrokeColor'
import {pushStroke, pushShrinkingLine, removeLastStroke} from './components/Stroke/StrokeArr'
import {addToTilingArr, getTile, redrawTilings} from "./components/Tiling/TilingArr";
import {doScroll, getOffsetY, startAutoScroll, triggerScroll} from "./components/PageScroll";
import {watercolor} from "./components/Effects/Watercolor";
import {changeLineWidth, reduceLineWidth, resetLineWidth, setLineWidth} from "./components/Stroke/StrokeWidth";
import {getFillRatio} from "./components/Effects/FillRatio";
import {FILL_RATIO, SHAPE_COLOR} from "./components/Constants";
import {completeTile, triggerCompleteTile} from "./components/Tile/CompleteTile";
import {gsap} from "gsap";
import {shapeGlow} from "./components/Tile/Shape";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {Stack, styled} from "@mui/material";
import {SwitchProps} from "@mui/material/Switch";
import SliderGrey from "./components/ControlPanel/SliderGrey";
import ControlPanel, {hideControlPanel, showControlPanel} from "./components/ControlPanel/ControlPanel";
import SwitchGrey, {IOSSwitch} from "./components/ControlPanel/SwitchGrey";


function App() {
    const canvas = useRef();
    let ctx;
    let invisCol; // color of tile on invisible buffer canvas
    let currTile;

    // mouse functions
    let leftMouseDown = false;
    let rightMouseDown = false;

    let mouseSpeed = [];
    let touchSpeed = [];

    let startX;
    let endX;

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

        // set the canvas to the size of the window
        canvas.width = invisCanvas.width = tilingCanvas.width = window.innerWidth;
        canvas.height = invisCanvas.height = tilingCanvas.height = window.innerHeight;
        ctx = document.getElementById('invis-canvas').getContext("2d");

        redrawTilings();
        hideControlPanel()
    }, []);

    function onMouseDown(event) {
        // detect left clicks
        if (event.button === 0) {
            leftMouseDown = true;
            rightMouseDown = false;
            const prevScaledX = prevCursorX;
            const prevScaledY = toTrueY(prevCursorY);
            stopColorChange()
            hideColourPreview()
            showFeedback(cursorX, cursorY)
            clearTimeout(expandTimer)

            invisCol = ctx.getImageData(cursorX, cursorY, 1, 1).data.toString()
            currTile = getTile(prevCursorY, invisCol)
            if (currTile && ctx.isPointInPath(currTile.path, prevCursorX, prevCursorY)) {
                pushStroke(prevScaledX, prevScaledY, prevScaledX, prevScaledY);
                drawStroke(prevScaledX, prevScaledY, prevScaledX, prevScaledY);

                expandTimer = setTimeout(watercolor, 1500, prevScaledX, prevScaledY, 25, currTile)
                if (getFillRatio(currTile) > FILL_RATIO) {
                    completeTile(currTile, getCurrColor())
                    if (`rgb(${invisCol.substring(0, 7)})` === SHAPE_COLOR) {
                        shapeGlow(currTile)
                    }
                }
            } else {
                startX = prevCursorX;
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

            moveFeedback(prevCursorX, prevCursorY, cursorX, cursorY)

            if (currTile && ctx.isPointInPath(currTile.path, prevCursorX, prevCursorY) && ctx.isPointInPath(currTile.path, cursorX, cursorY)) {
                mouseSpeed = [event.movementX, event.movementY] // speed of stroke
                if (getFillRatio(currTile) > FILL_RATIO) {
                    completeTile(currTile, getCurrColor())
                    if (`rgb(${invisCol.substring(0, 7)})` === SHAPE_COLOR) {
                        shapeGlow(currTile)
                    }
                }

                if ((Math.abs(mouseSpeed[0]) > 10 || Math.abs(mouseSpeed[1]) > 10)) {
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

    let colourInterval;

    function onMouseUp() {
        if (rightMouseDown == false) {
            showColourPreview(cursorX, cursorY);
        }
        leftMouseDown = false;
        rightMouseDown = false;
        onStrokeEnd()
        hideFeedback()

        isSwiped(startX, prevCursorX)
        startX = undefined
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
            showFeedback(touch0X, touch0Y)

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
            } else startX = touch0X

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
                if ((Math.abs(touchSpeed[0]) > 10 || Math.abs(touchSpeed[1]) > 10)) {
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
            showColourPreview(prevTouches[0]?.pageX, prevTouches[0]?.pageY)
        }
        hideFeedback()
        singleTouch = false;
        doubleTouch = false;
        onStrokeEnd()

        isSwiped(startX, prevTouches[0]?.pageX)
    }

    function onStrokeEnd() {
        // resetLineWidth()
        reduceAudio()
        colorDelay()
        clearTimeout(expandTimer)
        clearInterval(reduceOpac)
        sendAlert()
        insidePoly = [0, 0]
        tooFast = false;
    }

    // function showColourPreview(x, y) {
    //     let canvas = document.getElementById('top-canvas')
    //     let context = canvas.getContext("2d");
    //     context.clearRect(0, 0, canvas.width, canvas.height);
    //     gsap.to("#top-canvas", {opacity: 1, duration:  1, delay: 0})
    //
    //     colourInterval = setInterval(function () {
    //         context.beginPath();
    //         // context.arc(x + 80, y - 80, 50, 0, 2 * Math.PI, false);
    //         context.moveTo(x + 50, y - 50);
    //         context.bezierCurveTo(x - 40/2 + 50, y + 20/1.5-50, x - 30/2+ 50, y + 50/1.5-50, x + 20/2+ 50, y + 50/1.5-50);
    //         context.bezierCurveTo(x + 40/2+ 50, y + 90/1.5-50, x + 90/2+ 50, y + 90/1.5-50, x + 90/2+ 50, y + 65/1.5-50);
    //         context.bezierCurveTo(x + 95/2+ 50, y + 100/1.5-50, x + 180/2+ 50, y + 100/1.5-50, x + 180/2+ 50, y + 60/1.5-50);
    //         context.bezierCurveTo(x + 250/2+ 50, y + 70/1.5-50, x + 190/2+ 50, y + 10/1.5-50, x + 200/2+ 50, y + 20/1.5-50);
    //         context.bezierCurveTo(x + 260/2+ 50, y - 40/1.5-50, x + 150/2+ 50, y - 30/1.5-50, x + 170/2+ 50, y - 30/1.5-50);
    //         context.bezierCurveTo(x + 150/2+ 50, y - 75/1.5-50, x + 80/2+ 50, y - 70/1.5-50, x + 80/2+ 50, y - 40/1.5-50);
    //         context.bezierCurveTo(x + 30/2+ 50, y - 75/1.5-50, x - 20/2+ 50, y - 30/1.5-50, x + 50, y - 50);
    //
    //         context.closePath()
    //         context.fillStyle = getCurrColor();
    //         context.fill();
    //         context.lineWidth = 5;
    //         context.strokeStyle = 'black';
    //         context.stroke();
    //
    //     }, 50);
    // }

    function showColourPreview(x, y) {

        const bubble = document.getElementsByClassName('thought')[0];
        bubble.style.top = y - 200 + 'px';
        bubble.style.left = x + 100 + 'px';

        gsap.to(".thought", {opacity: 1, duration: 1, delay: 0})
        colourInterval = setInterval(function () {
            bubble.style.setProperty('--background-col', getCurrColor());
        }, 50);

    }

    function hideColourPreview() {
        // gsap.to(".thought", {opacity: 0, duration: 1, delay: 0})
    }

    // function hideColourPreview() {
    //     clearInterval(colourInterval);
    //     let canvas = document.getElementById('top-canvas')
    //     let context = canvas.getContext("2d");
    //     // if(colourPreview === true){
    //     // context.clearRect(0, 0, canvas.width, canvas.height);
    //     setTimeout(function() {
    //         // context.clearRect(0, 0, canvas.width, canvas.height);
    //         }, 500);
    //     // context.clearRect(0, 0, canvas.width, canvas.height);
    //
    //     gsap.to("#top-canvas", {opacity: 0, duration: .5, delay: 0})
    // }

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
        // if (Math.abs(prevX - x) > 15 || Math.abs(prevY - y) > 15) {
        //     const circleSvg = document.getElementsByClassName('thought')[0];
        //     circleSvg.style.transition = 'top 6s, left 6s'
        //     gsap.to(".thought", {opacity: 1, duration: 1, delay: 0,})
        //     circleSvg.style.top = y - 150 + 'px'
        //     circleSvg.style.left = x + 80 + 'px'
        // }
    }

    function showFeedback(x, y) {
        // const circleSvg = document.getElementsByClassName('thought')[0];
        // circleSvg.style.transition = '0s'
        // circleSvg.style.top = y - 150 + 'px'
        // circleSvg.style.left = x + 80 + 'px'
        // gsap.to(".thought", {opacity: 1, duration: 1, delay: 0,})
    }

    function hideFeedback() {
        // const circleSvg = document.getElementsByClassName('thought')[0];
        //
        // colourInterval = setInterval(function () {
        //     circleSvg.style.setProperty('--background-col', getCurrColor());
        // }, 50);
    }

    function generateAlert() {
        let ratio = insidePoly[1] / insidePoly[0]
        if (tooFast) {
            return 'Slow down'
        } else if (ratio >= 1) {
            return 'Focus on drawing inside the lines'
        } else if (ratio < 0.5 && insidePoly[0] !== 0) {
            return 'Keep it up!'
        }
        return ''
    }

    function sendAlert() {
        let prevFeedback = document.getElementsByClassName('thought')[0].innerHTML;
        let returnFeedback = generateAlert()
        if (prevFeedback === returnFeedback) {
            document.getElementsByClassName('thought')[0].innerHTML = ''
        } else if (returnFeedback !== '') {
            document.getElementsByClassName('thought')[0].innerHTML = returnFeedback
            // gsap.to("#feedbackBar", {opacity: 1, duration: 2, delay: 0})
            // gsap.to("#feedbackBar", {opacity: 0, duration: 2, delay: 2})
        }
    }

    function isSwiped(startX, endX) {
        console.log(startX, endX)
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
            <div className="thought" style={{transform: 'scale(.7)',}}></div>
            <div className="burst" style={{zIndex: 2}}></div>
            <div id="svg"></div>
            <Music/>
            <div className="wrapper">
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
        </div>
    );
}

export default App;
