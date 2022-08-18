import React from "react";
import {getCurrentPathDict, getTilingIndex} from "../Tiling/TilingArr";
import {getOffsetY} from "../PageScroll";
import {getLineWidth} from "./StrokeWidth";
import {getCurrColor} from "./StrokeColor";

export function drawStroke(x0, y0, x1, y1, theLineWidth, theColor) {
    let context = document.getElementById('canvas').getContext("2d");
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = theLineWidth ? theLineWidth : getLineWidth();
    context.strokeStyle = theColor ? theColor : getCurrColor();
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
}
