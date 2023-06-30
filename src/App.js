import './App.css';
import './components/Bubble/Bubble.css';
import {useEffect, useRef} from "react";
import {Helmet} from "react-helmet";
import TimerClock, {updateTimer} from './components/Timer.js';
import Music, {outsidePoly, triggerAudio, UID} from './components/Audio/Audio.js'
import {changeAudio, reduceAudio} from './components/Audio/AudioFile'
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
    redrawTileStrokes, strokeArr,
} from './components/Stroke/StrokeType/StrokeArr'
import {addToTilingArr, getTilingIndex, getYMax, redrawTilings, sumArray} from "./components/Tiling/TilingArr";
import {getOffsetY} from './components/Scroll/Offset'
import {
    doScroll, endScroll, getStrokesTop, initCanv, initializeCanv, prevOffsetY,
    redrawCanvas,
    redrawCanvas2, scrollBackAmount, setUpCanvas, startScroll, strokesTop,
    triggerScroll, updateCanvasNew, updateOffCanvas, updateOffCanvasWrapper
} from "./components/Scroll/PageScroll";
import {watercolor} from "./components/Effects/Watercolor";
import {
    changeLineWidth,
    getLineWidth,
    reduceLineWidth,
    resetLineWidth,
    setLineWidth
} from "./components/Stroke/StrokeWidth";
import {
    changeBool,
    getFillMin,
    getFillRatio,
    getTotalPixels, getTotalPixelsSlow,
    isCircleInPath
} from "./components/Tile/FillTile/FillRatio";
import {
    BETWEEN_SPACE,
    BUBBLE_DIST, FIFTH_WINDOW,
    FILL_RATIO,
    SCROLL_DELTA,
    SCROLL_DIST,
    SHAPE_COLOR,
    SWIPE_THRESHOLD, TOP_CANV
} from "./components/Constants";
import {completeTile, fillEachPixel, triggerCompleteTile} from "./components/Tile/CompleteTile";
import {gsap} from "gsap";
import {shapeGlow} from "./components/Tile/Shape";
import ControlPanel, {hideControlPanel, isPanelOn, showControlPanel} from "./components/ControlPanel/ControlPanel";
import Bubble, {
    hideColourPreview, moveFeedback,
    showColourPreview, teleportFeedback,

} from "./components/Bubble/Bubble";
import {
    bottom,
    drawTwo,
    getHeightTiling,
    getOffSmall,
    getTile,
    getTiling, pathArr,
    tilingIndex,
    top
} from "./components/Tiling/Tiling3";
import {isSlowScrollOn} from "./components/Scroll/SlowScroll";
import {endAutoScroll, isAutoScrollActive, startAutoScroll} from "./components/Scroll/AutoScroll";
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
import {completeTile2, basicVersion} from "./components/Tiling/SortingHat/CompleteTile2";
import {dotTypesHelper, helper} from "./components/Tiling/SortingHat/TilingFillType";

