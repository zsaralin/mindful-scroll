import tilingObject from "./TestTiling";
import Delaunator  from 'delaunator';
// sets transition value to 0.95 or 1.05 for segments with len == 2
function getRandomTransition() {
    return [0.98, 1.02][Math.floor(Math.random() * 2)]
}

let tilingArr = []
let yMinArr = []
let yMaxArr = []
let pathArr = [] //array of path dict for each tiling

let vert =[];
let nextVert ;

export function sumArray(){
    // const yMaxSum = yMaxArr.reduce(
    //     (previousValue, currentValue) => previousValue + currentValue, 0);
    // return yMaxSum ;
    return yMaxArr.length > 0 ? yMaxArr[yMaxArr.length - 1] : 0
}

export function addToTilingArr() {
    let x = tilingObject.makeRandomTiling()
    let tiling = x.tiling; let edges = x.edges
    // tilingArr.push({tiling: tiling, edges: edges, transition: getRandomTransition()})
    let [yMin, yMax] = tilingObject.getYBounds(x.tiling, x.edges, sumArray())
    // while (yMin !== 0){
    //     x = tilingObject.makeRandomTiling()
    //     tiling = x.tiling; edges = x.edges
    //     yMin = tilingObject.getYBounds(x.tiling, x.edges)[0]
    // }
    // if (yMinArr.length > 0 && yMin < yMaxArr[yMaxArr.length-1]){
    //     yMaxArr[yMaxArr.length - 1] = yMaxArr[yMaxArr.length - 1] + (yMaxArr[yMaxArr.length-1]-yMin)}
    let numTiling = tilingArr.length
    tilingArr.push({tiling: tiling, edges: edges, transition: getRandomTransition()})
    console.log(`tiling: ${tilingArrLength()} yMin: ${yMin} yMax: ${yMax+sumArray()}`)

    const pathDict = tilingObject.drawTiling(yMaxArr.length > 0  ? yMaxArr[yMaxArr.length - 1] + (yMaxArr[yMaxArr.length-1]-yMin):0, tiling, edges, tilingArr[numTiling].transition)
    // const [topVert, bottomVert] = tilingObject.findBottom(tiling, edges, yMin , yMax  , sumArray())
    // if (tilingArr.length === 1){
    //     nextVert = bottomVert;
    // }
    // else{
    //     vert.push(nextVert.concat(topVert))
    //     nextVert = bottomVert
    // }
    pathArr.push(pathDict);
    if(yMaxArr.length > 0){
    yMinArr.push(yMin+ (yMaxArr[yMaxArr.length-1]-yMin));
    yMaxArr.push(yMax + (yMaxArr[yMaxArr.length-1]-yMin) + 100)}
    else{
        yMinArr.push(yMin )
        yMaxArr.push(yMax + 100)
    }

}

export function redrawTilings(offsetY) {
    var tilingCanvas = document.getElementById('tiling-canvas');
    var tilingCtx = tilingCanvas.getContext('2d');
    tilingCtx.fillStyle = "red"; //white transparent canvas

    // let q = tilingArr.length > 2 ? tilingArr.length - 2 : 0
    let q = 0;
    for (let i = q; i < tilingArr.length; i++) {


    if(vert.length >= 1 && vert[i] !== undefined){
            // console.log(vert[i].toString())
            // console.log('inside of what here ' + JSON.stringify(vert[i]))
            const delaunay = Delaunator.from(vert[i])
            // console.log('trianlges ' + (delaunay.triangles))
        // console.log('triangles ' + delaunay.toString() )
        tilingObject.fillTiling(pathArr[i], delaunay.triangles, vert[i])}
        else{
            tilingObject.fillTiling(pathArr[i])
        }
            tilingCtx.fillRect(700, yMaxArr[i], 500, 9 )
        tilingCtx.fillRect(50, yMinArr[i], 500, 9 )

}
}

export function tilingArrLength() {
    return tilingArr.length
}