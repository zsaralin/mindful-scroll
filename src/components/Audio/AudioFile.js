import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {UID} from "../Logging/Logging";
import {logIdString} from "../Logging/TimeLog";
import {getAbsArray} from "./Audio";

const musicOn = true;
const storage = getStorage()

export function addAudio() {
    const audioUrl = 'https://audio.jukehost.co.uk/d9hqiGrxHZ0FqSEWDeE0acE8Es3lddtt';
    const storage = getStorage();
    const storageRef = ref(storage, 'audio/waves.mp3');

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


const targetVolume = 0.4;
const fadeDuration = 5; // Duration in seconds

export function getAudio() {
    if (musicOn) {
        const audioPath = 'audio/waves.mp3';
        const storageRef = ref(storage, audioPath);

        return new Promise((resolve, reject) => {
            getDownloadURL(storageRef)
                .then((url) => {
                    console.log('Download URL:', url);

                    return fetch(url, {responseType: 'blob'});
                })
                .then(response => response.blob())
                .then(blob => {
                    audioContext = new (AudioContext || window.webkitAudioContext)();
                    audioElement = new Audio(URL.createObjectURL(blob));

                    audioElement.addEventListener('loadedmetadata', () => {
                        // Set a random starting time
                        // const randomTime = Math.floor(Math.random() * audioElement.duration);
                        // audioElement.currentTime = randomTime;
                        audioElement.currentTime = 0;

                        const sourceNode = audioContext.createMediaElementSource(audioElement);
                        gainNode = audioContext.createGain();

                        sourceNode.connect(gainNode);
                        gainNode.connect(audioContext.destination);
                    })

                    audioElement.addEventListener('canplaythrough', () => {
                        // Increase the volume to 0.1 over 5 seconds

                        targetTime = audioContext.currentTime + fadeDuration;

                        gainNode.gain.value = 0;
                        gainNode.gain.linearRampToValueAtTime(targetVolume, targetTime);


                        try {
                            audioElement.play();
                        } catch (error) {
                            console.error('An error occurred while playing the audio:', error);
                        }
                        document.addEventListener('visibilitychange', handleVisibilityChange);

                        resolve({audioElement});
                    });

                    audioElement.addEventListener('ended', function () {
                        gainNode.gain.value = 0;
                        audioElement.currentTime = 0;
                        gainNode.gain.linearRampToValueAtTime(targetVolume, targetTime);

                    });

                    audioElement.addEventListener('error', (error) => {
                        reject(error);
                    });

                    audioElement.load();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

let playOnce = true;
const handleVisibilityChange = () => {
    if (musicOn) {
        if (document.hidden) {
            // Pause the audio when the tab becomes hidden
            audioElement.pause();
        } else {
            // Resume playing the audio when the tab becomes visible again
            audioElement.play();
        }
    }
    ;
}
let volIncrease = false;
let volDecrease = false;

export function changeAudio(speedArr) {
    if (musicOn) {
        if (audioElement && audioContext && audioContext.currentTime >= targetTime) {
            // console.log(gainNode.gain.value)
            clearInterval(reduce)

            if (audioContext && audioContext.currentTime >= targetTime) {
                if (gainNode && audioChange) {
                    clearTimeout(reduce)
                    // gsap.killTweensOf(audio)
                    if (arguments.length === 0) {
                        reduceAudioMini();
                        return;
                    }

                    const speed = getAbsArray(speedArr);
                    if (!volDecrease && (speed[0] > 5 || speed[1] > 5) && gainNode.gain.value > 0.05) {
                        volDecrease = true;
                        reduceAudioMini();
                    } else if (!volIncrease && (speed[0] < 5 || speed[1] < 5) && gainNode.gain.value < 0.4) {
                        volIncrease = true;
                        gainNode.gain.setValueAtTime(gainNode.gain.value + 0.005, audioContext.currentTime);
                        setTimeout(() => {
                            volIncrease = false;
                        }, 500);
                    }
                }

                function reduceAudioMini() {
                    const targetVolume = Math.max(gainNode.gain.value - 0.01, 0);
                    gainNode.gain.setValueAtTime(targetVolume, audioContext.currentTime);
                    setTimeout(() => {
                        volDecrease = false;
                    }, 500);
                    // console.log(gainNode.gain.value)
                    if (targetVolume <= 0.03) {
                        audioChange = false;
                        setTimeout(function () {
                            audioChange = true;
                        }, 3000);
                    }
                }
            }
        }
    }
}

let reduce;

export function reduceAudio() {
    if (musicOn) {
        if (audioElement && audioContext && audioContext.currentTime >= targetTime) {
            audioChange = false;
            reduce = setInterval(function () {
                if (gainNode.gain.value > 0.1) {
                    gainNode.gain.setValueAtTime(gainNode.gain.value - .005, audioContext.currentTime);
                } else {
                    clearInterval(reduce)
                    audioChange = true;
                    return
                }
            }, 500);
        }
    }
}

export function playAudio() {
    if (audioElement && !audioElement.paused) {
        console.log('Audio is already playing');
    } else {
        try {
            getAudio()
        } catch (error) {
            console.error('An error occurred while playing the audio AGAIN:', error);
        }
    }
}