import React from "react";
import {getCurrentPathDict, getTilingIndex} from "../Tiling/TilingArr";
import {getOffsetY} from "../PageScroll";
import {getLineWidth} from "./StrokeWidth";
import {getCurrColor} from "./StrokeColor";

let context;

export function drawStroke(x0, y0, x1, y1, theLineWidth, theColor) {
    context = document.getElementById('canvas').getContext("2d");
    drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context)

}
export function drawStrokeUnder(x0, y0, x1, y1, theLineWidth, theColor) {
    context = document.getElementById('fill-canvas').getContext("2d");
    drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context)
}

function drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context) {
    context.lineCap = context.lineJoin = 'round'
    context.lineWidth = theLineWidth ? theLineWidth : getLineWidth();
    context.strokeStyle = theColor ? theColor : getCurrColor();
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
}