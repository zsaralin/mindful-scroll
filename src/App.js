'use strict'

import './App.css';
import {useEffect, useRef, useState} from "react";
import {Helmet} from "react-helmet";
import {mul, EdgeShape, tilingTypes, IsohedralTiling}
    from './lib/tactile.js';
import tilingObject from './Tiling.js'
import structuredClone from '@ungap/structured-clone';

let audio = new Audio('https://audio.jukehost.co.uk/M8pzlNF3rdamYbcdo7cLg9b41gfwqC1b');
audio.volume = .2;

function getRandomColor() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')';
}

function App() {
    const canvas = useRef();
    let color = getRandomColor();

    let xMouse = 0;
    let yMouse = 0;
    let xTouch = 0;
    let yTouch = 0;

    let yMousePos = 0;
    let yTouchPos = 0

    var expandTimer;

    const [intro, setIntro] = useState(true)

    let doScroll = false;

    // disable right clicking
    document.oncontextmenu = function () {
        return false;
    }
    useEffect(() => {
        const {tiling, edges} = tilingObject.makeRandomTiling()
        setTilingArr([
            {tiling: tiling, edges: edges, transition: getRandomTransition()}])
    }, []);

    // list of all strokes drawn
    // const drawings = [];
    const [drawings, setDrawings] = useState([])

    // list of all tilings
    const [tilingArr, setTilingArr] = useState([])

    // coordinates of our cursor
    let cursorX;
    let cursorY;
    let prevCursorX;
    let prevCursorY;

    // color of tile on offscreen buffer
    var invisCol;

    // distance from origin
    let offsetX = 0;
    let offsetY = 0;
    // let offsetX = -300;
    // let offsetY = -300;

    // default line width at the start of each stroke
    let lineWidth = 50;

    useEffect(() => {
        redrawCanvas();
    }, [intro]);

    let insidePoly = 0;
    let outsidePoly = 0;

    // convert coordinates
    function toScreenX(xTrue) {
        return (xTrue - offsetX)
    }

    function toScreenY(yTrue) {
        return (yTrue - offsetY)
    }

    function toTrueX(xScreen) {
        return (xScreen) + offsetX;
    }

    function toTrueY(yScreen) {
        return (yScreen) + offsetY;
    }

    function redrawCanvas() {
        const canvas = document.getElementById("canvas");
        // set the canvas to the size of the window
        canvas.width = document.body.clientWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext('2d');

        for (let i = 0; i < drawings.length; i++) {
            const line = drawings[i];
            if ((toScreenY(line.y0) < -1000 && toScreenY(line.y1) < -1000) || (toScreenY(line.y0) > 2000 && toScreenY(line.y1) > 2000)) {
                drawings.splice(i, 1)
            }
            drawLine(toScreenX(line.x0), toScreenY(line.y0), toScreenX(line.x1), toScreenY(line.y1), line.color, line.lineWidth);
        }
        const invisCanv = document.getElementById("invis-canvas")
        invisCanv.width = document.body.clientWidth;
        invisCanv.height = window.innerHeight;

        //check variable after 60 seconds javascript
        const tilingCanvas = document.getElementById("tiling-canvas")
        tilingCanvas.width = document.body.clientWidth;
        tilingCanvas.height = window.innerHeight;

        // console.log('nUMBER OF TILESSSS ' + numTiles)

        var q = tilingArr.length > 1 ? tilingArr.length - 2 : 0
        if (!intro) {
            for (let i = q; i < tilingArr.length; i++) {
                tilingObject.drawTiling(offsetX, offsetY - (3000 * i), tilingArr[i].tiling, tilingArr[i].edges, tilingArr[i].transition);
            }
        }
    }

    // if the window changes size, redraw the canvas
    window.addEventListener("resize", (event) => {
        // redrawCanvas();
    });

    // mouse functions
    let leftMouseDown = false;
    let rightMouseDown = false;

    function onMouseDown(event) {
        // detect left clicks
        if (event.button == 0) {
            cursorX = event.pageX;
            cursorY = event.pageY;
            const scaledX = toTrueX(cursorX);
            const scaledY = toTrueY(cursorY);
            const prevScaledX = toTrueX(prevCursorX);
            const prevScaledY = toTrueY(prevCursorY);

            leftMouseDown = true;
            rightMouseDown = false;

            var colorCan = document.getElementById('invis-canvas');
            const colorCtx = colorCan.getContext("2d");
            let tempCol = new String(colorCtx.getImageData(event.pageX, event.pageY, 1, 1).data)
            if (tempCol.toString() !== "0,0,0,255") {
                invisCol = tempCol
            }
            drawings.push({
                x0: prevScaledX,
                y0: prevScaledY,
                x1: scaledX,
                y1: scaledY,
                color: color,
                lineWidth: getLineWidth()
            })
            setDrawings(drawings)
            drawLine(prevCursorX, prevCursorY, cursorX, cursorY, color, lineWidth);

            expandTimer = setTimeout(horizExpandFn, 1500);
        }

        // detect right clicks
        if (event.button == 2) {
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
        const scaledX = toTrueX(cursorX);
        const scaledY = toTrueY(cursorY);
        const prevScaledX = toTrueX(prevCursorX);
        const prevScaledY = toTrueY(prevCursorY);

        var colorCan = document.getElementById('invis-canvas');
        const colorCtx = colorCan.getContext("2d");

        if (leftMouseDown) {
            if (colorCtx.getImageData(cursorX, cursorY, 1, 1).data.toString().trim() === invisCol?.trim() &&
                colorCtx.getImageData(prevCursorX, prevCursorY, 1, 1).data.toString().trim() === invisCol?.trim()) {
                // speed of stroke
                xMouse = event.movementX;
                yMouse = event.movementY;

                // y position of stroke
                yMousePos = event.pageY;

                changeAudio()

                // add the line to our drawing history
                drawings.push({
                    x0: prevScaledX,
                    y0: prevScaledY,
                    x1: scaledX,
                    y1: scaledY,
                    color: color,
                    lineWidth: getLineWidth()
                })
                setDrawings(drawings)
                drawLine(prevCursorX, prevCursorY, cursorX, cursorY, color, lineWidth);

                if (Math.abs(xMouse) < 1 && Math.abs(yMouse) < 1) {
                    expandTimer = setTimeout(horizExpandFn, 1500);
                }
                //scroll if drawing on bottom 1/5 part of page
                if (!doScroll && yMousePos > window.innerHeight * 4 / 5) {
                    pageScroll();
                }
                insidePoly += 1;
            } else {
                outsidePoly += 1;
            }
        }
        if (rightMouseDown) {
            // move the screen
            // offsetX += (cursorX - prevCursorX) / scale;
            offsetY -= (cursorY - prevCursorY);
            if (offsetY > (2300 * tilingArr.length)) {
                addToTilingArr()
            }
            clearTimeout(scroll)
            redrawCanvas();
        }
        prevCursorX = cursorX;
        prevCursorY = cursorY;
        // console.log("SPEEEED " + xMouse)

    }

    function onMouseUp() {
        leftMouseDown = false;
        rightMouseDown = false;
        lineWidth = 50;
        reduceAudio()
        colorDelay('mouse')
        clearTimeout(expandTimer)

        console.log(`OUTSIDE POLY ${outsidePoly} inside poly ${insidePoly} RA TIOOOO ${outsidePoly/insidePoly}`)
        sendAlert()
        insidePoly = 0;
        outsidePoly = 0;
    }

    const [alert, setAlert] = useState('')

    function sendAlert(){
        if(outsidePoly/insidePoly > 1){
            setAlert('Focus on drawing inside the lines')
        }
        else if(outsidePoly/insidePoly < 0.5 && insidePoly !== 0 ){
            setAlert('Keep it up!')
        }
        else{
            setAlert('')
        }
    }

    function drawLine(x0, y0, x1, y1, color, lineWidth) {
        var canvas = document.getElementById('canvas');
        const context = canvas.getContext("2d");

        context.beginPath();
        context.moveTo(x0, y0);
        context.lineCap = 'round'
        context.lineJoin = 'round'
        context.lineWidth = lineWidth;

        // console.log('LIEN WIDTH ' + lineWidth)
        // context.lineWidth = getLineWidth();

        // {
        //     context.strokeStyle = "white";
        // }
        // else{
        context.strokeStyle = color;

        //
        // }
        // context.lineWidth = lineWidth;
        // console.log('COLOURRRSSS' + tilingContext.getImageData(x1, y1, 1, 1).data )
        context.lineTo(x1, y1);
        context.stroke();
    }

    // drawLineEffect(context, x1, y1, theColor)


    // touch functions
    const prevTouches = [null, null]; // up to 2 touches
    let singleTouch = false;
    let doubleTouch = false;

    function onTouchStart(event) {
        if (event.touches.length == 1) {
            singleTouch = true;
            doubleTouch = false;

            const touch0X = event.touches[0].pageX;
            const touch0Y = event.touches[0].pageY;

            var colorCan = document.getElementById('invis-canvas');
            const colorCtx = colorCan.getContext("2d");
            let tempCol = new String(colorCtx.getImageData(touch0X, touch0Y, 1, 1).data)
            if (tempCol.toString() !== "0,0,0,255") {  //if colour is not black
                invisCol = tempCol
            }

            const scaledX = toTrueX(touch0X);
            const scaledY = toTrueY(touch0Y);

            drawings.push({
                x0: scaledX,
                y0: scaledY,
                x1: scaledX,
                y1: scaledY,
                color: color,
                lineWidth: getLineWidth()
            })
            setDrawings(drawings)
            drawLine(touch0X, touch0Y, touch0X, touch0Y, color, lineWidth);
            expandTimer = setTimeout(horizExpandFn, 1500);

        }

        if (event.touches.length >= 2) {
            singleTouch = false;
            doubleTouch = true;
        }

        // store the last touches
        prevTouches[0] = event.touches[0];
        prevTouches[1] = event.touches[1];

    }

    function onTouchMove(event) {
        // get first touch coordinates
        const touch0X = event.touches[0].pageX;
        const touch0Y = event.touches[0].pageY;
        const prevTouch0X = prevTouches[0]?.pageX;
        const prevTouch0Y = prevTouches[0]?.pageY;

        const scaledX = toTrueX(touch0X);
        const scaledY = toTrueY(touch0Y);
        const prevScaledX = toTrueX(prevTouch0X);
        const prevScaledY = toTrueY(prevTouch0Y);

        var colorCan = document.getElementById('invis-canvas');
        const colorCtx = colorCan.getContext("2d");

        if (singleTouch) {
            if (colorCtx.getImageData(touch0X, touch0Y, 1, 1).data.toString().trim() === invisCol?.trim()
                && colorCtx.getImageData(prevTouch0X, prevTouch0Y, 1, 1).data.toString().trim() === invisCol?.trim()) {
                // add to history
                drawings.push({
                    x0: prevScaledX,
                    y0: prevScaledY,
                    x1: scaledX,
                    y1: scaledY,
                    color: color,
                    lineWidth: getLineWidth()
                })
                setDrawings(drawings)
                drawLine(prevTouch0X, prevTouch0Y, touch0X, touch0Y, color, lineWidth);
                // speed of stroke
                xTouch = event.touches[0].pageX - prevTouches[0]?.pageX;
                yTouch = event.touches[0].pageY - prevTouches[0]?.pageY;

                drawLine(prevTouch0X, prevTouch0Y, touch0X, touch0Y, color, lineWidth);

                changeAudio()

                if (Math.abs(xTouch) < 1 && Math.abs(yTouch) < 1) {
                    expandTimer = setTimeout(horizExpandFn, 1500);
                }

                // y position of stroke
                yTouchPos = event.touches[0].pageY
                if (!doScroll && yTouchPos > window.innerHeight * 4 / 5) {
                    pageScroll();
                }
                insidePoly += 1;
            } else {
                outsidePoly += 1;
            }
        }

        if (doubleTouch) {
            offsetY -= (touch0Y - prevTouch0Y);
            if (offsetY > (2300 * tilingArr.length)) {
                addToTilingArr();
            }
            clearTimeout(scroll)
            redrawCanvas();
        }
        prevTouches[0] = event.touches[0];
        prevTouches[1] = event.touches[1];
    }

    function onTouchEnd() {
        singleTouch = false;
        doubleTouch = false;
        lineWidth = 50;
        reduceAudio()
        colorDelay('touch')
        clearTimeout(expandTimer)

        sendAlert()
        insidePoly = 0;
        outsidePoly = 0;
    }

    // function drawLineEffect(context, x1, y1, color) {
    //     context.strokeStyle = color;
    //     context.lineWidth = 5;
    //     context.lineTo(x1, y1);
    //     context.stroke();
    //
    //     context.strokeStyle = color.substring(0, color.length - 2) + '0.7)';
    //     context.lineWidth = 10;
    //     context.lineTo(x1, y1);
    //     context.stroke();
    //
    //     context.strokeStyle = color.substring(0, color.length - 2) + '0.5)';
    //     context.lineWidth = 20;
    //     context.lineTo(x1, y1);
    //     context.stroke();
    //
    //     context.strokeStyle = color.substring(0, color.length - 2) + '0.3)';
    //     context.lineWidth = 30;
    //     context.lineTo(x1, y1);
    //     context.stroke();
    //
    //     context.strokeStyle = color.substring(0, color.length - 2) + '0.2)';
    //     context.lineWidth = 40;
    //     context.lineTo(x1, y1);
    //     context.stroke();
    //
    //     context.strokeStyle = color.substring(0, color.length - 2) + '0.1)';
    //     context.lineWidth = 50;
    //     context.lineTo(x1, y1);
    //     context.stroke();
    // }

    function getLineWidth() {
        var tilingCan = document.getElementById('tiling-canvas');
        const tilingContext = tilingCan.getContext("2d");

        let speedX = Math.abs(xTouch)
        let speedY = Math.abs(yTouch)

        if (!singleTouch) { //if using Mouse
            speedX = Math.abs(xMouse)
            speedY = Math.abs(yMouse)
        }
        if ((speedX > 10 && speedX > 0 || speedY > 10 && speedX > 0) && lineWidth > 20) {
            lineWidth -= 1;
            return lineWidth
        } else if (lineWidth < 80) {
            lineWidth += 0.1;
            return lineWidth
        }
        return 80;
    }

    function changeAudio() {
        let speedX = Math.abs(xTouch)
        let speedY = Math.abs(yTouch)

        if (!singleTouch) { //if using Mouse
            speedX = Math.abs(xMouse)
            speedY = Math.abs(yMouse)
        }
        var decreaseVol = setInterval(function () {
            if ((leftMouseDown || singleTouch) && (speedX > 5 || speedY > 5) && audio.volume > 0.2) {
                // console.log("increasing" + audio.volume)
                audio.volume -= .005;
                // console.log('volume' + audio.volume)
            } else {
                // Stop the setInterval when 0.8 is reached
                clearInterval(decreaseVol);
            }
        }, 200);

        var increaseVol = setInterval(function () {
            if ((leftMouseDown || singleTouch) && (speedX < 5 || speedY < 5) && audio.volume < .8) {
                // console.log("increasing" + audio.volume)
                audio.volume += .005;
                // console.log('volume' + audio.volume)
            } else {
                // Stop the setInterval when 0.8 is reached
                clearInterval(increaseVol);
            }
        }, 200);
    }

    function reduceAudio() {
        var decreaseVol = setInterval(function () {
            if (audio.volume > 0.2) {
                // console.log("increasing" + audio.volume)
                audio.volume -= .05;
                // console.log('volume' + audio.volume)
            } else {
                // Stop the setInterval when 0.8 is reached
                clearInterval(decreaseVol);
            }
        }, 200);
    }


    var scroll ;

    function pageScroll(stop) {
        doScroll = true;
        // console.log('TRIGGERED PAGE SCROLL' + offsetY)

        // let start = Date.now();
        // requestAnimationFrame(function animate(timestamp) {
        //     let interval = Date.now() - start;
        //     offsetY += 1
        //     redrawCanvas()
        //     if (interval < 3000) requestAnimationFrame(animate); // queue request for next frame
        // });
        scroll = setInterval(function () {
            offsetY += 1;
            redrawCanvas()
        }, 100);
        setTimeout(function () {
            clearInterval(scroll);
            doScroll = false
        }, 5000);
    }

    const playAud = () => {
        let playPromise = audio.play()
        if (playPromise !== undefined) {
            playPromise.then(function () {
                // Automatic playback started!
            }).catch(function (error) {
                // Automatic playback failed.
                // Show a UI element to let the user manually start playback.
            });
            setIntro(false)
        }
    }

    // sets transition value to 0.95 or 1.05 for segments with len == 2
    function getRandomTransition() {
        let transitionArr = [0.98, 1.02]
        return transitionArr[Math.floor(Math.random() * transitionArr.length)]
    }

    function addToTilingArr() {
        const {tiling, edges} = tilingObject.makeRandomTiling()
        tilingArr.push({tiling: tiling, edges: edges, transition: getRandomTransition()})
        setTilingArr(tilingArr)
    }

    // changes color after a 2s pause, or changes hue slightly after a 500ms pause
    var colorTimer;
    var colorChange = 15;
    function colorDelay(input) {
        clearTimeout(colorTimer)
        var rgb = color.match(/\d+/g);
        var i = Math.floor(Math.random() * rgb.length)
        if (parseInt(rgb[i]) + colorChange < 0) {
            colorChange = 15;
        } else if (parseInt(rgb[i]) + colorChange > 255) {
            colorChange = -15;
        }
        rgb[i] = parseInt(rgb[i]) + colorChange;

        colorTimer = setTimeout(function () {
            if (input == 'mouse' && !leftMouseDown) {
                color = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'
            }
            if (input == 'touch' && !singleTouch) {
                color = getRandomColor();
            }
        }, 500);

        colorTimer = setTimeout(function () {
            if (input == 'mouse' && !leftMouseDown) {
                color = getRandomColor();
            }
            if (input == 'touch' && !singleTouch) {
                color = getRandomColor();
            }
        }, 2000);
    }


    function horizExpandFn() {
        if (leftMouseDown && !rightMouseDown || singleTouch) {
            var colorCan = document.getElementById('invis-canvas');
            const colorCtx = colorCan.getContext("2d");

            let lastDrawingX = drawings[drawings.length - 1]
            let lastDrawingY = drawings[drawings.length - 1]

            // expand outwards
            // if (colorCtx.getImageData(lastDrawingX.x1 - ((lastDrawingX.lineWidth+5)/2), lastDrawingX.y1, 1, 1).data.toString().trim() === invisCol?.trim() &&
            //     colorCtx.getImageData(lastDrawingX.x1 - ((lastDrawingX.lineWidth+5)/2), lastDrawingX.y1, 1, 1).data.toString().trim() === invisCol?.trim() &&
            //         colorCtx.getImageData(lastDrawingX.x1, lastDrawingX.y1 + ((lastDrawingX.lineWidth+5)/2), 1, 1).data.toString().trim() === invisCol?.trim() &&
            //             colorCtx.getImageData(lastDrawingX.x1, lastDrawingX.y1 - ((lastDrawingX.lineWidth+5)/2), 1, 1).data.toString().trim() === invisCol?.trim()
            // ){
            //     lastDrawingX.lineWidth += 5;
            // }

            // expand horizontally
            // if (colorCtx.getImageData(lastDrawingX.x1 + 10, lastDrawingX.y1, 1, 1).data.toString().trim() === invisCol?.trim()) {
            //     lastDrawingX.x1 = lastDrawingX.x1 + 2
            // }
            // if (colorCtx.getImageData(lastDrawingX.x0 - 10 , lastDrawingX.y0, 1, 1).data.toString().trim() === invisCol?.trim()) {
            //     lastDrawingX.x0 = lastDrawingX.x0 - 2;
            // }

            // expand vertically
            // if (colorCtx.getImageData(lastDrawingY.x1, lastDrawingY.y1 + 5, 1, 1).data.toString().trim() === invisCol?.trim() ||
            //     colorCtx.getImageData(lastDrawingY.x1, lastDrawingY.y1 - 3, 1, 1).data.toString().trim() === "0,0,0,255")
            // {
            //     lastDrawingY.y1 += 5;
            // }
            // if (colorCtx.getImageData(lastDrawingY.x0, lastDrawingY.y0 - 1, 1, 1).data.toString().trim() === invisCol?.trim() ||
            //     colorCtx.getImageData(lastDrawingY.x0, lastDrawingY.y0 + 3, 1, 1).data.toString().trim() === "0,0,0,255")
            // {
            //     lastDrawingY.y0 -= 5;
            // }

            // drawings.push(lastDrawingX)

            // setDrawings(drawings)
            redrawCanvas()
            setTimeout(horizExpandFn, 100);
        }
    };


    return (
        <div className="App">
            <Helmet>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            </Helmet>
            <style>
                {`
          #canvas {
          }
        `}
            </style>
            <div className={intro ? "introPage" : "wrapper"}
                 onClick={playAud}> {intro ? "Click Anywhere to Start!" : ""}
                {/*<canvas id="invis-canvas"*/}
                {/*></canvas>*/}
                <canvas ref={canvas} id="canvas" style={{visibility: intro ? 'hidden' : ''}}
                >Your browser does not support HTML5 canvas
                </canvas>
                <canvas id="invis-canvas" style={{display: 'none'}}
                ></canvas>
                <canvas id="tiling-canvas"
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onMouseOut={onMouseUp}
                        onMouseMove={onMouseMove}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        onTouchCancel={onTouchEnd}
                        onTouchMove={onTouchMove}
                ></canvas>
                <div style = {{position:'absolute', width: '100%', height: '25px', backgroundColor : 'white', textAlign: 'center', transition: `opacity 1s linear`, opacity: 1}}> {alert} </div>
            </div>
        </div>
    );
}

export default App;
