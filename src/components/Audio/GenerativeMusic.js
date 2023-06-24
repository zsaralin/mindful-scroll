import * as Tone from 'tone';

export default class GenerativeMusic {
    constructor() {
        this.stringInstrument = new Tone.PluckSynth().toDestination();
        this.stringInstrument.release = 4;

        // const reverb = new Tone.Reverb({
        //     decay: 10,
        //     wet: 0.3,
        // }).toDestination();
        // this.stringInstrument.connect(reverb);

        // const delay = new Tone.FeedbackDelay({
        //     delayTime: "8n",
        //     feedback: 0.4,
        //     wet: 0.2,
        // }).toDestination();
        // reverb.connect(delay);

        const playRandomNote = () => {
            const note = Tone.Frequency(Math.random() * 600 + 200, "midi");
            this.stringInstrument.triggerAttackRelease(note, "8n");
        };

        this.playRandomNote = playRandomNote;
        // Set the initial volume (between 0 and 1)
        this.volume = 0.5;

        // Set the volume initially and whenever it changes

        // Bind the 'this' context for the handleUserAction method
        // Add an event listener to start the audio context upon a user gesture
    }

    handleUserAction() {
        // Remove the event listener to avoid multiple invocations

        // Start the audio context
        // Tone.start();

        // Schedule the random note to play in a loop
        Tone.Transport.scheduleRepeat(this.playRandomNote, "2n");

        // Start the transport
        Tone.Transport.start();
    }
}