import {TOP_CANV} from "../../Constants";

let canvStr = TOP_CANV

export function fillGrad(currTile, col, dir) {
    let ctx = document.getElementById(canvStr).getContext('2d');
    let [xmin, xmax, ymin, ymax] = currTile.bounds

    // animate the gradient position to the right
    let offset = 0;
    const int = setInterval(() => {
        offset += 5; // adjust the value to control the speed of the animation

        let grd = null;
        switch (dir) {
            case "right":
                grd = ctx.createLinearGradient(`${xmin - 400 + offset}`, "0", `${xmax + offset}`, "0");
                break;
            case "left":
                grd = ctx.createLinearGradient(`${xmin - 400 - offset}`, "0", `${xmax - offset}`, "0");
                break;
            case "down":
                grd = ctx.createLinearGradient("0", `${ymin - 400 + offset}`, "0", `${ymax + offset}`);
                break;
            case "up":
                grd = ctx.createLinearGradient("0", `${ymin - 400 - offset}`, "0", `${ymax - offset}`);
                break;
            default:
                break;
        }
        grd.addColorStop(0, col);
        grd.addColorStop(1, "white");
        ctx.fillStyle = grd
        ctx.fill(currTile.path);

        if (offset > 800) {
            currTile.filled = true;
            ctx.fillStyle = col;
            ctx.fill(currTile.path);
            clearInterval(int)
        }
    }, 50); // adjust the interval time to control the smoothness of the animation
}

export function fillTilesIndiv(tiles, col, dir) { // fill tiles individually
    let ctx = document.getElementById(canvStr).getContext('2d');

    // animate the gradient position to the right
    let offset = 0;
    const int = setInterval(() => {
        offset += 5; // adjust the value to control the speed of the animation

        tiles.forEach(function (t) {
            let [xmin, xmax, ymin, ymax] = t.bounds

            let grd = null;
            switch (dir) {
                case "right":
                    grd = ctx.createLinearGradient(`${xmin - 400 + offset}`, "0", `${xmax + offset}`, "0");
                    break;
                case "left":
                    grd = ctx.createLinearGradient(`${xmin - 400 - offset}`, "0", `${xmax - offset}`, "0");
                    break;
                case "down":
                    grd = ctx.createLinearGradient("0", `${ymin - 400 + offset}`, "0", `${ymax + offset}`);
                    break;
                case "up":
                    grd = ctx.createLinearGradient("0", `${ymin - 400 - offset}`, "0", `${ymax - offset}`);
                    break;
                default:
                    break;
            }
            grd.addColorStop(0, col);
            grd.addColorStop(1, "white");
            ctx.fillStyle = grd
            ctx.fill(t.path);
        })

        if (offset > 800) {
            ctx.fillStyle = col;

            tiles.forEach(function (t) {
                t.filled = true;
                ctx.fill(t.path);
            })
            clearInterval(int)
        }
    }, 50); // adjust the interval time to control the smoothness of the animation
}

export function fillTilesTogeth(tiles, col, dir) { // fill tiles together
    let ctx = document.getElementById(canvStr).getContext('2d');

    // animate the gradient position to the right
    let offset = 0;
    const int = setInterval(() => {
        offset += 10; // adjust the value to control the speed of the animation
        let [xmin, xmax, ymin, ymax] = tiles.reduce(function(prev, curr) {
            return [
                Math.min(prev[0], curr.bounds[0]), // minimum of all xmin values
                Math.max(prev[1], curr.bounds[1]), // maximum of all xmax values
                Math.min(prev[2], curr.bounds[2]), // minimum of all ymin values
                Math.max(prev[3], curr.bounds[3]), // maximum of all ymax values
            ];
        }, [Infinity, -Infinity, Infinity, -Infinity]);
        let center = [xmin + (xmax-xmin)/2, ymin + (ymax-ymin)/2]
        tiles.forEach(function (t) {
            let [x0, x1, y0, y1] = t.bounds
            let grd = null;
            switch (dir) {
                case "right":
                    grd = ctx.createLinearGradient(`${xmin - 2*(xmax-xmin) + offset}`, "0", `${xmax + offset}`, "0");
                    break;
                case "left":
                    grd = ctx.createLinearGradient(`${xmin - 2*(xmax-xmin) - offset}`, "0", `${xmax - offset}`, "0");
                    break;
                case "down":
                    grd = ctx.createLinearGradient("0", `${ymin - 2*(xmax-xmin) + offset}`, "0", `${ymax + offset}`);
                    break;
                case "up":
                    grd = ctx.createLinearGradient("0", `${ymin - 2*(xmax-xmin) - offset}`, "0", `${ymax - offset}`);
                    break;
                case "center":
                    if(x1 <= center[0] && y1 <= center[1]) grd = ctx.createLinearGradient(`${xmin - (xmax-xmin) + offset}`, `${ymin  + offset}`, `${center[0] - (xmax-xmin)  + offset}`, `${center[1] + offset}`);
                    else if(x1 <= center[0] && y1 >= center[1]) grd = ctx.createLinearGradient(`${xmin - (xmax-xmin) + offset}`, `${ymax  - offset}`, `${center[0] - (xmax-xmin)  + offset}`, `${center[1] - offset}`);
                    else if(x1 > center[0] && y1 < center[1]) grd = ctx.createLinearGradient(`${xmax + (xmax-xmin) - offset}`, `${ymin  + offset}`, `${center[0] + (xmax-xmin) - offset }`, `${center[1] + offset}`);
                    else if(x1 > center[0] && y1 > center[1]) grd = ctx.createLinearGradient(`${xmax + (xmax-xmin) - offset}`, `${ymax  - offset}`, `${center[0]  + (xmax-xmin)  - offset}`, `${center[1] - offset}`);
                    break;
                default:
                    break;
            }
            grd.addColorStop(0, col);
            grd.addColorStop(1, "white");
            ctx.fillStyle = grd
            ctx.fill(t.path);
        })
        if (offset > 4*(xmax-xmin)) {
            ctx.fillStyle = col;

            tiles.forEach(function (t) {
                t.filled = true;
                ctx.fill(t.path);
            })
            clearInterval(int)
        }
    }, 50); // adjust the interval time to control the smoothness of the animation
}

export function fillNeighGrad(currTile, tiles, col) {
    let [x0, x1, y0, y1] = currTile.bounds;
    let mid = [x0 + Math.abs(x1-x0)/2, y0 + Math.abs(y1-y0)/2]
    let ctx = document.getElementById(canvStr).getContext('2d');

    // animate the gradient position to the right
    let offset = 50;
    const int = setInterval(() => {
        offset += 5; // adjust the value to control the speed of the animation

        tiles.forEach(function (t) {
            let grd = ctx.createRadialGradient(`${mid[0]}`, `${mid[1]}`, 0,`${mid[0]}`, `${mid[1]}`, offset  );
            grd.addColorStop(0, col);
            grd.addColorStop(1, "white");
            ctx.fillStyle = grd
            ctx.fill(t.path);
        })

        if (offset > 1000) {
            ctx.fillStyle = col;

            tiles.forEach(function (t) {
                t.filled = true;
                ctx.fill(t.path);
            })
            clearInterval(int)
        }
    }, 50); // adjust the interval time to control the smoothness of the animation
}
