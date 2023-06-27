import React, {useEffect, useRef} from 'react';
import {UID} from "./Logging/Logging";
import {logTimer} from "./Logging/TimeLog";

export default function TimerClock() {
    // Timer configuration
    const totalTime = 10//*60; // Total time in seconds
    let elapsedTime = 0; // Elapsed time in seconds
    let isTimerDone = false;
    const canvasRef = useRef(null);
    useEffect(() => {
        // Canvas setup
        const canvas = canvasRef.current;
        // const canvas = document.getElementById('timer-canvas');
        const ctx = canvas.getContext('2d');

        // Calculate the percentage of time elapsed
        function calculatePercentage() {
            return (elapsedTime / totalTime) * 100;
        }

        // Draw the timer
        function drawTimer() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = (canvas.width /7 ); // Subtract 2 to account for border thickness
            const percentage = calculatePercentage();
            let fillColor = 'rgba(128, 128, 128, 0.5)';
            if (isTimerDone) {
                fillColor = `rgba(0, 0, 0,.6)`;
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
            ctx.fillStyle = `rgba(92, 92, 92,.5)`;
            ctx.fill();
        }}

        // Update the timer every second
        function updateTimer() {
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
            if(UID === '.1'){
                window.open(
                    'https://docs.google.com/document/d/1-X1Jhy_nxj2bdS60b7_S5LFy1AycbTgOktIYdGqPi1c/edit?usp=sharing',
                    '_blank'
                );
            }
            else if(UID === '.2'){
                window.open(
                    'https://docs.google.com/document/d/1qvniuCkiFiIQq1N6vYYQXH14KS-kVT0pbAYnM_gJIAo/edit?usp=sharing',
                    '_blank'
                );
            }
        }

        // Start the timer
        updateTimer();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: '20px',
                left: '12px',
                width: '50px',
                height: '25px',
                opacity: '0.5',
                zIndex: 3,
                // pointerEvents: isTimerDone ? 'auto' : 'none',
            }}
        ></canvas>
    );
}
