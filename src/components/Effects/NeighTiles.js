import {overlapOffset, smallOffset} from "../Tiling/Tiling3";

export let animActive = false;
let activeNeigh;
let ctx;
let offset = 50;
let anim;
let currOffset;
export function fillNeighTiles(currTile, tiles, col, smallOff, redraw){
    animActive = true;
    if(!redraw) activeNeigh = {currTile, tiles, col, smallOff}
    currOffset = smallOff
    let [x0, x1, y0, y1] = currTile.bounds;
    let mid = [x0 + Math.abs(x1 - x0) / 2, y0 + Math.abs(y1 - y0) / 2]
    if(!ctx) ctx = document.getElementById('fill-canvas').getContext('2d');
    // animate the gradient position to the right
    // let offset = 50;
    anim = setInterval(() => {
        offset += 5; // adjust the value to control the speed of the animation

        tiles.forEach(function (t) {
            if(t.id !== currTile.id && t.filled) return;
            console.log(mid[0] + ' and ' + mid[1])
            let grd = ctx.createRadialGradient(mid[0], mid[1], 0, mid[0], mid[1] , offset);
            grd.addColorStop(0, col);
            grd.addColorStop(1, "white");
            ctx.fillStyle = grd
            ctx.save()
            ctx.translate(0,-smallOff)
            ctx.fill(t.path);
            ctx.restore()
        })

        if (offset > 1000) {
            ctx.fillStyle = col;

            tiles.forEach(function (t) {
                t.filled = true;
                ctx.save()
                ctx.translate(0,-smallOff)
                ctx.fill(t.path);
                ctx.restore()
            })
            clearInterval(anim)
            animActive = false;
            offset = 50;
        }
    }, 50); // adjust the interval time to control the smoothness of the animation
}

export function redrawActiveNeigh(){
    stopActiveNeigh()
    if(animActive){
        fillNeighTiles(activeNeigh.currTile, activeNeigh.tiles,activeNeigh.col, activeNeigh.smallOff - overlapOffset, true)
    }
}

function stopActiveNeigh(){
    clearInterval(anim)
}