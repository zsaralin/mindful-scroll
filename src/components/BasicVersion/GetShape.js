export let shapeType = 0;
const innerWidth = Math.min(500, window.innerWidth);
export function getRandomShape(currYMax) {
    const c = document.getElementById('top-canvas').getContext('2d')
    let path = new Path2D()
    let dimension = []
    shapeType = getRandomNum(0, 14)
    if (shapeType === 0) {
        // circle
        const x = window.innerWidth / 2;
        const r = innerWidth / 5 //+ 100 //> window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 11 + 100
        const y = currYMax  + window.innerHeight / 2;
        path.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
        dimension = [x - r, x + r, y-r, y+r];

    } else if (shapeType === 1) {
        // horizontal ellipse
        const x = window.innerWidth / 2;
        const y = currYMax + window.innerHeight / 2;
        const r = innerWidth / 3.7 ;
        path.ellipse(x, y, r, r - 50, 0, 0, Math.PI * 2);
        dimension = [x - r, x + r, y - r + 100, y + r - 50];
    } else if (shapeType === 2) {
        // vertical ellipse
        const x = window.innerWidth / 2;
        const y = currYMax + window.innerHeight / 2;
        const r =  innerWidth / 3.7 ;
        path.ellipse(x, y, r - 50, r, 0, 0, Math.PI * 2);
        dimension = [x - r + 100, x + r - 50, y - r, y + r];
    } else if (shapeType === 3) {
        // square
        const width = innerWidth / 3 ; // The width of the rectangle
        const height = innerWidth / 3 ; // The height of the rectangle
        const x = window.innerWidth / 2 - width / 2;
        const y = currYMax + window.innerHeight / 2 - height / 2;

        path.moveTo(x, y);
        path.lineTo(x, y + height);
        path.lineTo(x + width, y + height);
        path.lineTo(x + width, y);
        path.lineTo(x, y);

        dimension = [x, x + width, y, y + height];
    } else if (shapeType === 4) {
        // triangle
        const height = innerWidth / 2.5; // The height of the rectangle
        const base = innerWidth / 2.5; // The height of the rectangle
        const x = window.innerWidth / 2; // X-coordinate of the top vertex
        const y = currYMax + window.innerHeight / 2 - height / 2; // Y-coordinate of the top vertex

        path.moveTo(x, y);
        path.lineTo(x + base / 2, y + height);
        path.lineTo(x - base / 2, y + height);
        path.lineTo(x, y);

        dimension = [x - base / 2, x + base / 2, y, y + height];
    } else if (shapeType === 5) {
        // up-side down triangle
        const height = innerWidth / 2.5; // The height of the rectangle
        const base = innerWidth / 2.5; // The height of the rectangle
        const x = window.innerWidth / 2; // X-coordinate of the bottom vertex
        const y = currYMax + window.innerHeight / 2 + height / 2; // Y-coordinate of the bottom vertex

        path.moveTo(x, y);
        path.lineTo(x + base / 2, y - height);
        path.lineTo(x - base / 2, y - height);
        path.lineTo(x, y);

        dimension = [x - base / 2, x + base / 2, y - height, y];
    } else if (shapeType === 6) {
        // rhombus
        const baseSize = innerWidth/2; // Adjust the base size scaling factor
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

    if (shapeType === 7) {
        // parallelogram
        const width = innerWidth/3; // The width of the parallelogram
        const height =innerWidth/3; // The height of the parallelogram
        const x = window.innerWidth / 2 - width / 2 + height / 4;
        const y = currYMax + window.innerHeight / 2 - height / 2;

        path.moveTo(x, y);
        path.lineTo(x + width, y);
        path.lineTo(x + width - height / 2, y + height);
        path.lineTo(x - height / 2, y + height);
        path.lineTo(x, y);

        dimension = [x - height / 2, x + width, y, y + height];


    } else if (shapeType === 8) {
        // parallelogram
        const width = innerWidth/3; // The width of the parallelogram
        const height =innerWidth/3; // The height of the parallelogram
        const x = window.innerWidth / 2 - (width + height / 2) / 2; // Adjusted x-coordinate for centering
        const y = currYMax + window.innerHeight / 2 - height / 2;

        path.moveTo(x, y);
        path.lineTo(x + width, y);
        path.lineTo(x + width + height / 2, y + height); // Changed x-coordinate here
        path.lineTo(x + height / 2, y + height); // Changed x-coordinate here
        path.lineTo(x, y);

        dimension = [x, x + width + height / 2, y, y + height]; // Adjusted the dimension accordingly
    }
//     else if (index === 9) {
//         // trapezoid
//         const baseWidth = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The base width of the trapezoid
//         const topWidth = baseWidth - 150 > 0 ? baseWidth - 150 : 0; // The top width of the trapezoid
//         const height = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The height of the trapezoid
//
// // Adjust x and y coordinates based on the trapezoid shape
//         const x = window.innerWidth / 2 - baseWidth / 2;
//         const y = currYMax + window.innerHeight / 2 + (height >= 0 ? height / 2 : 0);
//
//         path.moveTo(x, y);
//         path.lineTo(x + (baseWidth - topWidth) / 2, y - height);
//         path.lineTo(x + (baseWidth + topWidth) / 2, y - height);
//         path.lineTo(x + baseWidth, y);
//         path.lineTo(x, y);
//
//         dimension = [x, x + baseWidth, y - height, y];
//
//     } else if (index === 10) {
//         // up-side down trapezoid
//         const baseWidth = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The base width of the trapezoid
//         const topWidth = baseWidth - 150 > 0 ? baseWidth - 150 : 0; // The top width of the trapezoid
//         const height = window.innerWidth / 4 + 100 > window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The height of the trapezoid
//
// // Adjust x and y coordinates based on the trapezoid shape
//         const x = window.innerWidth / 2 - baseWidth / 2;
//         const y = currYMax + window.innerHeight / 2 - (height >= 0 ? height / 2 : 0);
//
//         path.moveTo(x, y);
//         path.lineTo(x + (baseWidth - topWidth) / 2, y + height);
//         path.lineTo(x + (baseWidth + topWidth) / 2, y + height);
//         path.lineTo(x + baseWidth, y);
//         path.lineTo(x, y);
//
//         dimension = [x, x + baseWidth, y, y + height];
//     }
    else if (shapeType === 9) {
        // pentagon
        const sideLength = innerWidth/3.5; // The length of each side of the pentagon
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


    } else if (shapeType === 10) {
        // hexagon
        const sideLength = innerWidth / 2.2; // The length of each side of the hexagon
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

    } else if (shapeType === 11) {
        // heptagon
        const sideLength = innerWidth / 2.2; //> window.innerWidth - 200 ? window.innerWidth - 200 : window.innerWidth / 4 + 100; // The length of each side of the heptagon
        const radius = (sideLength / (2 * Math.sin(Math.PI / 7))) * Math.cos(Math.PI / 7) * .5; // The radius of the circumcircle of the heptagon
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
    } else if (shapeType === 12) {
        // horizontal rectangle
        const width = innerWidth /2.7 - 50; // The height of the rectangle
        const height = innerWidth /2.7 + 50; // The height of the rectangle
        const x = window.innerWidth / 2 - width / 2;
        const y = currYMax + window.innerHeight / 2 - height / 2;

        path.moveTo(x, y);
        path.lineTo(x, y + height);
        path.lineTo(x + width, y + height);
        path.lineTo(x + width, y);
        path.lineTo(x, y);

        dimension = [x, x + width, y, y + height];
    } else if (shapeType === 13) {
        // vertical rectangle
        const width = innerWidth /2.7 + 50; // The height of the rectangle
        const height = innerWidth /2.7 - 50; // The height of the rectangle
        const x = window.innerWidth / 2 - width / 2;
        const y = currYMax + window.innerHeight / 2 - height / 2;

        path.moveTo(x, y);
        path.lineTo(x, y + height);
        path.lineTo(x + width, y + height);
        path.lineTo(x + width, y);
        path.lineTo(x, y);

        dimension = [x, x + width, y, y + height];
    }
    // c.fillRect(dimension[0], dimension[2], dimension[1] - dimension[0], dimension[3] - dimension[2])

    return [path, dimension];
}

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}