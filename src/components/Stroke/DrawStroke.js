import React from "react";
import {getCurrentPathDict, getTilingIndex} from "../Tiling/TilingArr";
import {getOffsetY} from "../Scroll/PageScroll";
import {getLineWidth} from "./StrokeWidth";
import {getCurrColor} from "./Color/StrokeColor";
import {hsl2Rgb, isCircleInPath} from "../Tile/FillTile/FillRatio";
import {hslToRgb} from "../Effects/ColorTheory";


let context;

export function drawStroke(x0, y0, x1, y1, theColor, theLineWidth, offset, context) {
    context = context || document.getElementById('top-canvas').getContext("2d");
    drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context, offset)
}

export function drawStrokeUnder(x0, y0, x1, y1, theColor, theLineWidth, offset) {
    context = document.getElementById('fill-canvas').getContext("2d");
    drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context, offset)
}

export function drawStrokeHelper(x0, y0, x1, y1, theLineWidth, theColor, context) {
    context.lineWidth = theLineWidth ? theLineWidth : getLineWidth();
    context.strokeStyle = theColor ;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
}
