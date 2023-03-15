import {getBoundsTiling2} from "./TilingBounds";

export function getRowCol(pathDict) {
    let tilingBounds = getBoundsTiling2(pathDict)
    let tilingLeft = tilingBounds[0], tilingRight = tilingBounds[1]
    let tilingTop = tilingBounds[2], tilingBottom = tilingBounds[3]
    const topRow = [];
    const bottomRow = [];
    const leftCol = [];
    const rightCol = [];

    for (const key in pathDict) {
        const tile = pathDict[key];
        let [xmin, xmax, ymin, ymax] = tile.bounds
        let w = xmax - xmin
        let h = ymax - ymin
        if (ymin <= tilingTop + h) {
            topRow.push(tile);
        } else if (ymax > tilingBottom - h) {
            bottomRow.push(tile);
        }
        if (xmin < tilingLeft + w / 4 && xmax > tilingLeft + w / 4) {
            leftCol.push(tile);
        } else if (xmax > tilingRight - w / 4 && xmin < tilingRight - w / 4) {
            rightCol.push(tile);
        }
    }
    return [topRow, bottomRow, leftCol, rightCol]
}

export function getNeighbouringTiles(tile, pathDict) {
    let neigh = []
    let segments1 = tile.segs // segments of tile
    // for (const key in pathDict) {
    //     let hasMatch = false;
    //     const seg1 = pathDict[key].segs;
    //     for (let q = 0; q < seg0.length; q++) {
    //         let s = seg0[q]
    //         if(!s[0] || !s[3]) continue
    //         for (let k = 0; k < seg1.length; k++) {
    //             let s1 = seg1[k]
    //             if(!s1) continue
    //             if (s.length === 2 && s1.length === 2) {
    //             hasMatch = (s[0].x === s1[1].x && s[0].y === s1[1].y) ||
    //                 (s[1].x === s1[0].x && s[1].y === s1[0].y) ||
    //                 (s[0].x === s1[0].x && s[0].y === s1[0].y) ||
    //                 (s[1].x === s1[1].x && s[1].y === s1[1].y);
    //             if (hasMatch) {
    //                 neigh.push(pathDict[key])
    //             }
    //         } else {
    //             // hasMatch = (s[0].x === s1[3].x && s[0].y === s1[3].y) ||
    //             //     (s[3].x === s1[0].x && s[3].y === s1[0].y) ||
    //             //     (s[0].x === s1[0].x && s[0].y === s1[0].y) ||
    //             //     (s[3].x === s1[3].x && s[3].y === s1[3].y);
    //             // if (hasMatch) {
    //             //     neigh.push(pathDict[key])
    //             // }
    //                 for (let i = 0; i < s.length; i++) {
    //                     for (let j = 0; j < s1.length; j++) {
    //                         if (s[i].x === s1[j].x && s[i].y === s1[j].y) {
    //                             hasMatch = true;
    //                             neigh.push(pathDict[key])
    //                             break;
    //                         }
    //                     }
    //                     if (hasMatch) {
    //                         neigh.push(pathDict[key])
    //
    //                         break;
    //                     }
    //                 }
    //         }
    //     }}
    //     // let hasMatch = v2.some(value1 => v.some(value2 => value2.x === value1.x && value2.y === value1.y));
    //     if (hasMatch) {
    //         neigh.push(pathDict[key])
    //     }
    // }
    for (const key in pathDict) {
        let hasMatch = false;
        const segments2 = pathDict[key].segs;
            for (let i = 0; i < segments1.length; i++) {
                if(hasMatch) break;
                for (let j = 0; j < segments2.length; j++) {
                    if(hasMatch) break;
                    const seg1 = segments1[i];
                    const seg2 = segments2[j];
                    // console.log(seg1.length + ' and ' + seg2.length)
                    if (seg1.length === 2 && seg2.length === 2){
                        if (
                            (seg1[0].x === seg2[0].x && seg1[0].y === seg2[0].y &&
                                seg1[1].x === seg2[1].x && seg1[1].y === seg2[1].y) ||
                            (seg1[0].x === seg2[1].x && seg1[0].y === seg2[1].y &&
                                seg1[1].x === seg2[0].x && seg1[1].y === seg2[0].y)
                        ) {
                            hasMatch = true;

                        }
                    }
                    else if(seg1.length === 4 && seg2.length === 4){
                        if (
                            (seg1[0].x === seg2[0].x && seg1[0].y === seg2[0].y &&
                                seg1[3].x === seg2[3].x && seg1[3].y === seg2[3].y) ||
                            (seg1[0].x === seg2[3].x && seg1[0].y === seg2[3].y &&
                                seg1[3].x === seg2[0].x && seg1[3].y === seg2[0].y)
                        ) {
                            hasMatch = true;
                        }
                    }
                    if(hasMatch) {
                        neigh.push(pathDict[key])
                        break;
                    }
                }
            }
                // if(hasMatch) break;

    }
    return neigh
}
