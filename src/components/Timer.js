import {UID} from "./Logging/Logging";
import {logTimer} from "./Logging/TimeLog";

// Timer configuration
const totalTime = 10//*60; // Total time in seconds
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
    const centerY = 33.5;
    const centerX = 33;
    const radius = 7;
    const percentage = calculatePercentage();
    let fillColor = 'rgba(128, 128, 128, 0.5)';
    if (isTimerDone) {
        fillColor = `rgba(0, 0, 0, .6)`;
    }
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width/3, 80);

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

function handleClick() {
    if (UID === '.1') {
        window.open(
            'https://docs.google.com/document/d/1-X1Jhy_nxj2bdS60b7_S5LFy1AycbTgOktIYdGqPi1c/edit?usp=sharing',
            '_blank'
        );
    } else if (UID === '.2') {
        window.open(
            'https://docs.google.com/document/d/1qvniuCkiFiIQq1N6vYYQXH14KS-kVT0pbAYnM_gJIAo/edit?usp=sharing',
            '_blank'
        );
    }
}

// Start the timer

