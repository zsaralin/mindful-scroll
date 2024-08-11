import { useState } from "react";
import { getAudio } from './AudioFile';

export function getAbsArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.abs(arr[i])
    }
    return arr
}

let audioChange = true;

export default function Music() {
    const [message, setMessage] = useState("click anywhere to start"); // State for the displayed message
    const [fade, setFade] = useState(true); // State to control fading in and out
    const [clickable, setClickable] = useState(true); // State to control whether the click listener is active
    const [visible, setVisible] = useState(true); // State to control the visibility of the entire page

    function playMusic(event) {
        if (event.pointerType === "mouse" && clickable) {
            // Start fading out the initial message
            setFade(false);

            setTimeout(() => {
                // Change the message after fading out
                setMessage("this app is made for mobile devices. please try again on a mobile device.");

                // Fade the new message back in
                setFade(true);

                // Disable the click listener after the fade-in completes
                setClickable(false);
            }, 1000); // Timing to match the fade-out duration
        } else if (clickable) {
            getAudio();
            setVisible(false); // Hide the message and the white page if accessed via touch or pen
        }
    }

    return (
        visible && (
            <div className="introPage" style={{ visibility: 'visible' }}>
                <div id='introPage' className="introPage"
                     onPointerDown={clickable ? playMusic : null} // Remove click listener after transition
                     style={{
                         transition: 'opacity 1s', // Smooth transition for fading
                         opacity: fade ? 1 : 0, // Control fading in and out based on the fade state
                     }}
                >
                    {message}
                </div>
            </div>
        )
    );
};
