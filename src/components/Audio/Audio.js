import {useState} from "react";
import {getRandomTrack} from "./Tracks";
import GenerativeMusic from './GenerativeMusic.js';

let audio = new Audio(getRandomTrack());
let audioOn = true;

const music = new GenerativeMusic();

export function getAbsArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.abs(arr[i])
    }
    return arr
}

export default function Music() {
    const [intro, setIntro] = useState(true); // do not remove useState

    function playMusic() {
        // music.handleUserAction()
        // music.start()
        audio.volume = 0.1
        audio.addEventListener("ended", () => {
            let audio = new Audio(getRandomTrack());
            audio.play()
            // Do something here when the audio has ended
        });
        let playPromise = audio.play()
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
        <div className="introPage"  style={{visibility: intro ? 'visible' : 'hidden', }}>
            <div className="introPage"
                 onClick={playMusic}
                 style={{visibility: intro ? 'visible' : 'hidden', }}
            > {intro ? "click anywhere to start" : ""} </div>
        </div>
    );
        //      onClick={playMusic}
        //      style={{visibility: intro ? 'visible' : 'hidden', }}
        // > {intro ? "click anywhere to start" : ""} </div>
    // );
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
