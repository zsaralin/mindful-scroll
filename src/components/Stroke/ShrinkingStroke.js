import {getLineWidth, setLineWidth} from "./StrokeWidth";
import {getCurrColor} from "./StrokeColor";
import {LINE_WIDTH} from "../Constants";

let shrinkStroke = false;

export function drawShrinkingStroke(x0, y0, x1, y1, theColor, theLineWidth) {
    let context = document.getElementById('canvas').getContext("2d");
    let line = createShrinkingStroke(x0, y0, x1, y1, theLineWidth ? theLineWidth : getLineWidth())
    context.fillStyle = theColor ? theColor : getCurrColor();
    context.fill(line);
}

function createShrinkingStroke(x1, y1, x2, y2, theLineWidth) {
    let endWidth = theLineWidth > 15 ? theLineWidth - 5 : 10;
    // calculate direction vector of point 1 and 2
    const directionVectorX = x2 - x1,
        directionVectorY = y2 - y1;
    // calculate angle of perpendicular vector
    const perpendicularVectorAngle = Math.atan2(directionVectorY, directionVectorX) + Math.PI / 2;
    // construct shape
    const path = new Path2D();
    path.arc(x1, y1, theLineWidth / 2, perpendicularVectorAngle, perpendicularVectorAngle + Math.PI);
    path.arc(x2, y2, endWidth / 2, perpendicularVectorAngle + Math.PI, perpendicularVectorAngle);
    path.closePath();
    setLineWidth(endWidth)
    return path;
}

export function triggerShrinkStroke(){
    shrinkStroke = !shrinkStroke
}

export function isShrinkStroke(){
    return shrinkStroke;
}