import {useEffect, useState} from "react";
import {getRandomTrack} from "./Tracks";
import {gsap} from "gsap";
import {addAudio, getAudio} from './AudioFile'
import {basicVersion} from "../Tiling/SortingHat/CompleteTile2";
import {playFillSound, startTone} from "./FillSound";
let audio = new Audio(getRandomTrack());
let audioOn = true;
audio.volume = 0;
let font = false;

export function getAbsArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.abs(arr[i])
    }
    return arr
}

let audioChange = true;
export default function Music() {
    const [intro, setIntro] = useState(true); // do not remove useState

    function playMusic() {
        getAudio()
        playFillSound()
        // const audioContext = new AudioContext();
        // const sourceNode = audioContext.createBufferSource();
        // sourceNode.buffer = audioBuffer;
        //
        // sourceNode.connect(audioContext.destination);
        // console.log('HY')
        // sourceNode.start(0);

        // audio.addEventListener("ended", () => {
        //     audioChange = false;
        //     let audio = new Audio(getRandomTrack());
        //     audio.volume = 0;
        //     audio.play()
        //     playFromRandomTime()
        //     gsap.to(audio,{volume: .1, duration: 10, onComplete: function(){
        //             audioChange = true;
        //         }}) // // Final volume level (range: 0 to 1)
        //     // Do something here when the audio has ended
        // });
        // playFromRandomTime()
        // gsap.to(audio,{volume: .1, duration: 10, onComplete: function(){
        //     audioChange = true;
        //     }}) // // Final volume level (range: 0 to 1)
        setIntro(false)
    }

    return (
        <div className="introPage" style={{visibility: intro ? 'visible' : 'hidden',}}>
            <div id = 'introPage' className="introPage"
                 onClick={playMusic}
                 style={{visibility: intro ? 'visible' : 'hidden',}}
            > {intro ? "click anywhere to start" : ""} </div>
        </div>
    );
};

export function changeAudio(speedArr) {
    if(audioChange) {
        clearInterval(reduce)
        // gsap.killTweensOf(audio)
        if(arguments.length === 0){
            reduceAudioMini()
            return
        }
        let speed = getAbsArray(speedArr)
        if ((speed[0] > 5 || speed[1] > 5) && audio.volume > 0.05) {
            reduceAudioMini()
        }
        else if ((speed[0] < 5 || speed[1] < 5) && audio.volume < 0.3) audio.volume += .001
    }
    function reduceAudioMini(){
        audio.volume -= 0.005
        if (audio.volume <= .05) {
            audioChange = false;
            setTimeout(function () {
                audioChange = true;
            }, 5000);
        }
    }
}


let reduce;

export function reduceAudio() {
    audioChange = false;
    reduce = setInterval(function () {
        if (audio.volume > 0.1) {
            audio.volume -= 0.02
        } else {
            clearInterval(reduce)
            audioChange = true;
            return
        }
    }, 200);
}

let volChange;

function startVolume() {
    volChange = setInterval(function () {
        audio.volume += .1
        if (audio.volume >= .2) {
            clearInterval(volChange)
            return
        }
    }, 500);
}

function stopVolume() {
    volChange = setInterval(function () {
        audio.volume -= .1
        if (audio.volume <= 0) {
            clearInterval(volChange)
            return
        }
    }, 500);
}

export function triggerAudio() {
    clearInterval(volChange)
    audioOn ? stopVolume() : startVolume()
    audioOn = !audioOn
}


// Set a random starting position

// Function to play audio from a specific time
function playFromRandomTime() {
    const audioDuration = audio.duration; // Get the duration of the audio track in seconds
    const randomStartTime = Math.random() * audioDuration; // Generate a random starting time
    audio.currentTime = randomStartTime;
    audio.play();
}

// Function to handle visibility change
function handleVisibilityChange() {
    if (document.hidden) {
        // Tab is not active, pause the audio
        audio.pause();
    } else {
        audio.play()
        // Tab is active, resume or play the audio

    }
}

// Attach visibility change event listener
document.addEventListener('visibilitychange', handleVisibilityChange);