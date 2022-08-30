export function getBoundsTiling(segArr) {
    let xMin = null;
    let xMax = null;
    let yMin = null;
    let yMax = null;
    for (let i = 0; i < segArr.length; i++) {
        let tile = segArr[i]
        let [tileXMin, tileXMax, tileYMin, tileYMax] = getBoundsTile(tile)
        if (xMin === null || tileXMin < xMin) {
            xMin = tileXMin;
        }
        if (xMax === null || tileXMax > xMax) {
            xMax = tileXMax;
        }
        if (yMin === null || tileYMin < yMin) {
            yMin = tileYMin;
        }
        if (yMax === null || tileYMax > yMax) {
            yMax = tileYMax;
        }
    }

    return [xMin, xMax, yMin, yMax]
}

function getMin(min, p0, p1) {
    if (min === null) return Math.min(p0, p1)
    return Math.min(Math.min(min, p0), p1)
}

function getMax(max, p0, p1) {
    if (max === null) return Math.max(p0, p1)
    return Math.max(Math.max(max, p0), p1)
}

export function getBoundsTile(tile) {
    let tileXMin = null;
    let tileXMax = null;
    let tileYMin = null;
    let tileYMax = null;
    for (let j = 0; j < tile.length; j++) {
        let seg = tile[j]
        if (seg.length === 2) {
            tileXMin = getMin(tileXMin, seg[0].x, seg[1].x)
            tileXMax = getMax(tileXMax, seg[0].x, seg[1].x)
            tileYMin = getMin(tileYMin, seg[0].y, seg[1].y)
            tileYMax = getMax(tileYMax, seg[0].y, seg[1].y)
        } else {
            tileXMin = getMin(tileXMin, seg[0].x, seg[3].x)
            tileXMax = getMax(tileXMax, seg[0].x, seg[3].x)
            tileYMin = getMin(tileYMin, seg[0].y, seg[3].y)
            tileYMax = getMax(tileYMax, seg[0].y, seg[3].y)
        }
    }
    return [tileXMin, tileXMax, tileYMin, tileYMax]
}