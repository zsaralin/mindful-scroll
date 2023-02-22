import React from "react";
import {getCurrentPathDict, getTilingIndex} from "../Tiling/TilingArr";
import {getOffsetY} from "../Scroll/PageScroll";
import {getLineWidth} from "./StrokeWidth";
import {getCurrColor} from "./StrokeColor";

let context;

export function drawStroke(x0, y0, x1, y1, theLineWidth, theColor, offset) {
    context = document.getElementById('canvas').getContext("2d");
    drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context, offset)
}

export function drawStrokeUnder(x0, y0, x1, y1, theLineWidth, theColor, offset) {
    context = document.getElementById('fill-canvas').getContext("2d");
    drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context, offset)
}

function drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context) {
    context.lineCap = context.lineJoin = 'round'
    context.lineWidth = theLineWidth ? theLineWidth : getLineWidth();
    let r = context.lineWidth/2
    context.strokeStyle = theColor ? theColor : getCurrColor();
    context.beginPath();
    context.moveTo(x0-r, y0-r);
    context.lineTo(x1-r, y1-r);
    context.stroke();
}