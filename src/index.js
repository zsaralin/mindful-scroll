import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// disable right clicking
document.oncontextmenu = function () {
    return false;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
// Create a link element for the font
// const font = new FontFace('Montserrat', 'url(https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400&display=swap)');
//
// font.load().then(() => {
//     document.fonts.add(font);
// })
// Create a link element for the font
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400';
link.rel = 'preload';
link.as = 'style';

// Append the link element to the document's head
document.head.appendChild(link);

link.onload = () => {
    // Once the font is loaded, insert it as a stylesheet
    const style = document.createElement('link');
    style.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400';
    style.rel = 'stylesheet';
    document.head.appendChild(style);

    // Now render the app
    root.render(<App />);
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
