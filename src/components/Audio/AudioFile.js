import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {UID} from "../Logging/Logging";
import {logIdString} from "../Logging/TimeLog";

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
export function getAudio() {
    const audioPath = 'audio/filename.mp3';
    const storageRef = ref(storage, audioPath);

    // Get the download URL for the audio file
    getDownloadURL(storageRef)
        .then((url) => {
            console.log('Download URL:', url);

            // Fetch the audio file as a Blob
            return fetch(url, { responseType: 'blob' });
        })
        .then(response => response.blob())
        .then(blob => {
            // Create a new AudioContext
            const audioContext = new (window.AudioContext );
            const audioElement = new Audio();  // Create an audio element
            // Create a MediaElementAudioSourceNode from the audio element
            const sourceNode = audioContext.createMediaElementSource(audioElement);

            // Create a GainNode for volume control
            const gainNode = audioContext.createGain();

            // Connect the nodes: source -> gain -> destination
            sourceNode.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Set up the MediaElementSourceNode with the audio blob
            // const audioElement = sourceNode.mediaElement;
            audioElement.src = URL.createObjectURL(blob);
            audioElement.src = URL.createObjectURL(blob);

            // Adjust the volume (0.0 to 1.0)
            const volume = .1; // Adjust the volume as needed
            gainNode.gain.value = volume;
            audioElement.play();

            return audioContext;
        })
        .then(audioContext => {
            // Audio streaming and playback is set up
            console.log('Audio streaming started.');
        })
        .catch((error) => {
            console.error('Error retrieving audio file:', error);
        });
}










