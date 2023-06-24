import * as Tone from 'tone';

export default class GenerativeMusic {
    constructor() {
        // Initialize Tone.js
        Tone.start();

        // Create binaural beat oscillators
        this.leftOscillator = new Tone.Oscillator();
        this.rightOscillator = new Tone.Oscillator();

        // Set the frequencies for the binaural beats
        const baseFrequency = 174.6; // Adjust the base frequency of the binaural beats
        const beatFrequency = 6; // Adjust the beat frequency (the difference between the left and right oscillators)
        this.leftOscillator.frequency.value = baseFrequency - beatFrequency / 2;
        this.rightOscillator.frequency.value = baseFrequency + beatFrequency / 2;

        // Pan the oscillators to left and right channels
        this.leftPanner = new Tone.Panner(-1).toDestination();
        this.rightPanner = new Tone.Panner(1).toDestination();
        this.leftOscillator.connect(this.leftPanner);
        this.rightOscillator.connect(this.rightPanner);

        // Set the initial volume
        this.volume = 0.5; // Adjust the volume level (0 to 1)
        this.setVolume(this.volume);

        this.handleUserAction = this.handleUserAction.bind(this);
    }

    setVolume(volume) {
        // Set the volume level (0 to 1)
        this.volume = volume;
        // this.leftPanner.volume.value = Tone.gainToDb(volume);
        // this.rightPanner.volume.value = Tone.gainToDb(volume);
    }

    handleUserAction() {
        // Start the audio upon user action
        Tone.start();

        // Schedule the binaural beats to play for a musical duration
        const duration = Tone.Time('4m'); // Adjust the duration (e.g., 4m for 4 minutes)
        this.leftOscillator.start();
        this.rightOscillator.start();
        this.leftOscillator.stop(`+${duration}`);
        this.rightOscillator.stop(`+${duration}`);

        // Start the transport
        Tone.Transport.start();
        Tone.Transport.stop(`+${duration}`);
    }
}
