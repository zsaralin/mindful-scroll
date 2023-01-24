import {useState} from "react";

let audio = new Audio('https://audio.jukehost.co.uk/M8pzlNF3rdamYbcdo7cLg9b41gfwqC1b');
let audioOn = true;

export function getAbsArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.abs(arr[i])
    }
    return arr
}

export default function Music() {
    const [intro, setIntro] = useState(true);

    function playMusic() {
        let playPromise = audio.play()
        audio.volume = 0.2
        if (playPromise !== undefined) {
            playPromise.then(function () {
                // Automatic playback started!
            }).catch(function (error) {
                // Automatic playback failed.
                // Show a UI element to let the user manually start playback.
            });
            setIntro(false)
        }
    }

    return (
        <div className="introPage"
             onClick={playMusic}
             style={{visibility: intro ? 'visible' : 'hidden'}}
        > {intro ? "Click Anywhere to Start!" : ""} </div>
    );
};

export function changeAudio(speedArr) {
    clearInterval(reduce)
    let speed = getAbsArray(speedArr)
    if ((speed[0] > 5 || speed[1] > 5) && audio.volume > 0.2) audio.volume -= 0.005
    else if ((speed[0] < 5 || speed[1] < 5) && audio.volume < 0.8) audio.volume += .005
}

let reduce;

export function reduceAudio() {
    reduce = setInterval(function () {
        if (audio.volume > 0.2) {
            audio.volume -= 0.05
        } else {
            clearInterval(reduce)
            return
        }
    }, 200);
}

let volChange;

function startVolume(){
    volChange = setInterval(function () {
        audio.volume += .1
        if(audio.volume >= .2){
            clearInterval(volChange)
            return
        }
    }, 500);
}
function stopVolume(){
    volChange = setInterval(function () {
        audio.volume -= .1
        if(audio.volume <=0){
            clearInterval(volChange)
            return
        }
    }, 500);
}

export function triggerAudio(){
    clearInterval(volChange)
    audioOn ? stopVolume(): startVolume()
    audioOn = !audioOn
}
