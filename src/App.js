'use strict'

import './App.css';
import {useEffect, useRef, useState} from "react";
import {Helmet} from "react-helmet";
import {mul, EdgeShape, tilingTypes, IsohedralTiling}
    from './lib/tactile.js';
import tilingObject from './Tiling.js'

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

    const [intro, setIntro] = useState(true)

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

    // distance from origin
    let offsetX = 0;
    let offsetY = 0;
    // let offsetX = -300;
    // let offsetY = -300;

    // default line width at the start of each stroke
    let lineWidth = 50;

    useEffect(() => {
        redrawCanvas();
        // pageScroll()
    }, [intro]);

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
            drawLine(toScreenX(line.x0), toScreenY(line.y0), toScreenX(line.x1), toScreenY(line.y1), line.color, line.lineWidth);
        }

        const tilingCanvas = document.getElementById("tiling-canvas")
        tilingCanvas.width = document.body.clientWidth;
        tilingCanvas.height = window.innerHeight;

        // console.log('TILING ARRAY LENGTH ' + tilingArr.length)
        // console.log('nUMBER OF TILESSSS ' + numTiles)
        if (!intro) {
            for (let i = 0; i < tilingArr.length; i++) {
                tilingObject.drawTiling(offsetX, offsetY - (2000 * i), tilingArr[i].tiling, tilingArr[i].edges, tilingArr[i].transition);
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
            leftMouseDown = true;
            rightMouseDown = false;
            // color = getRandomColor()

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

        if (leftMouseDown) {
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
                lineWidth: getLineWidth(scaledX,scaledY)
            })
            setDrawings(drawings)
            //scroll if drawing on bottom 1/5 part of page
            if (yMousePos > window.innerHeight * 4 / 5) {
                pageScroll();
            }
            // draw a line
            drawLine(prevCursorX, prevCursorY, cursorX, cursorY, color, lineWidth);

        }
        if (rightMouseDown) {
            // move the screen
            // offsetX += (cursorX - prevCursorX) / scale;
            offsetY -= (cursorY - prevCursorY);
            if (offsetY > (900 * tilingArr.length)) {
                addToTilingArr()
            }
            redrawCanvas();
        }
        prevCursorX = cursorX;
        prevCursorY = cursorY;
        // console.log("SPEEEED " + xMouse)

    }

    function onMouseUp() {
        // setColor(getRandomColor)
        leftMouseDown = false;
        rightMouseDown = false;
        lineWidth = 50;
        reduceAudio()
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
        // var tilingCan = document.getElementById('tiling-canvas');
        // const tilingContext = tilingCan.getContext("2d");
        // if (tilingContext.getImageData(x1, y1 - 25 , 1, 1).data[3] === 0 )
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
        // drawLineEffect(context, x1, y1, theColor)
    }

    // touch functions
    const prevTouches = [null, null]; // up to 2 touches
    let singleTouch = false;
    let doubleTouch = false;

    function onTouchStart(event) {
        if (event.touches.length == 1) {
            singleTouch = true;
            doubleTouch = false;
            // color = getRandomColor()
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

        if (singleTouch) {
            // add to history
            drawings.push({
                x0: prevScaledX,
                y0: prevScaledY,
                x1: scaledX,
                y1: scaledY,
                color: color,
                lineWidth: getLineWidth(scaledX,scaledY)
            })


            changeAudio()

            setDrawings(drawings)
            // speed of stroke
            xTouch = event.touches[0].pageX - prevTouches[0]?.pageX;
            yTouch = event.touches[0].pageY - prevTouches[0]?.pageY;

            // y position of stroke
            yTouchPos = event.touches[0].pageY
            if (yTouchPos > window.innerHeight * 4 / 5) {
                pageScroll();
            }
            // console.log('TOUCH POSTIONNNN ' + yTouchPos + ' ' + window.innerHeight)

            drawLine(prevTouch0X, prevTouch0Y, touch0X, touch0Y, color, lineWidth);
        }

        if (doubleTouch) {
            offsetY -= (touch0Y - prevTouch0Y);
            if (offsetY > (1100 * tilingArr.length)) {
                addToTilingArr();
            }
            redrawCanvas();
        }
        prevTouches[0] = event.touches[0];
        prevTouches[1] = event.touches[1];
    }

    function onTouchEnd(event) {
        singleTouch = false;
        doubleTouch = false;
        lineWidth = 50;
        reduceAudio()
    }

    function drawLineEffect(context, x1, y1, color) {
        context.strokeStyle = color;
        context.lineWidth = 5;
        context.lineTo(x1, y1);
        context.stroke();

        context.strokeStyle = color.substring(0, color.length - 2) + '0.7)';
        context.lineWidth = 10;
        context.lineTo(x1, y1);
        context.stroke();

        context.strokeStyle = color.substring(0, color.length - 2) + '0.5)';
        context.lineWidth = 20;
        context.lineTo(x1, y1);
        context.stroke();

        context.strokeStyle = color.substring(0, color.length - 2) + '0.3)';
        context.lineWidth = 30;
        context.lineTo(x1, y1);
        context.stroke();

        context.strokeStyle = color.substring(0, color.length - 2) + '0.2)';
        context.lineWidth = 40;
        context.lineTo(x1, y1);
        context.stroke();

        context.strokeStyle = color.substring(0, color.length - 2) + '0.1)';
        context.lineWidth = 50;
        context.lineTo(x1, y1);
        context.stroke();
    }

    function getLineWidth(x1, y1) {
        var tilingCan = document.getElementById('tiling-canvas');
        const tilingContext = tilingCan.getContext("2d");
        // if (tilingContext.getImageData(x1, y1 + 100, 1, 1).data[3] === 0) {
        //     lineWidth = 0;
        //     return lineWidth;
        // }

        let speedX = Math.abs(xTouch)
        let speedY = Math.abs(yTouch)

        if (!singleTouch) { //if using Mouse
            speedX = Math.abs(xMouse)
            speedY = Math.abs(yMouse)
        }
        if ((speedX > 10 || speedY > 10) && lineWidth > 20) {
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

    function pageScroll() {
        console.log('TRIGGERED PAGE SCROLL' + offsetY)
        // let start = Date.now();
        // requestAnimationFrame(function animate(timestamp) {
        //     let interval = Date.now() - start;
        //     offsetY += 1
        //     redrawCanvas()
        //     if (interval < 3000) requestAnimationFrame(animate); // queue request for next frame
        // });
        setInterval(function () {
            offsetY += 1
            redrawCanvas()
        }, 100);

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
                <canvas ref={canvas} id="canvas" style={{visibility: intro ? 'hidden' : ''}}
                >Your browser does not support HTML5 canvas
                </canvas>
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

            </div>
        </div>
    );
}

export default App;
