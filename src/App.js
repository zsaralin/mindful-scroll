'use strict'

import './App.css';
import {useEffect, useRef, useState} from "react";
import {Helmet} from "react-helmet";
import {mul, EdgeShape, tilingTypes, IsohedralTiling}
    from './lib/tactile.js';
import tilingObject from './Tiling.js'

function getRandomColor() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')';
}

function App() {
    const canvas = useRef();
    let color = getRandomColor();
    const [randTiling, setRandTiling] = useState(null)
    const [randEdges, setRandEdges] = useState(null)

    // disable right clicking
    document.oncontextmenu = function () {
        return false;
    }
    useEffect(() => {
        const {tiling, edges} = tilingObject.makeRandomTiling()
        setRandTiling(tiling)
        setRandEdges(edges)

    }, []);

    // list of all strokes drawn
    const drawings = [];

    // coordinates of our cursor
    let cursorX;
    let cursorY;
    let prevCursorX;
    let prevCursorY;

    // distance from origin
    let offsetX = 0;
    let offsetY = 0;

    useEffect(() => {
        redrawCanvas();
        pageScroll()
    }, [randTiling]);

    // useEffect(() => {
    //     pageScroll()
    // }, );

    // convert coordinates
    function toScreenX(xTrue) {
        return (xTrue + offsetX)
    }

    function toScreenY(yTrue) {
        return (yTrue + offsetY)
    }

    function toTrueX(xScreen) {
        return (xScreen) - offsetX;
    }

    function toTrueY(yScreen) {
        return (yScreen) - offsetY;
    }

    function redrawCanvas() {
        if (randTiling !== null && randEdges !== null) {
            tilingObject.drawTiling(offsetX, offsetY, randTiling, randEdges);
        }
        // const canvas = document.querySelector('#canvas')
        // setColor(getRandomColor())
        const canvas = document.getElementById("canvas");

        const context = canvas.getContext("2d");

        // set the canvas to the size of the window
        canvas.width = document.body.clientWidth;
        canvas.height = window.innerHeight;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < drawings.length; i++) {
            const line = drawings[i];
            drawLine(toScreenX(line.x0), toScreenY(line.y0), toScreenX(line.x1), toScreenY(line.y1), line.color);
        }

        const canvas2 = document.getElementById("tiling-canvas")
        canvas2.width = document.body.clientWidth;
        canvas2.height = window.innerHeight;
        if (randTiling && randEdges) {
            tilingObject.drawTiling(offsetX, offsetY, randTiling, randEdges);
        }
    }

    // if the window changes size, redraw the canvas
    window.addEventListener("resize", (event) => {
        redrawCanvas();
    });

    // mouse functions
    let leftMouseDown = false;
    let rightMouseDown = false;

    function onMouseDown(event) {
        // detect left clicks
        if (event.button == 0) {
            leftMouseDown = true;
            rightMouseDown = false;
            color = getRandomColor()

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
            // add the line to our drawing history
            drawings.push({
                x0: prevScaledX,
                y0: prevScaledY,
                x1: scaledX,
                y1: scaledY,
                color: color
            })
            // draw a line
            drawLine(prevCursorX, prevCursorY, cursorX, cursorY, color);
        }
        if (rightMouseDown) {
            // move the screen
            // offsetX += (cursorX - prevCursorX) / scale;
            offsetY += (cursorY - prevCursorY);
            redrawCanvas();
        }
        prevCursorX = cursorX;
        prevCursorY = cursorY;
    }

    function onMouseUp() {
        // setColor(getRandomColor)
        leftMouseDown = false;
        rightMouseDown = false;
    }

    function drawLine(x0, y0, x1, y1, theColor) {
        const context = canvas.current.getContext("2d");
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineCap = 'round'
        context.lineJoin = 'round'
        drawLineEffect(context, x1, y1, theColor)
    }

    // touch functions
    const prevTouches = [null, null]; // up to 2 touches
    let singleTouch = false;
    let doubleTouch = false;

    function onTouchStart(event) {
        if (event.touches.length == 1) {
            singleTouch = true;
            doubleTouch = false;
            color = getRandomColor()
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
        const prevTouch0X = prevTouches[0].pageX;
        const prevTouch0Y = prevTouches[0].pageY;

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
                color: color
            })
            drawLine(prevTouch0X, prevTouch0Y, touch0X, touch0Y, color);
        }

        if (doubleTouch) {
            offsetY += (touch0Y - prevTouch0Y);
            redrawCanvas();
        }
        prevTouches[0] = event.touches[0];
        prevTouches[1] = event.touches[1];
    }

    function onTouchEnd(event) {
        singleTouch = false;
        doubleTouch = false;
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

    function pageScroll() {
        offsetY += 1
        redrawCanvas()
        setTimeout(pageScroll,50);
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
            <div className="wrapper">
                <canvas ref={canvas} id="canvas"
                >Your browser does not support HTML5 canvas
                </canvas>
                <canvas id="tiling-canvas" width="document.body.clientWidth" height="client.innerHeight"
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
