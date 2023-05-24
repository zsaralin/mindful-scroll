import {getLineWidth, setLineWidth} from "../StrokeWidth";
import {getCurrColor} from "../Color/StrokeColor";
import {LINE_WIDTH} from "../../Constants";

let shrinkStroke = true;

export function drawShrinkingStroke(x0, y0, x1, y1, theColor) {
    let context = document.getElementById('top-canvas').getContext("2d");
    let line = createShrinkingStroke(x0, y0, x1, y1, getLineWidth())
    context.fillStyle = theColor ? theColor : getCurrColor();
    context.fill(line);
}

export function createShrinkingStroke(x1, y1, x2, y2, theLineWidth) {
    let endWidth = theLineWidth > 10 ? theLineWidth - 5 : 10;
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