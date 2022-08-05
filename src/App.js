import './App.css';
import {useEffect, useRef, useState} from "react";
import {Helmet} from "react-helmet";
import Music, {changeAudio, reduceAudio} from './components/Audio.js'
import {
    drawStroke,
    redrawStrokes,
    colorDelay,
    stopColorChange,
    resetLineWidth,
    pushStroke,
    setLineWidth, removeLastStroke
} from './components/Stroke'
import {
    addToTilingArr,
    tilingArrLength,
    redrawTilings,
    sumArray,
    sumArrayPrev,
} from "./components/TilingArr";
import {doScroll, getOffsetY, startAutoScroll} from "./components/PageScroll";
import {fillTile} from "./components/FillTile";

function App() {
    const canvas = useRef();
    let colorCtx;

    // mouse functions
    let leftMouseDown = false;
    let rightMouseDown = false;

    let mouseSpeed = [];
    let touchSpeed = [];

    // coordinates of our cursor
    let cursorX;
    let cursorY;
    let prevCursorX;
    let prevCursorY;

    // color of tile on invisible buffer canvas
    let invisCol;

    let insidePoly = [] // number of points inside and outside polygon

    let expandTimer;

    function toTrueX(xScreen) {
        return (xScreen) ;
    }

    function toTrueY(yScreen) {
        let offsetY = getOffsetY()
        return (yScreen) + offsetY;
    }


    useEffect(() => {
        addToTilingArr()
        const canvas = document.getElementById("canvas");
        const invisCanvas = document.getElementById("invis-canvas")
        const tilingCanvas = document.getElementById("tiling-canvas")

        // set the canvas to the size of the window
        canvas.width = invisCanvas.width = tilingCanvas.width = window.innerWidth;
        canvas.height = invisCanvas.height = tilingCanvas.height = window.innerHeight;

        colorCtx = invisCanvas.getContext("2d");
        redrawTilings();
    }, []);

    function onMouseDown(event) {
        // detect left clicks
        if (event.button === 0) {
            leftMouseDown = true;
            rightMouseDown = false;
            const prevScaledX = prevCursorX;
            const prevScaledY = toTrueY(prevCursorY);

            stopColorChange()

            setInvisCol(prevCursorX, prevCursorY)
            if (invisCol !== undefined && invisCol.substring(0, 5) !== '0,0,0') { //not white (outside tiling)
                pushStroke(prevScaledX, prevScaledY, prevScaledX, prevScaledY)
                drawStroke(prevCursorX, prevCursorY, prevCursorX, prevCursorY);
                expandTimer = setTimeout(fillTile, 3000, prevScaledX, prevScaledY, invisCol, 25)
            }
        }


        // detect right clicks
        if (event.button === 2) {
            rightMouseDown = true;
            leftMouseDown = false;
        }

        // update the cursor coordinates
        cursorX = event.pageX;
        cursorY = event.pageY;
        prevCursorX = event.pageX;
        prevCursorY = event.pageY;
    }

    function onMouseMove(event) {
        // get mouse position
        cursorX = event.pageX;
        cursorY = event.pageY;
        const scaledX = cursorX;
        const scaledY = toTrueY(cursorY);
        const prevScaledX = toTrueX(prevCursorX);
        const prevScaledY = toTrueY(prevCursorY);
        clearTimeout(expandTimer)
        if (leftMouseDown) {
            if (isMatchInvisCol(prevCursorX, prevCursorY, cursorX, cursorY)) {
                // speed of stroke
                mouseSpeed = [event.movementX, event.movementY]

                changeAudio(mouseSpeed)
                setLineWidth(mouseSpeed)
                // add the line to our drawing history
                pushStroke(prevScaledX, prevScaledY, scaledX, scaledY)
                drawStroke(prevCursorX, prevCursorY, cursorX, cursorY);
                //scroll if drawing on bottom 1/5 part of page
                startAutoScroll(cursorY);

                insidePoly[0] += 1;
            } else {
                insidePoly[1] += 1;
            }
        }
        if (rightMouseDown) {
            doScroll(cursorY, prevCursorY)
        }
        prevCursorX = cursorX;
        prevCursorY = cursorY;
    }

    function onMouseUp() {
        leftMouseDown = false;
        rightMouseDown = false;
        onStrokeEnd()
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

            const scaledX = toTrueX(touch0X);
            const scaledY = toTrueY(touch0Y);
            const prevScaledX = toTrueX(prevTouch0X);
            const prevScaledY = toTrueY(prevTouch0Y);

            setInvisCol(touch0X, touch0Y)
            if (invisCol !== undefined && invisCol.substring(0, 5) !== '0,0,0') { //not white (outside tiling)
                pushStroke(scaledX, scaledY, scaledX, scaledY + 0.5)
                drawStroke(touch0X, touch0Y, touch0X, touch0Y + 0.5);
                expandTimer = setTimeout(fillTile, 3000, touch0X, touch0Y, invisCol, 25)
            }

            stopColorChange()
        }

        if (event.touches.length >= 2) {
            const touch0X = event.touches[0].pageX;
            const touch0Y = event.touches[0].pageY;
            const touch1X = event.touches[1].pageX;
            const touch1Y = event.touches[1].pageY;
            removeLastStroke(touch0X, touch0Y, touch1X, touch1Y, getOffsetY())

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
        // let colorCtx = document.getElementById('invis-canvas').getContext("2d");

        const scaledX = toTrueX(touch0X);
        const scaledY = toTrueY(touch0Y);
        const prevScaledX = toTrueX(prevTouch0X);
        const prevScaledY = toTrueY(prevTouch0Y);

        clearTimeout(expandTimer)
        if (singleTouch) {
            if(invisCol && invisCol === '0,0,0,0' && colorCtx.getImageData(touch0X, touch0Y, 1, 1).data.toString().trim() === '0,0,0,0'){
                doScroll(touch0Y, prevTouch0Y)
            }
            if (isMatchInvisCol(prevTouch0X, prevTouch0Y, touch0X, touch0Y)) {
                insidePoly[0] += 1;
                touchSpeed = [touch0X - prevTouch0X, touch0Y - prevTouch0Y]

                setLineWidth(touchSpeed)
                pushStroke(prevScaledX, prevScaledY, scaledX, scaledY)
                drawStroke(prevTouch0X, prevTouch0Y, touch0X, touch0Y);
                // speed of stroke
                changeAudio(touchSpeed)
                startAutoScroll(touch0Y);

                // if (Math.abs(touchSpeed[0]) < 1 && Math.abs(touchSpeed[1]) < 1) {
                //     expandTimer = setTimeout(fillTile, 3000, touch0X, touch0Y, invisCol, 25)
                //
                // }
                // expandTimer = setTimeout(horizExpandFn, 1500);
                // }

            } else {
                insidePoly[1] += 1;
            }
        }

        if (doubleTouch) {
            doScroll(touch0Y,prevTouch0Y)
        }
        prevTouches[0] = event.touches[0];
        prevTouches[1] = event.touches[1];
    }

    function onTouchEnd(event) {
        singleTouch = false;
        doubleTouch = false;
        onStrokeEnd()
    }

    function onStrokeEnd() {
        resetLineWidth()
        reduceAudio()
        colorDelay()
        clearTimeout(expandTimer)
        clearInterval(reduceOpac)
        document.getElementById("feedbackBar").style.color = 'rgba(0,0,0,0)'

        document.getElementById("feedbackBar").innerHTML = sendAlert()
        insidePoly = [0, 0]
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

    // color of tile on invisible buffer canvas
    function setInvisCol(cursorX, cursorY) {
        // let colorCtx = document.getElementById('invis-canvas').getContext("2d");
        let tempCol = colorCtx.getImageData(cursorX, cursorY, 1, 1).data
        if (tempCol.toString() !== "0,0,0,255") { //if not black
            invisCol = tempCol.toString()
        }
    }

    // true if current pixel matches color of invisible tile
    function isMatchInvisCol(prevX, prevY, currX, currY) {
        // let colorCtx = document.getElementById('invis-canvas').getContext("2d");
        if (colorCtx.getImageData(prevX, prevY, 1, 1).data.toString().trim() === '0,0,0,0') {
            return false; //only color within the tiles
        }
        if (colorCtx.getImageData(prevX, prevY, 1, 1).data.toString().trim() === invisCol?.trim()
            && colorCtx.getImageData(currX, currY, 1, 1).data.toString().trim() === invisCol?.trim()) {
            return true;
        }
        return false;
    }

    function sendAlert() {
        let ratio = insidePoly[1] / insidePoly[0]
        if (ratio > 1 ) {
            reduceOpacityFeedback()
            return 'Focus on drawing inside the lines'
        } else if (ratio < 0.5 && insidePoly[0] !== 0) {
            reduceOpacityFeedback()
            return 'Keep it up!'
        }
        return ''
    }

    return (
        <div className="App">
            <Helmet>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            </Helmet>
            <div id="feedbackBar"></div>
            <Music/>
            <div className="wrapper">
                <canvas ref={canvas} id="canvas"></canvas>
                <canvas id="invis-canvas" style={{display: 'none'}}></canvas>
                <canvas id="tiling-canvas" style={{display: ''}}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onMouseOut={onMouseUp}
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