import {startScreenshots} from "./components/Logging/Screenshot";
import {logStrokeStart, logStrokeEnd, logStrokeMove, logDot} from "./components/Logging/StrokeLog";
import {logScrollEnd, logScrollMove, logScrollStart} from "./components/Logging/ScrollLog";
import {drawTwoShapes} from "./components/BasicVersion/AddShapes";
import {logRefresh, logStart} from "./components/Logging/TimeLog";
import Bubble2, {hideBubble, showBubble, showBubble2} from "./components/Bubble/Bubble2";
import {logAutoScrollEnd, logAutoScrollStart, logAutoScrollStop} from "./components/Logging/LogAutoScroll";
import {addAudio, getAudio} from "./components/Audio/AudioFile";
import {playFillSound} from "./components/Audio/FillSound";


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
        logStart();
        const canvasIds = ['tiling-canvas', 'invis-canvas', 'fill-canvas', 'top-canvas'];
        canvasIds.forEach(id => {
            const canvas = document.getElementById(id);
            canvas.width = window.innerWidth
            if (basicVersion) {
                canvas.height = window.innerHeight * 3
            } else {
                if (id === 'fill-canvas' || id === "top-canvas") {
                    canvas.height = Math.min(1700 * 3 + scrollBackAmount, window.innerHeight * 6)//(basicVersion ? 3 : 4)+ 400;}
                } else {
                    canvas.height = 1700 * 2 + scrollBackAmount
                }
            }
            // canvas.height = window.innerHeight * 6;
            const ctx = document.getElementById(id).getContext("2d");
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            if (id === 'tiling-canvas') {
                ctx.fillStyle = 'transparent';
                ctx.lineWidth = getTileWidth();
            } else if (id === 'invis-canvas') {
                ctx.lineWidth = ctx.lineWidth / 2;
            }
        });
        basicVersion ? drawTwoShapes() : drawTwo()

        ctx = document.getElementById('invis-canvas').getContext("2d");
        startScreenshots()
        initCanv()
        currTiling = prevTiling = pathArr[0]
        setColourPal(currTiling.colourPal)
        colorDelay()
        updateTimer()
        // addAudio()

    }, []);

    let currColor;
    let firstClick = true;
    let lw;
    let index;
    let smallOffset;

    function onStrokeStart(prevScaledX, prevScaledY, x, y) {
        lw = getLineWidth()
        index = tilingIndex(prevScaledY)
        // console.log(`tilingIndex ${index}`)

        // invisCol = ctx.getImageData(prevScaledX, prevScaledY, 1, 1).data.toString()
        const [r, g, b, a] = ctx.getImageData(prevScaledX, prevScaledY, 1, 1).data;
        const invisCol = [r, g, b, a].join(',')
        if (invisCol === '0,0,0,0') {
            doubleTouch = true;
            logScrollStart(cursorX, cursorY, touchType, numTouches, angle, force, getOffsetY())
            return
        }
        const tiling = getTiling(y, invisCol)
        if (tiling !== false) {
            currTiling = tiling[0]
            currTile = tiling[1]
        } else {
            startX = prevCursorX;
            startY = prevCursorY;
            return
        }
        if (currTile.watercolor) return
        // smallOffset = getOffSmall(index)
        // currTile = getTile(y, invisCol)

        // if (currTiling.colourPal.length === 0) {
        //     if (firstClick) {
        //         currTiling.colourPal = getColourPal()
        //         firstClick = false;
        //         setColourPal(currTiling.colourPal)
        //     }
        // }
        if (prevTiling !== currTiling) {
            setColourPal(currTiling.colourPal)
        }
        // console.log(currTiling.fillInfo.strokeW + ' and ' + currTiling.fillInfo.strokeTypes)
        if (currTile) {
            smallOffset = getOffSmall(index)
            currTile.strokeType = currTile?.strokeType ? currTile.strokeType : helper(currTiling.fillInfo.strokeW, currTiling.fillInfo.strokeTypes)
            console.log('dTROKE TYPEEE ' + currTile.strokeType)
        }
        currColor = getCurrColor()
        // stopColorChange()
        if (currTile && isCircleInPath(currTile.path, prevScaledX, prevScaledY + smallOffset)) {
            // Check if the browser supports the WebHaptic API
            // moveFeedback(prevCursorX, prevCursorY, cursorX, cursorY, prevTile !== currTile)

            pushDot(currTile.id, prevScaledX, prevScaledY, prevScaledX, touchType === "direct" ? prevScaledY + .5 : prevScaledY, currColor, lw, currTiling.dotType);
            if (!basicVersion) watercolorTimer = setTimeout(watercolor, 1500, 25, currTile, currColor, smallOffset, false, "watercolor", prevScaledX, prevScaledY)
            if (currTile.firstCol === "white") currTile.firstCol = currColor
            currTile.colors.push(currColor)

            if (cursorY > FIFTH_WINDOW) {
                startAutoScroll();
                logAutoScrollStart()
            }
            logStrokeStart(cursorX, cursorY, touchType, angle, force, getLineWidth(), currTile.id, currTiling.i, currColor, currTile.filled.toString(), currTile.colors)
            // if (!basicVersion) {
            //     if ((currTile && !prevTile) || (currTile && prevTile && currTile.id !== prevTile.id)) {
            //         timeoutFillSound = setTimeout(() => {
            //             totPixels = totPixels ? totPixels : getTotalPixelsSlow(currTile);
            //             checkFill = setInterval(() => {
            //                 console.log('TOT ' + totPixels + ' and ' + currTile.inPath.length)
            //                 if (totPixels) {
            //                     const currFill = getFillRatio(currTile, smallOffset, TOP_CANV);
            //                     console.log(currFill)
            //                     if (!twinklePlayed && currFill > getFillMin()) {
            //                         clearInterval(checkFill);
            //                         // playFillSound();
            //                         reduceAudio()
            //                         console.log('I AM  BEING PLAYED')
            //                         twinklePlayed = true;
            //                     }
            //                 }
            //             }, 500);
            //         }, 2000); // Delay execution by 5 seconds (5000 milliseconds)
            //     }
            //     else{
            //         totPixels = totPixels ? totPixels : getTotalPixelsSlow(currTile);
            //         checkFill = setInterval(() => {
            //             console.log('TOT ' + totPixels + ' and ' + currTile.inPath.length)
            //             if (totPixels) {
            //                 const currFill = getFillRatio(currTile, smallOffset, TOP_CANV);
            //                 console.log(currFill)
            //                 if (!twinklePlayed && currFill > getFillMin()) {
            //                     clearInterval(checkFill);
            //                     playFillSound();
            //                     console.log('I AM  BEING PLAYED')
            //                     twinklePlayed = true;
            //                 }
            //             }
            //         }, 500);
            //     }
            // }
                // let tiles = getOrienTiles(currTile, currTiling)
                // let tiles = getRow(currTile, currTiling)
                // let tiles = getColumn(currTile, currTiling)
                // let tiles = getCorners(currTiling)
                // let tiles = getCornerTiles(currTiling)
                // fillTilesTogeth(tiles, currColor, "center")
                // fillOrien(currTile, t)
        }
    }

    let checkFill;
    let timeoutFillSound;
    let totPixels;
    let dotRemoved = false;
    let currFill;
    let twinklePlayed = false;

    function onStrokeMove(prevScaledX, prevScaledY, scaledX, scaledY, speed) {
        if (!doubleTouch && currTile && !currTile.watercolor && isCircleInPath(currTile.path, prevScaledX, prevScaledY + smallOffset) && isCircleInPath(currTile.path, scaledX, scaledY + smallOffset)) {
            strokeMove = true;
            hideBubble()
            stopColorChange()
            if (!dotRemoved) {
                removeLastDot(currTile)
                dotRemoved = true;
            }
            if (currTile.strokeType === "reg" && isShrinkStroke()) {
                let sizeChange;
                const absSpeedX = Math.abs(speed[0]);
                const absSpeedY = Math.abs(speed[1]);

                if (absSpeedX > 10 || absSpeedY > 10) {
                    sizeChange = "small";
                } else if (absSpeedX < 10 || absSpeedY < 10) {
                    sizeChange = "big";
                } else {
                    sizeChange = "same";
                }
                pushShrinkingLine(currTile.id, prevScaledX, prevScaledY, scaledX, scaledY, currColor, sizeChange);
                drawShrinkingStroke(prevScaledX, prevScaledY, scaledX, scaledY, currColor, sizeChange);
                tooFast = true;

            } else {
                pushStroke(currTile.id, prevScaledX, prevScaledY, scaledX, scaledY, currColor, getLineWidth(), currTile.strokeType);
                startStroke(currTile.id, prevScaledX, prevScaledY, scaledX, scaledY, getCurrColor(), getLineWidth(), currTile.strokeType);
            }
            changeAudio(touchSpeed)
            if (cursorY > FIFTH_WINDOW) {
                startAutoScroll();
                logAutoScrollStart()
            }
            logStrokeMove(prevCursorX, prevCursorY, cursorX, cursorY, speed[0], speed[1], touchType, angle, force,
                getLineWidth(), currTile.id, currTiling.i, currColor, currTile.strokeType, tooFast.toString(), currTile.filled.toString(), currTile.colors)

        } else {
            if (!doubleTouch) {
                changeAudio()
            }
            insidePoly[1] += 1;
        }
    }

    let midId;

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
            hideBubble()
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
                // showColourPreview(cursorX, cursorY, prevTile !== currTile, getHandChange);
                onStrokeEnd()
            }
        } else {
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

    let angle = "null"
    let force = "null"
    let touchType = "null"
    let numTouches = "null"

    let requestId;


    function onTouchStart(event) {
        touchType = event.touches[0]?.touchType;
        numTouches = event.touches.length
        cursorX = event.touches[0].pageX
        cursorY = event.touches[0].pageY
        if (numTouches === 1) {
            if (touchType === "stylus") {
                const touch = event.touches[0];
                angle = touch.azimuthAngle;
                if (touch.force > 0) {
                    force = touch.force;
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
            logScrollStart(cursorX, cursorY, touchType, numTouches, angle, force, getOffsetY())
            console.log(`x: ${prevCursorX} + y: ${prevCursorY}`)
        }

        // store the last touches
        prevTouches[0] = event.touches[0]
        prevTouches[1] = event.touches[1]

        // prevCursorX = cursorX
        // prevCursorY = cursorY

        // cursorX = event.touches[0].pageX
        // cursorY = event.touches[0].pageY

    }

    let firstMove = false;

    function onTouchMove(event) {
        let r = getLineWidth() / 2

        const touch0X = event.touches[0].pageX - r;
        const touch0Y = event.touches[0].pageY - r;
        const prevTouch0X = prevTouches[0]?.pageX - r;
        const prevTouch0Y = prevTouches[0]?.pageY - r;

        cursorX = event.touches[0].pageX //- r;
        cursorY = event.touches[0].pageY //- r;

        const scaledX = touch0X;
        const scaledY = toTrueY(touch0Y);
        const prevScaledX = prevTouch0X;
        const prevScaledY = toTrueY(prevTouch0Y);
        clearTimeout(watercolorTimer)
        touchSpeed = [touch0X - prevTouch0X, touch0Y - prevTouch0Y]

        if (touchType === "stylus") {
            const touch = event.touches[0];
            angle = touch.azimuthAngle;
            if (touch.force > 0) {
                force = touch.force;
            }
        }

        if (singleTouch) {
            onStrokeMove(prevScaledX, prevScaledY, scaledX, scaledY, touchSpeed)
        }
        if (doubleTouch) {
            startScroll(Math.abs(touchSpeed[1]), prevTouch0Y, touch0Y)
            if (isAutoScrollActive) {
                endAutoScroll()
                logAutoScrollStop()
            }
            logScrollMove(prevCursorX, prevCursorY, cursorX, cursorY, touchSpeed[0], touchSpeed[1], touchType, numTouches, angle, force, getOffsetY())
        }
        prevTouches[0] = event.touches[0];
        prevTouches[1] = event.touches[1];

        prevCursorX = cursorX
        prevCursorY = cursorY

    }

    function onTouchEnd(event) {
        if (!doubleTouch) {
            if (!isPanelOn()) {
                // showColourPreview(currTile, prevTile !== currTile, getHandChange())
                showBubble(currTile, prevTile !== currTile, getHandChange())
                onStrokeEnd()
            }
        } else {
            logScrollEnd(prevCursorX, prevCursorY, touchType, numTouches, angle, force, getOffsetY())
        }
        if (requestId) {
            cancelAnimationFrame(requestId);
            requestId = undefined;
        }
        singleTouch = false;
        doubleTouch = false;
        endScroll();

        startX = undefined;
        startY = undefined;

        angle = "null"
        force = "null"
        touchType = "null"
        numTouches = "null"

    }

    function onStrokeEnd() {
        clearInterval(checkFill)
        clearTimeout(timeoutFillSound)
        if (!basicVersion && currTile && !currTile.watercolor && currTile && !currTile.filled &&
            (currFill > getFillMin() || getFillRatio(currTile, smallOffset, TOP_CANV) > getFillMin())) {
            completeTile2(currTile, currTiling, invisCol)
            twinklePlayed = false;
            clearTimeout(timeoutFillSound)
            currFill = 0;
        }
        if (currTile && !strokeMove && !currTile.watercolor) {
            currTile.dotType = currTile.dotType ? currTile.dotType : dotTypesHelper(currTile.strokeType)
            drawJustDot(currTile)
            logDot(cursorX, cursorY, touchType,
                angle, force, getLineWidth(), currTile.id, currTiling.i, currColor, currTile.dotType, currTile.filled.toString(), currTile.colors)
        }

        updateOffCanvasWrapper()
        dotRemoved = false;
        resetLineWidth()
        reduceAudio()
        // changeAudio()
        colorDelay()
        clearTimeout(watercolorTimer)
        clearInterval(reduceOpac)
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
        totPixels = null;

        if (currTile) {
            logStrokeEnd(cursorX, cursorY, touchType,
                angle, force, getLineWidth(), currTile.id, currTiling.i, currColor, currTile.filled.toString(), currTile.colors)
        }
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

// let alertInterval = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // random num between 5 and 10
// let count = 0;

// async function sendAlert() {
//     if (!isPanelOn() && !sendingAlert) {
//         if (count === alertInterval) {
//             generateAlert();
//             alertInterval = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
//             count = 0;
//         } else count++
//     }
// }

    function getAdminStatus() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('admin');
    }

    const isAdmin = getAdminStatus();

    return (
        <div className="App" id='app'>
            {/*<style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400&display=swap');*/}
            {/*</style>*/}
            {/*<link rel="preload" href="assets/fonts/montserrat.woff" as="font" type="font/montserrat" crossOrigin>*/}

            <Helmet>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            </Helmet>
            <div id="cp-wrapper" style={{display: isAdmin === 'true' ? 'block' : 'none'}}>
                <button id="cp-button" onClick={showControlPanel}></button>
                <ControlPanel/>
            </div>
            <div id="angle" style={{position: "absolute", top: 0, display: 'none'}}> {angle}</div>
            <div id="thought" style={{transform: 'scale(.9)',}}></div>
            <Music/>
            <div id="dots"></div>
            <canvas id="bub-canv" style={{}}></canvas>

            <div className="wrapper" id="wrapper">
                <div id="canvas-wrapper">
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
                <div id="gradRectangle"></div>

            </div>
            {/*<canvas id="bub-canv" style = {{pointerEvent: 'none', zIndex: 4}}></canvas>*/}

            {/*<div id="hidden">*/}
            {/*    <div id = "hiddenTop"></div>*/}
            {/*    <div id = "hiddenBottom"></div>*/}
            {/*</div>*/}
            <Bubble/>


        </div>
    );
}

export default App;