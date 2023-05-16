import {redrawCanvas, refreshPage} from "../Scroll/PageScroll";
import {getBoundsTile, getBoundsTiling} from "./TilingBounds";
import {getYPadding} from "./TilingSize";
import {refreshTilings} from "./Tiling3";

let path = "rect";
let numTilings = 0;

export const setPathType = (newPath) => {
    path = newPath;
    refreshTilings()
};


export function getPathPadding(y, tiling) {
    let [xmin, xmax, ymin, ymax] = getBoundsTiling(tiling)
    let h = ymax - ymin
    // console.log('HEIGHT ' + h)
    if (path === "rect") {
        return 1
    } else if (path === "triangle") {
        return Math.max(y / 150, 1)
    } else if (path === "revTriangle") {
        return Math.max(y / 200, 1)
    }
}

export function createPath(tiling) {
    // console.log('path ' + path)
    numTilings++
    let [xmin, xmax, ymin, ymax] = getBoundsTiling(tiling)
    let w = xmax - xmin
    let y = ymax - ymin
    let pathVar; let rightEdge; let leftEdge;

    for (let i = 0; i < tiling.length; i++) {
        let tile = tiling[i]
        let [tileXMin, tileXMax, tileYMin, tileYMax] = getBoundsTile(tile)
        // console.log([tileXMin, tileXMax, tileYMin, tileYMax] )
        if (path === "rect") {
            pathVar = 1;
            rightEdge = (window.innerWidth - (getYPadding() + pathVar))
            leftEdge = getYPadding() + pathVar
        } else if (path === "triangle") {
            pathVar = Math.max( tileYMin/2 + w/10, 1)
            rightEdge = (window.innerWidth - (getYPadding() + pathVar))
            leftEdge = getYPadding() + pathVar
        } else if (path === "revTriangle") {
            pathVar = Math.max((y - tileYMin) / 2 + w / 10, 1)
            rightEdge = (window.innerWidth - (getYPadding() + pathVar))
            leftEdge = getYPadding() + pathVar
        }else if (path === "rightTriangle") {
            pathVar = Math.max((y - tileYMin) / 2 + w / 5, 1)
            rightEdge = (window.innerWidth - (getYPadding()))
            leftEdge = getYPadding() + pathVar
        }else if (path === "leftTriangle") {
            pathVar = Math.max((y - tileYMin) / 2 + w / 10, 1)
            rightEdge = (window.innerWidth - (getYPadding() + 1.5 * pathVar))
            leftEdge = getYPadding()
        } else if(path === "rightDiagonal"){
            pathVar = Math.max((y - tileYMin) / 2 + w / 10, 1)
            rightEdge = (window.innerWidth - (getYPadding() +1.5*pathVar) )
            leftEdge = rightEdge - 400
        } else if(path === "leftDiagonal"){
            pathVar = Math.max((y - tileYMin) / 2 + w / 10, 1)
            leftEdge = getYPadding() + 2*pathVar
            rightEdge = leftEdge + 400;
        }
         else if (path === "wiggly") {
            let section = y/6
            // Determine the index of the quarter that y falls into (0, 1, 2, or 3)
            const quarterIndex = Math.floor((tileYMin + section) / section);
            pathVar = quarterIndex % 2 === 0 ? 300: -300
            rightEdge = (window.innerWidth - (getYPadding() + pathVar))
            leftEdge = getYPadding() + pathVar
        } else if(path === "wiggly2"){
            let section = y/6
            // Determine the index of the quarter that y falls into (0, 1, 2, or 3)
            const quarterIndex = Math.floor((tileYMin + section) / section);
            pathVar = quarterIndex % 2 === 0 ? 400: -400
            rightEdge = (window.innerWidth - (getYPadding() - pathVar))
            leftEdge = getYPadding() + pathVar
        }
        if (tileXMax <leftEdge || tileXMin > rightEdge){//&& x1 > leftEdge && x1 < rightEdge) {
            tiling.splice(i, 1); // remove the current tile from the array
            i--; // decrement the index to account for the removed element        }
        }
    }
return tiling}
