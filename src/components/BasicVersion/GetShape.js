export function getRandomShape(currYMax) {
    const c = document.getElementById('top-canvas').getContext('2d')
    c.fillStyle = "red"
    let path = new Path2D()
    let dimension = []
    let index =8// getRandomNum(0, 16)

    if (index === 0) {
        // circle
        const x = window.innerWidth / 2;
        const y = currYMax + window.innerHeight / 2;
        const r = window.innerWidth / 8 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 8 + 100
        path.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
        dimension = [x - r, x + r, y - r, y + r];

    } else if (index === 1) {
        // horizontal ellipse
        const x = window.innerWidth / 2;
        const y = currYMax + window.innerHeight / 2;
        const r = window.innerWidth / 8 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 8 + 100
        path.ellipse(x, y, r , r- 50, 0, 0, Math.PI * 2);
        dimension = [x - r, x + r, y - r + 50, y + r-50];
    } else if (index === 2) {
        // vertical ellipse
        const x = window.innerWidth / 2;
        const y = currYMax + window.innerHeight / 2;
        const r = window.innerWidth / 8 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 8 + 100
        path.ellipse(x, y, r-50 , r, 0, 0, Math.PI * 2);
        dimension = [x - (r-50), x + r-50, y - r, y + r];
    } else if (index === 3) {
        // square
        const width = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The width of the rectangle
        const height = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The height of the rectangle
        const x = window.innerWidth / 2 - width / 2;
        const y = currYMax + window.innerHeight / 2 - height / 2;

        path.moveTo(x, y);
        path.lineTo(x, y + height);
        path.lineTo(x + width, y + height);
        path.lineTo(x + width, y);
        path.lineTo(x, y);

        dimension = [x, x + width, y, y + height];
    } else if (index === 4) {
        // triangle
        const height = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The height of the rectangle
        const base = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The height of the rectangle
        const x = window.innerWidth / 2; // X-coordinate of the top vertex
        const y = currYMax + window.innerHeight / 2 - height / 2; // Y-coordinate of the top vertex

        path.moveTo(x, y);
        path.lineTo(x + base / 2, y + height);
        path.lineTo(x - base / 2, y + height);
        path.lineTo(x, y);

        dimension = [x - base / 2, x + base / 2, y, y + height];
    } else if (index === 5) {
        // up-side down triangle
        const height = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The height of the rectangle
        const base = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The height of the rectangle
        const x = window.innerWidth / 2; // X-coordinate of the bottom vertex
        const y = currYMax + window.innerHeight / 2 + height / 2; // Y-coordinate of the bottom vertex

        path.moveTo(x, y);
        path.lineTo(x + base / 2, y - height);
        path.lineTo(x - base / 2, y - height);
        path.lineTo(x, y);

        dimension = [x - base / 2, x + base / 2, y - height, y];
    } else if (index === 6) {
        // rhombus
        const baseSize = ((window.innerWidth / 2 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 2 + 100) * 1.2); // Adjust the base size scaling factor
        const width = baseSize; // Width of the rhombus
        const height = baseSize; // Height of the rhombus
        const x = window.innerWidth / 2; // X-coordinate of the center
        const y = currYMax + window.innerHeight / 2; // Y-coordinate of the center

        path.moveTo(x - width / 2, y);
        path.lineTo(x, y + height / 2);
        path.lineTo(x + width / 2, y);
        path.lineTo(x, y - height / 2);
        path.lineTo(x - width / 2, y);

        dimension = [x - width / 2, x + width / 2, y - height / 2, y + height / 2];
    }

    if (index === 7) {
        // parallelogram
        const width = Math.min(window.innerWidth / 4 + 100, window.innerWidth - 200); // The width of the parallelogram
        const height = Math.min(window.innerWidth / 4 + 100, window.innerHeight - 200); // The height of the parallelogram
        const x = window.innerWidth / 2 - width / 2 + height / 4;
        const y = currYMax + window.innerHeight / 2 - height / 2;

        path.moveTo(x, y);
        path.lineTo(x + width, y);
        path.lineTo(x + width - height / 2, y + height);
        path.lineTo(x - height / 2, y + height);
        path.lineTo(x, y);

        dimension = [x - height / 2, x + width, y, y + height];


    } else if (index === 8) {
        // parallelogram
        const width = Math.min(window.innerWidth / 4 + 100, window.innerWidth - 200); // The width of the parallelogram
        const height = Math.min(window.innerWidth / 4 + 100, window.innerHeight - 200); // The height of the parallelogram
        const x = window.innerWidth / 2 - (width + height / 2) / 2; // Adjusted x-coordinate for centering
        const y = currYMax + window.innerHeight / 2 - height / 2;

        path.moveTo(x, y);
        path.lineTo(x + width, y);
        path.lineTo(x + width + height / 2, y + height); // Changed x-coordinate here
        path.lineTo(x + height / 2, y + height); // Changed x-coordinate here
        path.lineTo(x, y);

        dimension = [x, x + width + height / 2, y, y + height]; // Adjusted the dimension accordingly
    } else if (index === 9) {
        // trapezoid
        const baseWidth = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The base width of the trapezoid
        const topWidth = baseWidth - 150 > 0 ? baseWidth - 150 : 0; // The top width of the trapezoid
        const height = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The height of the trapezoid

// Adjust x and y coordinates based on the trapezoid shape
        const x = window.innerWidth / 2 - baseWidth / 2;
        const y = currYMax + window.innerHeight / 2 + (height >= 0 ? height / 2 : 0);

        path.moveTo(x, y);
        path.lineTo(x + (baseWidth - topWidth) / 2, y - height);
        path.lineTo(x + (baseWidth + topWidth) / 2, y - height);
        path.lineTo(x + baseWidth, y);
        path.lineTo(x, y);

        dimension = [x, x + baseWidth, y - height, y];

    } else if (index === 10) {
        // up-side down trapezoid
        const baseWidth = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The base width of the trapezoid
        const topWidth = baseWidth - 150 > 0 ? baseWidth - 150 : 0; // The top width of the trapezoid
        const height = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The height of the trapezoid

// Adjust x and y coordinates based on the trapezoid shape
        const x = window.innerWidth / 2 - baseWidth / 2;
        const y = currYMax + window.innerHeight / 2 - (height >= 0 ? height / 2 : 0);

        path.moveTo(x, y);
        path.lineTo(x + (baseWidth - topWidth) / 2, y + height);
        path.lineTo(x + (baseWidth + topWidth) / 2, y + height);
        path.lineTo(x + baseWidth, y);
        path.lineTo(x, y);

        dimension = [x, x + baseWidth, y, y + height];
    } else if (index === 11) {
        // pentagon
        const sideLength = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The length of each side of the pentagon
        const radius = sideLength / (2 * Math.sin(Math.PI / 5)); // The radius of the circumcircle of the pentagon
        const angleOffset = -Math.PI / 2; // Offset angle to rotate the pentagon
        const xCenter = window.innerWidth / 2; // x-coordinate of the center of the pentagon
        const yCenter = currYMax + window.innerHeight / 2; // y-coordinate of the center of the pentagon

        path.moveTo(xCenter + radius * Math.cos(angleOffset), yCenter + radius * Math.sin(angleOffset));

        for (let i = 1; i <= 5; i++) {
            const angle = angleOffset + (2 * Math.PI * i) / 5;
            const x = xCenter + radius * Math.cos(angle);
            const y = yCenter + radius * Math.sin(angle);
            path.lineTo(x, y);
        }

        dimension = [xCenter - radius, xCenter + radius, yCenter - radius, yCenter + radius];


    } else if (index === 12) {
        // hexagon
        const sideLength = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The length of each side of the hexagon
        const radius = sideLength / Math.sqrt(3); // The radius of the circumcircle of the hexagon
        const angleOffset = -Math.PI / 2; // Offset angle to rotate the hexagon
        const xCenter = window.innerWidth / 2; // x-coordinate of the center of the hexagon
        const yCenter = currYMax + window.innerHeight / 2; // y-coordinate of the center of the hexagon

        path.moveTo(xCenter + radius * Math.cos(angleOffset), yCenter + radius * Math.sin(angleOffset));

        for (let i = 1; i <= 6; i++) {
            const angle = angleOffset + (2 * Math.PI * i) / 6;
            const x = xCenter + radius * Math.cos(angle);
            const y = yCenter + radius * Math.sin(angle);
            path.lineTo(x, y);
        }

        dimension = [xCenter - radius, xCenter + radius, yCenter - radius, yCenter + radius];

    } else if (index === 13) {
        // heptagon
        const sideLength = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The length of each side of the heptagon
        const radius = (sideLength / (2 * Math.sin(Math.PI / 7))) * Math.cos(Math.PI / 7)*.7; // The radius of the circumcircle of the heptagon
        const angleOffset = -Math.PI / 2; // Offset angle to rotate the heptagon
        const xCenter = window.innerWidth / 2; // x-coordinate of the center of the heptagon
        const yCenter = currYMax + window.innerHeight / 2; // y-coordinate of the center of the heptagon

        path.moveTo(xCenter + radius * Math.cos(angleOffset), yCenter + radius * Math.sin(angleOffset));

        for (let i = 1; i <= 7; i++) {
            const angle = angleOffset + (2 * Math.PI * i) / 7;
            const x = xCenter + radius * Math.cos(angle);
            const y = yCenter + radius * Math.sin(angle);
            path.lineTo(x, y);
        }

        dimension = [xCenter - radius, xCenter + radius, yCenter - radius, yCenter + radius];
    } else if (index === 14) {
        // horizontal rectangle
        const width = (window.innerWidth / 2 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 2 + 100) * 1.5; // The width of the rectangle (adjusted)
        const height = (window.innerWidth / 2 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 2 + 100) * 1; // The height of the rectangle (adjusted)
        const x = window.innerWidth / 2 - width / 2;
        const y = currYMax + window.innerHeight / 2 - height / 2;

        path.moveTo(x, y);
        path.lineTo(x, y + height);
        path.lineTo(x + width, y + height);
        path.lineTo(x + width, y);
        path.lineTo(x, y);

        dimension = [x, x + width, y, y + height];
    } else if(index === 15){
        // vertical rectangle
        const width = (window.innerWidth / 2 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 2 + 100) * 1; // The width of the rectangle (adjusted)
        const height = (window.innerWidth / 2 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 2 + 100) * 1.5; // The height of the rectangle (adjusted)
        const x = window.innerWidth / 2 - width / 2;
        const y = currYMax + window.innerHeight / 2 - height / 2;

        path.moveTo(x, y);
        path.lineTo(x, y + height);
        path.lineTo(x + width, y + height);
        path.lineTo(x + width, y);
        path.lineTo(x, y);

        dimension = [x, x + width, y, y + height];
    }
    // c.fillRect(dimension[0], dimension[2], dimension[1]-dimension[0], dimension[3]-dimension[2])

    return [path, dimension];
}

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}