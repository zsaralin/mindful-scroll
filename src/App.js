import './App.css';
import './components/Bubble/Bubble.css';
import {useEffect, useRef} from "react";
import {Helmet} from "react-helmet";
import Music, {changeAudio, reduceAudio, triggerAudio} from './components/Audio/Audio.js'
import {drawShrinkingStroke, isShrinkStroke} from './components/Stroke/StrokeType/ShrinkingStroke'
import {
    stopColorChange,
    colorDelay,
    getCurrColor,
    getRandomHSV,
    getColourPal, setColourPal
} from './components/Stroke/Color/StrokeColor'
import {
    pushStroke,
    pushShrinkingLine,
    removeLastStroke,
    redrawTileStrokes,
} from './components/Stroke/StrokeType/StrokeArr'
import {addToTilingArr, getTilingIndex, getYMax, redrawTilings, sumArray} from "./components/Tiling/TilingArr";
import {getOffsetY} from './components/Scroll/Offset'
import {
    doScroll, endScroll, prevOffsetY,
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
import {changeBool, getFillMin, getFillRatio, isCircleInPath} from "./components/Tile/FillTile/FillRatio";
import {BUBBLE_DIST, FILL_RATIO, SCROLL_DELTA, SCROLL_DIST, SHAPE_COLOR, SWIPE_THRESHOLD} from "./components/Constants";
import {completeTile, fillEachPixel, triggerCompleteTile} from "./components/Tile/CompleteTile";
import {gsap} from "gsap";
import {shapeGlow} from "./components/Tile/Shape";
import ControlPanel, {hideControlPanel, isPanelOn, showControlPanel} from "./components/ControlPanel/ControlPanel";
import Bubble, {
    hideColourPreview, moveFeedback,
    showColourPreview, teleportFeedback,

} from "./components/Bubble/Bubble";
import {bottom, drawTwo, getOffSmall, getTile, getTiling, tilingIndex} from "./components/Tiling/Tiling3";
import {isSlowScrollOn} from "./components/Scroll/SlowScroll";
import {startAutoScroll} from "./components/Scroll/AutoScroll";
import {getHandChange, handChanged, isRightHand, setHand, setHandChanged} from "./components/Effects/Handedness";
import {startDot} from "./components/Stroke/Dot/DotType";
import {drawBlurryStroke, drawDiagonalLine} from "./components/Effects/Blur";
import {startStroke} from "./components/Stroke/StrokeType/StrokeType";
import {toCloud, toSpeech} from "./components/Bubble/ShapeChange";
import {drawTransparentStroke, setDragging} from "./components/Stroke/StrokeType/TransparentStroke";
import {drawStroke} from "./components/Stroke/DrawStroke";
import {drawDottedStroke} from "./components/Stroke/StrokeType/DottedStroke";
import {
    getAdjTiles,
    getGrid,
    getNeighTiles,
    getOrienTiles,
    getTileMiddle, isSymmetrical, isSymmetricalX,
    setMidpointDict
} from "./components/Tiling/TilingProperties";
import {
    fillColumn,
    fillCorners,
    fillCorners2,
    fillCornersNeigh,
    fillOrien,
    fillRow, getColSections, getColumn, getCorners, getCornerTiles,
    getRow, getRowSections
} from "./components/Effects/Grid";
import {
    fillGrad,
    fillGradient,
    fillNeighGrad, fillTilesIndiv, fillTilesTogeth,
    fillTilesTogether
} from "./components/Tile/FillTile/FillAnim";
import {ditherFill, fillLinearGradient} from "./components/Effects/Gradient";
import {generateColourPal, getColourPalette, testing} from "./components/Stroke/Color/ColourPalette";
import {draw} from "./components/Effects/Dither";
import {fillStripes} from "./components/Tile/FillTile/FillPattern";
import {ditherTiling} from "./components/Tiling/DitherTiling";
import {setTiling} from "./components/Tiling/SortingHat";
import {drawJustDot, pushDot, removeLastDot} from "./components/Stroke/Dot/DotArr";
import {getTileWidth} from "./components/Tiling/TileWidth";
import {completeTile2} from "./components/Tiling/SortingHat/CompleteTile2";
import {dotTypesHelper, helper} from "./components/Tiling/SortingHat/TilingFillType";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD7jkL5al-vXpx49bscaB56M1p8uQAPhWU",
    authDomain: "mindful-coloring.firebaseapp.com",
    projectId: "mindful-coloring",
    storageBucket: "mindful-coloring.appspot.com",
    messagingSenderId: "899048890421",
    appId: "1:899048890421:web:ef1ea89361951460ab117c",
    measurementId: "G-L5Y0CXJXFG"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

function App() {
    const canvas = useRef();
    let ctx;
    let invisCol; // color of tile on invisible buffer canvas
    let currTile;
    let prevTile;

    let prevTiling;
    let currTiling;

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

    firebase.initializeApp(firebaseConfig);
    // Get a reference to the database
    const database = firebase.database();

    function sendMessage(message) {
        // Generate a new push key
        const newMessageRef = database.ref('messages').push();

        // Set the message data
        newMessageRef.set({
            text: message
        })
            .then(() => {
                console.log('Message sent successfully.');
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
    }
    let d = SCROLL_DIST// scroll distance (change in y)

    let insidePoly = [0, 0] // number of points inside and outside polygon
    let tooFast = false;
    let watercolorTimer;

    let hidePreviewInterval;
    let ratio = 0;

    let strokeMove = false;

    function toTrueY(y) {
        return (y) + getOffsetY() //+ prevOffsetY;
    }

    useEffect(() => {
        const canvasIds = ['tiling-canvas','invis-canvas', 'fill-canvas', 'top-canvas'];
        canvasIds.forEach(id => {
            const canvas = document.getElementById(id);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 6;
            const ctx = document.getElementById(id).getContext("2d");
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            if(id === 'tiling-canvas'){
                ctx.fillStyle = 'transparent';
                ctx.lineWidth = getTileWidth();
            }
            else if(id === 'invis-canvas'){
                ctx.lineWidth = ctx.lineWidth / 2;
            }
        });
        drawTwo()
        ctx = document.getElementById('invis-canvas').getContext("2d");
    }, []);

    let currColor;
    let firstClick = true;
    let lw;
    let index;
    let smallOffset;

    function onStrokeStart(prevScaledX, prevScaledY, x, y) {
        sendMessage("Hello")
        lw = getLineWidth()
        index = tilingIndex(prevScaledY)
        // console.log(`tilingIndex ${index}`)
        smallOffset = getOffSmall(index)
        console.log('SMALL ' + smallOffset)

        invisCol = ctx.getImageData(prevScaledX, prevScaledY, 1, 1).data.toString()

        currTile = getTile(y , invisCol)
        currTiling = getTiling(y , invisCol)
        // console.log(currTile + ' and ' + currTiling + ' and ' + currTiling.fillNum)
        if(currTiling.colourPal.length === 0){
            if(firstClick) {
                currTiling.colourPal = getColourPal()
                firstClick = false;
                setColourPal(currTiling.colourPal)
            }
            else {
                currTiling.colourPal = generateColourPal().cols
            }
        }
        if(prevTiling !== currTiling){
        setColourPal(currTiling.colourPal)}
        if(currTile) currTile.strokeType = currTile?.strokeType ? currTile.strokeType : helper(currTiling.fillInfo.strokeW, currTiling.fillInfo.strokeTypes)
        currColor = getCurrColor()
        stopColorChange()
        if (currTile && isCircleInPath(currTile.path, prevScaledX, prevScaledY + smallOffset)) {
            let c = document.getElementById('top-canvas').getContext('2d')
            // c.save()
            // c.translate(0,-smallOffset)
            // c.fillStyle = "blue"
            // c.fill(currTile.path)
            // c.restore()
            // sendMidAlert()
            moveFeedback(prevCursorX, prevCursorY, cursorX, cursorY, prevTile !== currTile)
            pushDot(currTile.id, prevScaledX, prevScaledY, prevScaledX, touchType === "direct" ? prevScaledY + .5 : prevScaledY, currColor, lw, currTiling.dotType );
            // startDot(currTile, prevScaledX, prevScaledY, prevScaledX, touchType === "direct" ? prevScaledY + .5 : prevScaledY, currColor, lw, currTiling.dotType );

            watercolorTimer = setTimeout(watercolor, 1500, prevScaledX, prevScaledY, 25, currTile)
            if (currTile.firstCol === "white") currTile.firstCol = currColor
            // console.log('fillRatio ' + getFillRatio(currTile,smallOffset))
            // if (!currTile.watercolor && !currTile.filled && getFillRatio(currTile ,smallOffset) > getFillMin()) {
            //     completeTile(currTile, currTiling, invisCol, smallOffset)
            // }
            currTile.colors.push(currColor)

            // let tiles = getOrienTiles(currTile, currTiling)
            // let tiles = getRow(currTile, currTiling)
            // let tiles = getColumn(currTile, currTiling)
            // let tiles = getCorners(currTiling)
            // let tiles = getCornerTiles(currTiling)

            // fillTilesTogeth(tiles, currColor, "center")
            // let tiles = getNeighTiles(currTile, currTiling)
            // fillNeighGrad(currTile, tiles, currColor)

            // fillOrien(currTile, t)
        } else {
            startX = prevCursorX;
            startY = prevCursorY;
        }
    }

    let dotRemoved = false;
    function onStrokeMove(prevScaledX, prevScaledY, scaledX, scaledY, speed) {
        insidePoly[0] += 1;
        currColor = getCurrColor();
        // scroll when dragging on white space
        if (invisCol && invisCol === '0,0,0,0' && ctx.getImageData(scaledX, scaledY, 1, 1).data.toString().trim() === '0,0,0,0') {
            doubleTouch = true;
            // rightMouseDown = true;
            // startScroll(Math.abs(speed[1]), prevCursorY, cursorY)
        }
        if (currTile && isCircleInPath(currTile.path, prevScaledX, prevScaledY + smallOffset) && isCircleInPath(currTile.path, scaledX, scaledY + smallOffset)) {
            strokeMove = true;
            if(!dotRemoved) {
                removeLastDot(currTile)
                dotRemoved = true;
            }
            // console.log(Math.abs(speed[0]) + ' and ' + Math.abs(speed[1]))

            if ((currTile.strokeType === "reg" && isShrinkStroke() && (Math.abs(speed[0]) > 10 || Math.abs(speed[1]) > 10))) {
                pushShrinkingLine(currTile.id, prevScaledX, prevScaledY, scaledX, scaledY, currColor, currTiling.strokeType);
                drawShrinkingStroke(prevScaledX, prevScaledY, scaledX, scaledY, currColor);
                tooFast = true;

            } else {
                pushStroke(currTile.id, prevScaledX, prevScaledY, scaledX, scaledY, currColor, getLineWidth(), currTile.strokeType );
                startStroke(currTile.id, prevScaledX, prevScaledY, scaledX, scaledY, getCurrColor(), getLineWidth(), currTile.strokeType );}
            changeAudio(mouseSpeed)
            startAutoScroll(cursorY);
        } else {
            insidePoly[1] += 1;
        }
    }

    let midId;

    function sendMidAlert() {
        midId = setInterval(function () {
            sendAlert()
        }, 3000);
    }

    function onMouseDown(event) {
        let strokeR = getLineWidth() / 2 // stroke radius
        // detect left clicks
        if (event.button === 0) {
            leftMouseDown = true;
            rightMouseDown = false;
            const prevScaledX = prevCursorX;
            const prevScaledY = toTrueY(prevCursorY);
            onStrokeStart(prevScaledX, prevScaledY, cursorX, cursorY)
        }
        // detect right clicks
        if (event.button === 2) {
            moveFeedback()
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
            onStrokeMove(prevScaledX, prevScaledY, scaledX, scaledY, mouseSpeed)
        } else if (rightMouseDown) {
            startScroll(Math.abs(mouseSpeed[1]), prevCursorY, cursorY)

        }
        prevCursorX = cursorX;
        prevCursorY = cursorY;

    }

    function onMouseUp() {
        if (rightMouseDown === false) { // do not move colour preview when triggering control panel
            if (!isPanelOn()) {
                showColourPreview(cursorX, cursorY, prevTile !== currTile, getHandChange);
                onStrokeEnd()
            }
        }
        else {
            // moveFeedback(prevCursorX, prevCursorY, cursorX, cursorY, prevTile !== currTile)
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

    let isDrawing = false;
    let requestId;


    function onTouchStart(event) {
        isDrawing = true;
        touchType = event.touches[0]?.touchType;
        if (event.touches.length === 1) {
            if (event.touches[0]?.touchType === "stylus") {
                angle = event.touches[0].azimuthAngle;
                if (angle < 4.7 && angle > 1.5 && isRightHand()) { // left hand
                    setHand("left")
                    setHandChanged(true)
                } else if (angle >= 4.7 && angle <= 1.5 && !isRightHand()) {
                    setHand('right')
                    setHandChanged(true)
                }
                if (event.touches && event.touches[0] && typeof event.touches[0]["force"] !== "undefined") {
                    if (event.touches[0]["force"] > 0) {
                        document.getElementById("angle").innerHTML = event.touches[0]["force"]
                    }
                }
            }
            let r = getLineWidth() / 2
            singleTouch = true;
            doubleTouch = false;
            const touch0X = cursorX = event.touches[0]?.pageX - r;
            const touch0Y = cursorY = event.touches[0]?.pageY - r;

            const scaledX = touch0X;
            const scaledY = toTrueY(touch0Y);

            prevCursorX = !prevCursorX ? 0 : prevTouches[0]?.pageX
            prevCursorY = !prevCursorY ? 0 : prevTouches[0]?.pageY
            // prevCursorX = !prevCursorX ? 0 : prevTouches[0].pageX
            // prevCursorY = !prevCursorY ? 0 : touch0Y
            onStrokeStart(scaledX, scaledY, touch0X, touch0Y)

        } else if (event.touches.length >= 2) {
            removeLastStroke(event.touches[0], event.touches[1], getOffsetY())
            // moveFeedback()
            singleTouch = false;
            doubleTouch = true;
        }

        // store the last touches
        prevTouches[0] = event.touches[0]
        prevTouches[1] = event.touches[1]

        // prevCursorX = cursorX
        // prevCursorY = cursorY

        cursorX = event.touches[0].pageX
        cursorY = event.touches[0].pageY

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
            onStrokeMove(prevScaledX, prevScaledY, scaledX, scaledY, touchSpeed)
            if (event.touches && event.touches[0] && typeof event.touches[0]["force"] !== "undefined") {
                if (event.touches[0]["force"] > 0) {
                    document.getElementById("angle").innerHTML = event.touches[0]["force"]
                }
            }
        } if (doubleTouch) {
            startScroll(Math.abs(touchSpeed[1]), prevTouch0Y, touch0Y)

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
        isDrawing = false;
        if (requestId) {
            cancelAnimationFrame(requestId);
            requestId = undefined;
        }
        singleTouch = false;
        doubleTouch = false;
        endScroll();

        startX = undefined;
        startY = undefined;

    }

    function onStrokeEnd() {

        if (currTile && !currTile.watercolor && currTile && !currTile.filled && getFillRatio(currTile, smallOffset) > getFillMin()) {
            currTile.filled = true;
            completeTile2(currTile, currTiling, invisCol)
        }
        if(currTile && !strokeMove && !currTile.watercolor) {
            currTile.dotType = currTile.dotType ? currTile.dotType : dotTypesHelper(currTile.strokeType)
            drawJustDot(currTile)
        }
        dotRemoved = false;
        resetLineWidth()
        reduceAudio()
        colorDelay()
        clearTimeout(watercolorTimer)
        clearInterval(reduceOpac)
        sendAlert()
        insidePoly = [0, 0]
        tooFast = false;
        prevTile = currTile;
        prevTiling = currTiling;
        clearTimeout(hidePreviewInterval)
        clearInterval(timerId)
        clearInterval(midId)
        ratio = 0;
        firstMove = false;
        setHandChanged(false)
        setDragging(false)
        strokeMove = false;
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


    function showFeedback(x, y) {
        // circle?.animate({ d: cloudPoints }, 1500, mina.easeout);
        // bubble.style.transition = 'top 10s, left 10s'
        // bubbleHelper(x,y)
        // gsap.to(".thought", {opacity: 1, duration: 1, delay: 0,})
    }

    let slowArr = ['slow', 'soften', 'release', 'calm', 'rest', 'ease', 'soothe', 'relax']
    let goodArr = ['good', 'feel', 'grow', 'unwind', 'embrace', 'observe', 'reflect',]
    let focusArr = ['focus', 'notice', 'recognize', "center"]

    let word = ''

    const delay = ms => new Promise(res => setTimeout(res, ms));

    let sendingAlert = false;

    async function generateAlert() {
        let insideRatio = insidePoly[1] / insidePoly[0]
        // console.log(insideRatio)
        if (tooFast) {
            word = slowArr[Math.floor(Math.random() * slowArr.length)]
            toSpeech(word)
            sendingAlert = true;
        } else if (insideRatio >= .6) {
            toSpeech(focusArr[Math.floor(Math.random() * focusArr.length)])
            sendingAlert = true;
        } else if (insideRatio < 0.5 && insidePoly[0] !== 0) {
            toCloud(goodArr[Math.floor(Math.random() * goodArr.length)])
            sendingAlert = true;
        }
        await delay(8000)
        sendingAlert = false;
    }

    let alertInterval = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // random num between 5 and 10
    let count = 0;

    async function sendAlert() {
        if (!isPanelOn() && !sendingAlert) {
            if (count === alertInterval) {
                generateAlert();
                alertInterval = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
                count = 0;
            } else count++
        }
    }


    return (
        <div className="App">
            <style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400&display=swap');</style>
            <Helmet>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            </Helmet>
            <button id="cp-button" onClick={showControlPanel}></button>
            <ControlPanel/>
            {/*<div id="feedbackBar"></div>*/}
            <div id="angle" style={{position: "absolute", top: 0, display: 'none'}}> {angle}</div>
            <div id="thought" style={{transform: 'scale(.9)',}}></div>
            <Music/>
            <div id="dots"></div>

            <div className="wrapper" id = "wrapper">
                <div id = "canvas-wrapper">
                <canvas ref={canvas} id="fill-canvas"></canvas>
                <canvas id="top-canvas" style={{display: ''}}></canvas>

                    <canvas id="invis-canvas" style={{display: 'none',}}
                ></canvas>
                <canvas id="tiling-canvas" style={{display: '', background: '', zIndex: 2}}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        onTouchCancel={onTouchEnd}
                        onTouchMove={onTouchMove}
                >
                </canvas>
                </div>
                {/*<div id = "overlay">*/}
                {/*    <div id = 'overlayTop'> </div>*/}
                {/*    <div id = 'overlayBottom'> </div>*/}
                {/*</div>*/}
                <div id = "gradRectangle"></div>

            </div>
            <div id="hidden">
                <div id = "hiddenTop"></div>
                <div id = "hiddenBottom"></div>
            </div>
            <Bubble/>
        </div>
    );
}

export default App;