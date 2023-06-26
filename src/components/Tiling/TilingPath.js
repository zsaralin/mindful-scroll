import {redrawCanvas, refreshPage} from "../Scroll/PageScroll";
import {getBoundsTile, getBoundsTiling} from "./TilingBounds";
import {getYPadding} from "./TilingSize";
import {getTile, refreshTilings, tilingsDrawn} from "./Tiling3";

const mediaQuery = window.matchMedia('(max-width: 480px)');

export let path = "rect";
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
    setPath()
    numTilings++
    let [xmin, xmax, ymin, ymax] = getBoundsTiling(tiling)
    let w = xmax - xmin
    let y = ymax - ymin
    let pathVar;
    let rightEdge;
    let leftEdge;

    for (let i = 0; i < tiling.length; i++) {
        let tile = tiling[i]
        let [tileXMin, tileXMax, tileYMin, tileYMax] = getBoundsTile(tile)
        // console.log([tileXMin, tileXMax, tileYMin, tileYMax] )
        if (path === "rect") {
            pathVar = !mediaQuery.matches ? [300, 400][Math.floor(Math.random() * 2)] : 100
            rightEdge = (window.innerWidth - pathVar)
            leftEdge = pathVar
        } else if (path === "triangle") {
            pathVar = Math.max(tileYMin / 4  + w / 10, 1)
            rightEdge = (window.innerWidth - (getYPadding() + pathVar))
            leftEdge = getYPadding() + pathVar
        } else if (path === "revTriangle") {
            pathVar = Math.max((y - tileYMin) / 4 + w / 10, 1)
            rightEdge = (window.innerWidth - (getYPadding() + pathVar))
            leftEdge = getYPadding() + pathVar
        } else if (path === "rightTriangle") {
            pathVar = Math.max((y - tileYMin) / 5 + w / 10, 1)
            rightEdge = (window.innerWidth - (getYPadding()))
            leftEdge = getYPadding() + pathVar
        } else if (path === "leftTriangle") {
            pathVar = Math.max((y - tileYMin) / 5 + w / 10, 1)
            rightEdge = (window.innerWidth - (getYPadding() + 1.5 * pathVar))
            leftEdge = getYPadding()
        } else if (path === "rightDiagonal") {
            pathVar = Math.max((y - tileYMin) / 5 + w / 10, 1)
            rightEdge = (window.innerWidth - (getYPadding() + 1.5 * pathVar))
            leftEdge = rightEdge - window.innerWidth / 4
        } else if (path === "leftDiagonal") {
            pathVar = Math.max((y - tileYMin) / 5 + w / 10, 1)
            leftEdge = getYPadding() + 2 * pathVar
            rightEdge = leftEdge + window.innerWidth / 4
        } else if (path === "wiggly") {
            let section = y / 6
            // Determine the index of the quarter that y falls into (0, 1, 2, or 3)
            const cutSection = window.innerWidth / 2
            const quarterIndex = Math.floor((tileYMin + section) / section);
            pathVar = quarterIndex % 2 === 0 ? cutSection : -cutSection
            rightEdge = (window.innerWidth - (getYPadding() + pathVar))
            leftEdge = getYPadding() + pathVar
        } else if (path === "wiggly2") {
            let section = y / 6
            const cutSection = window.innerWidth / 2
            // Determine the index of the quarter that y falls into (0, 1, 2, or 3)
            const quarterIndex = Math.floor((tileYMin + section) / section);
            pathVar = quarterIndex % 2 === 0 ? cutSection : -cutSection
            rightEdge = (window.innerWidth - (getYPadding() - pathVar))
            leftEdge = getYPadding() + pathVar
        } else if(path === "randWiggly"){
            let section = y / 6
            const cutSection = window.innerWidth / 2
            // Determine the index of the quarter that y falls into (0, 1, 2, or 3)
            // const quarterIndex = Math.floor((tileYMin + section) / section);
            pathVar = cutSection
            let leftPath =0; let rightPath=0;
            if(Math.random() < .4){ leftPath = cutSection}
            if(Math.random() > .6){rightPath = cutSection }
            rightEdge = (window.innerWidth - (getYPadding() + rightPath))
            leftEdge = getYPadding() + leftPath
        }
        if (tileXMax < leftEdge || tileXMin > rightEdge) {//&& x1 > leftEdge && x1 < rightEdge) {
            console.log('hey')
            tiling.splice(i, 1); // remove the current tile from the array
            i--; // decrement the index to account for the removed element        }
        } else if (Math.random() < .1) {
            // tiling.splice(i, 1); // remove the current tile from the array
            // i--; // decrement the index to account for the removed element
        }

    }

    return tiling
}

export function checkOverlap(pathDict1, pathDict2, offset) {
    const off = typeof offset !== 'undefined' ? offset : 0
    for (const key in pathDict1) {
        const box1 = pathDict1[key].bounds;
        const xmin1 = box1[0];
        const xmax1 = box1[1];
        const ymin1 = box1[2] + off;
        const ymax1 = box1[3] + off;
        for (const key in pathDict2) {
            const box2 = pathDict2[key].bounds
            const xmin2 = box2[0];
            const xmax2 = box2[1];
            const ymin2 = box2[2];
            const ymax2 = box2[3];
            if (
                xmin1 > xmax2 + 50 ||
                xmax1 + 50 < xmin2 ||
                ymin1 > ymax2 + 50 ||
                ymax1 + 50 < ymin2
            ) {
                // Boxes do not overlap
                continue;
            } else {
                delete pathDict2[key];
            }
        }
    }
}

const pathStrings = ["rect", "triangle", "revTriangle", "rightTriangle", "leftTriangle", "rightDiagonal", "leftDiagonal", "wiggly", "wiggly2", "randWiggly"];
const weightArrayB = [0.6, 0.05, 0.05, 0.05, 0.05, .05, 0.3, 0.3, .3];
const weightArrayS = [0.6, 0,0,0,0,0,0, 0.2, 0.2, .2];

export function setPath() {
    const weights = window.innerWidth > 500 ? weightArrayB : weightArrayS
        const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

        // Generate a random number between 0 and the total weight
        const randomNumber = Math.random() * totalWeight;

        let cumulativeWeight = 0;
        for (let i = 0; i < pathStrings.length; i++) {
            cumulativeWeight += weights[i];
            if (randomNumber < cumulativeWeight) {
                path = pathStrings[i]; // Return the selected path
                return
            }
        }
        path = pathStrings[0];

}