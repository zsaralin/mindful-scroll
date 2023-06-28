import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {UID} from "../Logging/Logging";
import {logIdString} from "../Logging/TimeLog";
import {getAbsArray} from "./Audio";

const storage = getStorage()

export function addAudio() {
    const audioUrl = 'https://audio.jukehost.co.uk/R2jnmSdbIKmBQuqvTV4rAlDwnYdxve7n';
    const storage = getStorage();
    const storageRef = ref(storage, 'audio/filename.mp3');

    fetch(audioUrl)
        .then(response => response.blob())
        .then(blob => {
            // Upload the audio blob to Firebase Cloud Storage
            uploadBytes(storageRef, blob)
                .then((snapshot) => {
                    console.log('Audio file uploaded successfully.');
                    // Access the download URL
                    getDownloadURL(storageRef).then((url) => {
                        console.log('Download URL:', url);
                        // Use the download URL as needed
                    });
                })
                .catch((error) => {
                    console.error('Error uploading audio file:', error);
                });
        })
        .catch((error) => {
            console.error('Error fetching audio file:', error);
        });
}

let audioElement;
let audioContext;
let gainNode;
let audioChange = true;
let requestId;
let targetTime;

export function getAudio() {
    // const audioPath = 'audio/filename.mp3';
    // const storageRef = ref(storage, audioPath);
    //
    // return getDownloadURL(storageRef)
    //     .then((url) => {
    //         console.log('Download URL:', url);
    //
    //         return fetch(url, {responseType: 'blob'});
    //     })
    //     .then(response => {
    //         const contentLength = response.headers.get('content-length');
    //         const totalSize = parseInt(contentLength);
    //         const totalGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
    //         console.log(`Total File Size: ${totalGB}GB`);
    //
    //         return response.blob()
    //     })
    //     .then(blob => {
    //         audioContext = new AudioContext();
    //         audioElement = new Audio();
    //
    //         const sourceNode = audioContext.createMediaElementSource(audioElement);
    //         gainNode = audioContext.createGain();
    //
    //         sourceNode.connect(gainNode);
    //         gainNode.connect(audioContext.destination);
    //
    //         audioElement.src = URL.createObjectURL(blob);
    //
    //         // Set initial volume to 0
    //         gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    //
    //         audioElement.addEventListener('loadedmetadata', () => {
    //             const duration = audioElement.duration;
    //
    //             // Set a random starting time
    //             const randomTime = Math.random() * duration;
    //             audioElement.currentTime = randomTime;
    //
    //             // Increase the volume to 0.1 over 5 seconds
    //             const targetVolume = 0.1;
    //             const fadeDuration = 10; // Duration in seconds
    //             targetTime = audioContext.currentTime + fadeDuration;
    //             gainNode.gain.linearRampToValueAtTime(targetVolume, targetTime);
    //             // Play the audio
    //             audioElement.play();
    //             document.addEventListener('visibilitychange', handleVisibilityChange);
    //
    //         });
    //
    //         return {audioElement, audioContext};
    //     })
    //     .catch((error) => {
    //         console.error('Error retrieving audio file:', error);
    //     });
}

const handleVisibilityChange = () => {
    // if (document.hidden) {
    //     // Pause the audio when the tab becomes hidden
    //     audioElement.pause();
    // } else {
    //     // Resume playing the audio when the tab becomes visible again
    //     audioElement.play();
    // }
};

export function changeAudio(speedArr) {
    // if (audioContext &&  audioContext.currentTime >= targetTime) {
    //     if (gainNode && audioChange) {
    //         clearTimeout(reduce)
    //         // gsap.killTweensOf(audio)
    //         if (arguments.length === 0) {
    //             reduceAudioMini();
    //             return;
    //         }
    //
    //         const speed = getAbsArray(speedArr);
    //         if ((speed[0] > 5 || speed[1] > 5) && gainNode.gain.value > 0.05) {
    //             reduceAudioMini();
    //         } else if ((speed[0] < 5 || speed[1] < 5) && gainNode.gain.value < 0.3) {
    //             gainNode.gain.setValueAtTime(gainNode.gain.value + .001, audioContext.currentTime);
    //
    //         }
    //     }
    //
    //     function reduceAudioMini() {
    //         const targetVolume = Math.max(gainNode.gain.value - 0.005, 0);
    //         gainNode.gain.setValueAtTime(targetVolume, audioContext.currentTime);
    //
    //         if (targetVolume <= 0.05) {
    //             audioChange = false;
    //             setTimeout(function () {
    //                 audioChange = true;
    //             }, 3000);
    //         }
    //     }
    // }
}

let reduce;

export function reduceAudio() {
    // if (audioElement && audioContext && audioContext.currentTime >= targetTime) {
    //     audioChange = false;
    //     reduce = setInterval(function () {
    //         if (gainNode.gain.value > 0.1) {
    //             gainNode.gain.setValueAtTime(gainNode.gain.value - .02, audioContext.currentTime);
    //         } else {
    //             clearInterval(reduce)
    //             audioChange = true;
    //             return
    //         }
    //     }, 200);
    // }
}

