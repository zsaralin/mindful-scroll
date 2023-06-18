import {redrawCanvas, refreshPage} from "../Scroll/PageScroll";
import {getBoundsTile, getBoundsTiling} from "./TilingBounds";
import {getYPadding} from "./TilingSize";
import {getTile, refreshTilings, tilingsDrawn} from "./Tiling3";
const mediaQuery = window.matchMedia('(max-width: 480px)');

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
            pathVar = !mediaQuery.matches ?  [300, 400][Math.floor(Math.random() * 2)]: 100//200
            rightEdge = (window.innerWidth - pathVar)
            leftEdge = pathVar
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
            rightEdge =  (window.innerWidth - (getYPadding() + 1.5 * pathVar))
            leftEdge = getYPadding()
        } else if(path === "rightDiagonal"){
            pathVar = Math.max((y - tileYMin) / 2 + w / 10, 1)
            rightEdge = (window.innerWidth - (getYPadding()+1.5*pathVar) )
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

export function checkOverlap(pathDict1, pathDict2, offset){
    const off = typeof  offset !== 'undefined' ? offset: 0
    for (const key in pathDict1) {
        const box1 = pathDict1[key].bounds;
        const xmin1 = box1[0];
        const xmax1 = box1[1];
        const ymin1 = box1[2] + off;
        const ymax1 = box1[3]+ off;
        // let c = document.getElementById('top-canvas').getContext('2d')
        // c.save()
        // c.translate(0,off)
        // c.fillStyle = 'pink'
        // c.fill(pathDict1[key].path)
        // c.restore()
        for (const key in pathDict2) {
            const box2 = pathDict2[key].bounds
            const xmin2 = box2[0];
            const xmax2 = box2[1];
            const ymin2 = box2[2]  ;
            const ymax2 = box2[3]  ;
            // let c = document.getElementById('top-canvas').getContext('2d')
            // c.fillStyle = 'green'
            // c.fill(pathDict2[key].path)
            // console.log(ymax1 + ' and ' + ymax2)
            if (
                xmin1 > xmax2 + 25 ||
                xmax1 + 25 < xmin2 ||
                ymin1 > ymax2 + 25 ||
                ymax1 + 25 < ymin2
            ) {
                // Boxes do not overlap
                continue;
            } else {
                // Boxes overlap
                // console.log('true')
                // console.log(ymin1)
                        // let c = document.getElementById('top-canvas').getContext('2d')
                        // c.fillStyle = 'blue'
                        // c.fill(pathDict2[key].path)
                // c.strokeWidth = 50
                // c.strokeStyle = "red"
                //         c.strokeRect(xmin2, ymin2, xmax2-xmin2, ymax2-ymin2)
                // c.strokeStyle = "pink"
                // c.strokeRect(xmin1, ymin1, xmax1-xmin1, ymax1-ymin1)

                delete pathDict2[key];
                        // break; // Remove this line if you want to delete all matching objects
                    }
                }
                // return true;
    }

    // No overlap found
    // console.log('false')

    // return false;
}
