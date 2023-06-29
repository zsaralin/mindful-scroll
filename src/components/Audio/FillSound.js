import successBellSound from './success_bell.mp3';
import * as Tone from 'tone';

export function playFillSound() {
    var audio = new Audio(successBellSound);
// Create an AudioContext
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create a MediaElementAudioSourceNode from the audio element
    var source = audioContext.createMediaElementSource(audio);

    // Create a GainNode for controlling the volume
    var gainNode = audioContext.createGain();
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Set initial gain value to 0
    gainNode.gain.value = 0;

    // Event listener for when metadata is loaded
    audio.addEventListener('loadedmetadata', function() {
        // Generate a random start time within the valid range
        var randomStartTime = Math.random() * (audio.duration - 5);

        // Start playing the audio file
        audio.currentTime = randomStartTime;
        // audio.volume = .3;
        audio.play();

        // Fade-in effect
        var fadeInDuration = 1; // Fade-in duration in seconds
        var fadeInStartTime = audioContext.currentTime;
        gainNode.gain.exponentialRampToValueAtTime(1, fadeInStartTime + fadeInDuration);

        // Schedule the fade-out effect
        var fadeOutDuration = 1; // Fade-out duration in seconds
        var fadeOutStartTime = audioContext.currentTime + 4 - fadeOutDuration;
        gainNode.gain.exponentialRampToValueAtTime(0.01, fadeOutStartTime);

        // Stop the audio playback after the fade-out duration
        audio.addEventListener('ended', function() {
            audio.pause();
        }, { once: true });
    });

    // Load the audio metadata
    audio.load();
}
