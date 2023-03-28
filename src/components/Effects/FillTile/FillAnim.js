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
