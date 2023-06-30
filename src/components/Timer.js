import {UID} from "./Logging/Logging";
import {logTimer} from "./Logging/TimeLog";

// Timer configuration
const totalTime = 10*60; // Total time in seconds
let elapsedTime = 0; // Elapsed time in seconds
let isTimerDone = false;
let canvas;
// Canvas setup


function calculatePercentage() {
    return (elapsedTime / totalTime) * 100;
}

let drawn = true;
// Draw the timer
export function drawTimer() {
    canvas = document.getElementById('bub-canv')
    const ctx = canvas.getContext('2d');
    // const centerY = 33.5;
    // const centerX = 33;
    // const radius = 7;
    const centerY = canvas.height - 10;
    const centerX = canvas.width - 10;
    const radius = 7;
    const percentage = calculatePercentage();
    let fillColor = 'rgba(128, 128, 128, 0.5)';
    if (isTimerDone) {
        fillColor = `rgba(0, 0, 0, .6)`;
    }
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Draw the progress arc
    if (!isTimerDone) {
        ctx.beginPath();
        ctx.arc(
            centerX,
            centerY,
            radius,
            -0.5 * Math.PI,
            ((percentage / 100) * 2 * Math.PI) - 0.5 * Math.PI
        );
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = `rgba(92, 92, 92, .5)`;
        ctx.fill();
    }
}

// Update the timer every second
export function updateTimer() {
    if(!drawn){
        drawn = true;
    }
    if (elapsedTime <= totalTime) {
        drawTimer();
        elapsedTime++;
        setTimeout(updateTimer, 1000);
    } else {
        logTimer()
        isTimerDone = true;
        drawTimer();
        canvas.addEventListener('click', handleClick);
    }
}

const baseURL = 'https://uwaterloo.ca1.qualtrics.com/jfe/form/SV_cO2e5G9SORaIC2i?'
function handleClick() {
    if(UID) {
        window.open(
            baseURL + `uid=${UID}`
        );
    }
}

// Start the timer

