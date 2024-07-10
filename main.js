const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

/* Variables del juego */
const longPixel = 38;
const numPixelsX = 9;
const numPixelsY = 16;
const pixelPadding = 4;
let gameSpeed = 2;
let rightPressed = false;
let leftPressed = false;
let rPressed = false;

/* Variables de las fichas */
const colors = ['red', 'green', 'blue', 'yellow', 'pink'];
let positionX = 0;
let positionY = 0;
let orientation = 0;
const shape = [
    'stick',
    'cane',
    'hat',
    'square',
    'snake'
    // , 'cruise'
];
let currentShape;
let currentColor;
let subMatrix = [];

/* Variables del canvas */
canvas.width = numPixelsX * (longPixel + pixelPadding);
canvas.height = numPixelsY * (longPixel + pixelPadding);

/* Matriz inicial */
let matrix = [];
for (let i = 0; i < numPixelsY; i++) {
    matrix[i] = [];
    for (let j = 0; j < numPixelsX; j++) {
            matrix[i][j] = 0;
    }      
}

/* Matriz de colores */
let colorMatrix = [];
for (let i = 0; i < numPixelsY; i++) {
    colorMatrix[i] = [];
    for (let j = 0; j < numPixelsX; j++) {

        if (
            j == 0 ||
            j == numPixelsX - 1 ||
            i == numPixelsY - 1 
        ) {
            colorMatrix[i][j] = 'gray';
        } else {
            colorMatrix[i][j] = 'black';
        }
    }      
}

/* Matriz de valores fijos */
let fixedMatrix = [];
for (let i = 0; i < numPixelsY; i++) {
    fixedMatrix[i] = [];
    for (let j = 0; j < numPixelsX; j++) {

        if (
            j == 0 ||
            j == numPixelsX - 1 ||
            i == numPixelsY - 1 
        ) {
            fixedMatrix[i][j] = true;
        } else {
            fixedMatrix[i][j] = false;
        }
    }      
}

// drawScreen();
chooseAShape();
drawPiece();

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawScreen() {
    for (let i = 0; i < numPixelsY; i++) {
        for (let j = 0; j < numPixelsX; j++) {

            ctx.fillStyle = colorMatrix[i][j];

            ctx.fillRect(
                j * (longPixel + pixelPadding),
                i * (longPixel + pixelPadding),
                longPixel,
                longPixel
            )

        }      
    }
}

function chooseAShape() {
    currentShape =  
    shape[Math.floor(Math.random() * shape.length)];

    currentColor =  
    colors[Math.floor(Math.random() * colors.length)];

    switch (currentShape) {
        case shape[0]:
            subMatrix =
            [
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1]
            ]
            break;
        case shape[1]:
            subMatrix =
            [
                [0, 0, 1],
                [0, 0, 1],
                [0, 1, 1],
            ]
            break;
        case shape[2]:
            subMatrix =
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 0, 1]
            ]
            break;
        case shape[3]:
        subMatrix =
            [
                [1, 1],
                [1, 1]
            ]
            break;
        case shape[4]:
            subMatrix =
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
            break;  
        // case shape[5]:
        //     subMatrix =
        //     [
        //         [0, 1, 0],
        //         [1, 1, 1],
        //         [0, 1, 0]
        //     ]
        //     break;  
    }

    positionX = Math.floor(Math.random() * (numPixelsX - 5)) + 1
}

function drawPiece() {
    for (let i = 0; i < subMatrix[0].length; i++) {
        for (let j = 0; j < subMatrix[0].length; j++) {

            if (subMatrix[i][j] == 1) {
                
                matrix[i + positionY][j + positionX] = 1;
                colorMatrix[i + positionY][j + positionX] = currentColor;

            }
        }      
    }
}

