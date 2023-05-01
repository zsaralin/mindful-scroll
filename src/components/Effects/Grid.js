import {getRandomHSV} from "../Stroke/Color/StrokeColor";
import {getAdjTiles, getMidpoint, getNeighTiles, getOrienTiles} from "../Tiling/TilingProperties";
import {getBoundsTiling, getBoundsTiling2} from "../Tiling/TilingBounds";

export function fillRow(tile, t) {
    let row = getRow(tile)
    fillTileHelper(row)
}

export function fillColumn(tile, t) {
    let col = getColumn(tile)
    fillTileHelper(col)
}

export function fillCorners(t) {
    let corners = getCorners(t)
    fillTileHelper(corners)
}

export function fillOrien(tile, t) {
    let tiles = getOrienTiles(tile, t)
    fillTileHelper(tiles)
}

export function fillCornersNeigh(t) {
    let [rows, midpointDict] = t.grid
    let tiles = getCornerTiles(rows, midpointDict, t)
    fillTileHelper(tiles)
}

function fillTileHelper(tiles) {
    const ctx = document.getElementById('top-canvas').getContext("2d");
    ctx.fillStyle = getRandomHSV()
    tiles.forEach(function (t) {
        ctx.fill(t?.path)
    })
}

export function getRow(tile, t) {
    let [rows, midpointDict] = t.grid
    const midpoint = getMidpoint(tile);
    let ans = []
    for (const row of rows) {
        for (let j = 0; j < row.length - 1; j += 2) {
            const currTile = [row[j], row[j + 1]];
            if (Math.floor(midpoint[1] / 150) === Math.floor(currTile[1] / 150)) {
                ans.push(...midpointDict[[row[j], row[j + 1]]])
            }
        }
    }
    return ans;
}

export function getColumn(tile, t) {
    let [rows, midpointDict] = t.grid
    const midpoint = getMidpoint(tile);
    const column = [];
    let rowIndex, columnIndex;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0; j < row.length - 1; j += 2) {
            const currTile = [row[j], row[j + 1]];
            if (Math.floor(midpoint[0] / 150) === Math.floor(currTile[0] / 150)) {
                column.push(...midpointDict[[row[j], row[j + 1]]])
            }
        }
        if (rowIndex !== undefined && columnIndex !== undefined) {
            break;
        }
    }
    return column;
}

export function getCorners(t) {
    let [rows, midpointDict] = t.grid
    rows = rows.flat();
    let minX = rows[0], maxX = rows[0];

    for (let i = 2; i < rows.length; i += 2) {
        let x = rows[i];

        if (x < minX) {
            minX = x;
        } else if (x > maxX) {
            maxX = x;
        }
    }

    let upperLeft = [minX, Number.MAX_SAFE_INTEGER];
    let upperRight = [maxX, Number.MAX_SAFE_INTEGER];
    let lowerLeft = [minX, Number.MIN_SAFE_INTEGER];
    let lowerRight = [maxX, Number.MIN_SAFE_INTEGER];

    for (let i = 0; i < rows.length; i += 2) {
        let x = rows[i], y = rows[i + 1];

        if (x === minX && y < upperLeft[1]) {
            upperLeft = [x, y];
        } else if (x === minX && y > lowerLeft[1]) {
            lowerLeft = [x, y];
        } else if (x === maxX && y < upperRight[1]) {
            upperRight = [x, y];
        } else if (x === maxX && y > lowerRight[1]) {
            lowerRight = [x, y];
        }
    }

    return [...midpointDict[[upperLeft[0], upperLeft[1]]],
        ...midpointDict[[upperRight[0], upperRight[1]]],
        ...midpointDict[[lowerLeft[0], lowerLeft[1]]],
        ...midpointDict[[lowerRight[0], lowerRight[1]]]]
}

export function getCornerTiles(tiling) { // corner + adjacent tiles
    let ret = []
    let cornerArr = getCorners(tiling)
    console.log(cornerArr)
    cornerArr.forEach(function (tile) {
        // let tile = midpointDict[([cornerArr[j], cornerArr[j + 1]])]
        let neigh = getAdjTiles(tile, tiling)
        ret.push(...[tile, ...neigh])
    })
    return ret
}


export function getRowSections(t) {
    let [rows, midpointDict] = t.grid;
    let bounds = t.bounds
    let section = (bounds[3] - bounds[2]) / 5 // quarter height of the tile
    let ans = [[], [], [], []]
    for (const row of rows) {
        for (let j = 0; j < row.length - 1; j += 2) {
            const currTile = [row[j], row[j + 1]];
            if (currTile[1]  < bounds[2] + section) {
                ans[0].push(...midpointDict[[row[j], row[j + 1]]])
            } else if (currTile[1]  < bounds[2] + (section * 2)) {
                ans[1].push(...midpointDict[[row[j], row[j + 1]]])
            } else if (currTile[1]  < bounds[2] + (section * 3)) {
                ans[2].push(...midpointDict[[row[j], row[j + 1]]])
            } else {
                ans[3].push(...midpointDict[[row[j], row[j + 1]]])
            }
        }
    }
    return ans;
}

export function getColSections(t) {
    let [rows, midpointDict] = t.grid;
    let bounds = t.bounds
    let section = (bounds[1] - bounds[0]) / 4 // quarter height of the tile
    let ans = [[], [], [], []]
    let rowIndex, columnIndex;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0; j < row.length - 1; j += 2) {
            const currTile = [row[j], row[j + 1]];
            if (currTile[0]  < bounds[0] + section) {
                ans[0].push(...midpointDict[[row[j], row[j + 1]]])
            } else if (currTile[0]   < bounds[0] + (section * 2)) {
                ans[1].push(...midpointDict[[row[j], row[j + 1]]])
            } else if (currTile[0]  < bounds[0] + (section * 3)) {
                ans[2].push(...midpointDict[[row[j], row[j + 1]]])
            } else {
                ans[3].push(...midpointDict[[row[j], row[j + 1]]])
            }
        }
        if (rowIndex !== undefined && columnIndex !== undefined) {
            break;
        }
    }
    return ans;
}