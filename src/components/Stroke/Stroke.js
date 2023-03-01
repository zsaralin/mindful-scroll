import React from "react";
import {getCurrentPathDict, getTilingIndex} from "../Tiling/TilingArr";
import {getOffsetY} from "../Scroll/PageScroll";
import {getLineWidth} from "./StrokeWidth";
import {getCurrColor} from "./StrokeColor";
import {hslToRgb} from "@mui/material";
import {hsl2Rgb} from "../Effects/FillRatio";


let context;

export function drawStroke(x0, y0, x1, y1, theLineWidth, theColor, offset, context) {
    context = context || document.getElementById('canvas').getContext("2d");
    drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context, offset)
}

export function drawStrokeUnder(x0, y0, x1, y1, theLineWidth, theColor, offset) {
    context = document.getElementById('fill-canvas').getContext("2d");
    drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context, offset)
}

function drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context) {
    context.lineCap = "round"
    context.lineWidth = theLineWidth ? theLineWidth : getLineWidth();
    context.strokeStyle = theColor ? theColor : getCurrColor();
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
}

export function drawBlurryStroke(x0, y0, x1, y1, theLineWidth, theColor, context) {
    context = document.getElementById('canvas').getContext("2d");
    let rgbaColor = theColor ? theColor : getCurrColor()
    if(rgbaColor.charAt(0) === 'h') {
        rgbaColor = hsl2Rgb(rgbaColor)
        rgbaColor = `rgba(${rgbaColor.join(",")},${1})`
    }

    let r = theLineWidth ? theLineWidth : getLineWidth();
    context.beginPath();
    var radialGradient = context.createRadialGradient(x0, y0, 0, x0, y0, r);
    radialGradient.addColorStop(0, rgbaColor);
    radialGradient.addColorStop(1, rgbaColor.substring(0, rgbaColor.length - 2) + '0)');
    context.fillStyle = radialGradient;
    context.fillRect(x0 - r, y0 - r, 150, 150);
    context.closePath();
}