function rotatePiece() {

    clearPiece();

    if (rPressed) {
        let subMatrixRotated = [];
        let subMatrixSaved = [];
        for (let i = 0; i < subMatrix[0].length; i++) {
            subMatrixRotated[i] = []
            for (let j = 0; j < subMatrix[0].length; j++) {
                subMatrixRotated[i][subMatrix[0].length - 1 - j] = subMatrix[j][i]
            }      
        }
        
        subMatrixSaved = subMatrix
        subMatrix = subMatrixRotated;

        if (detectCollision()) {
            subMatrix = subMatrixSaved;
        }

        rPressed = false;
    }

    drawPiece();
    
}

function clearPiece() {
    for (let i = 0; i < numPixelsY; i++) {
        for (let j = 0; j < numPixelsX; j++) {

            matrix[i][j] = 0;

            if (!fixedMatrix[i][j]) {
                colorMatrix[i][j] = 'black';
            }

        }      
    }
}

function cleanLines() {
    let fullLines = []
    for (let i = 0; i < numPixelsY - 1; i++) {
        fullLines[i] = fixedMatrix[i][1];
    }

    for (let i = 0; i < numPixelsY - 1; i++) {
        for (let j = 2; j < numPixelsX - 1; j++) {
            if (fullLines[i])
            fullLines[i] = fixedMatrix[i][j]
        }      
    }

    for (let k = fullLines.length - 1; k >= 0; k--) {
        if (fullLines[k]) {
            for (let i = k; i > 0; i--) {
                for (let j = 1; j < numPixelsX - 1; j++) {
                    fixedMatrix[i][j] = fixedMatrix[i - 1][j];
                    colorMatrix[i][j] = colorMatrix[i - 1][j];
                }
                fullLines[i] = fullLines[i - 1];
            }
            for (let j = 1; j < numPixelsX - 1; j++) {
                fixedMatrix[0][j] = 0;
                colorMatrix[0][j] = 'black';
            }
            fullLines[0] = false
            k++
        }
    }
}

function pieceVerticalMovement() {
    clearPiece();
    positionY += 1;
    if (detectCollision()) {
        positionY -= 1
        drawPiece();
        for (let i = 0; i < subMatrix[0].length; i++) {
            for (let j = 0; j < subMatrix[0].length; j++) {

                if (subMatrix[i][j] == 1) {
                    fixedMatrix[i + positionY][j + positionX] = true;
                }
            }
        }
        cleanLines();
        positionY = 0;
        chooseAShape();
    } 
    drawPiece();
}

setInterval(pieceVerticalMovement, 1000 / gameSpeed);

function pieceHorizontalMovement() {
    clearPiece();
    let willBeCollision = false;

    if (rightPressed) {

        positionX += 1;
        if (detectCollision()) positionX -= 1
        rightPressed = false;
    } 

    else if (leftPressed) {

        positionX -= 1;
        if (detectCollision()) positionX += 1
        leftPressed = false
    } 
    
    drawPiece();
}

function detectCollision() {
    let willBeCollision = false;

    for (let i = 0; i < subMatrix[0].length; i++) {
        for (let j = 0; j < subMatrix[0].length; j++) {

            if (subMatrix[i][j] == 1) {
                matrix[i + positionY][j + positionX] = 1;
            }

        }      
    }

    for (let i = 0; i < numPixelsY; i++) {
        for (let j = 0; j < numPixelsX; j++) {

            if (
                matrix[i][j] == 1 &&
                fixedMatrix[i][j] == true
            ) {
                willBeCollision = true;
            }
        }
    }
    return willBeCollision;
}

function initEvents () {
    document.addEventListener('keyup', keyUpHandler);

    function keyUpHandler (event) {
        const { key } = event;
        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = true;
            pieceHorizontalMovement();
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = true;
            pieceHorizontalMovement();
        } else if (key === 'R' || key === 'r') {
            rPressed = true;
            rotatePiece();
        }
    }
}

function draw() {
    // limpiar pantalla
    clearCanvas();

    // dibujar pantalla
    drawScreen();

    // colisiones
    // collisionDetection();

    window.requestAnimationFrame(draw);

}

draw();
initEvents();

