

// aqui recogemos los datos de nuestros index
let dom_score = document.querySelector("#score");
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext('2d');

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// velocidad de la culebrita
let speed = 7;

// variables para construir nuestra culebrilla
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

// posicion inicial de la manzanita
let appleX = 5;
let appleY = 5;

// posicion inicial de la culebrilla
let xVelocity = 0;
let yVelocity = 0;

// variable para el puntuaje
let score = 00;
let maxScore = window.localStorage.getItem("maxScore") || undefined; // de mientras

// loop
function drawGame() {
    changeSnakePosition();
    let result = isGameOver();
    if(result) {
        return;
    }

    clearScreen();

    checkAppleCollision();
    drawApple();
    drawSnake();

    drawGrid();
    drawScore();

    if(score > 5) {
        speed = 11;
    }
    if(score > 10) {
        speed = 15;
    }
    if(score > 20) {
        speed = 20;
    }

    setTimeout(drawGame, 1000 / speed);
}

// funcion para dibujar nuestro grid
function drawGrid() {
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = "#232332";
    ctx.shadowBlur = 0;
    for (let i = 1; i < tileCount; i++) {
        let f = (canvas.width / tileCount) * i;
        ctx.beginPath();
        ctx.moveTo(f, 0);
        ctx.lineTo(f, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, f);
        ctx.lineTo(canvas.width, f);
        ctx.stroke();
        ctx.closePath();
    }
}

// funcion para game over
function isGameOver() {
    let gameOver = false;

    if(yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // paredes
    if(headX < 0) {
        gameOver = true;
    }
    else if(headX === tileCount) {
        gameOver = true;
    }
    else if(headY < 0) {
        gameOver = true;
    }
    else if(headY === tileCount) {
        gameOver = true;
    }

    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    // muestra en pantlla nuestro puntuaje logrado y el max score
    if(gameOver) {
        maxScore ? null : (maxScore = score);
        score > maxScore ? (maxScore = score) : null;
        window.localStorage.setItem("maxScore", maxScore);
        ctx.fillStyle = "#4cffd7";
        ctx.textAlign = "center";
        ctx.font = "bold 30px Poppins, sans-serif";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.font = "15px Poppins, sans-serif";
        ctx.fillText(`SCORE ${score}`, canvas.width / 2, canvas.height / 2 + 60);
        ctx.fillText(`MAX SCORE ${maxScore}`, canvas.width / 2, canvas.height / 2 + 80);
    }

    return gameOver;
}

// aqui recogemos nuestro puntuaje del juego
function drawScore() {
    dom_score.innerText = score.toString().padStart(2, "0");
}

// funcion para limpiar la pantalla
function clearScreen() {
    ctx.fillStyle = '#181825';
    ctx.fillRect(0, 0, canvas.width,canvas.height);
}

// funcion para dibujar la culebrilla
function drawSnake() {
    
    ctx.fillStyle = 'white';
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255, 255, 255, .4)"
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }
    
    snakeParts.push(new SnakePart(headX, headY));
    while(snakeParts.length > tailLength) {
        snakeParts.shift();
    }

    ctx.fillStyle = "white";
    ctx.fillRect(headX * tileCount, headY  * tileCount, tileSize, tileSize);

}

// funcion para poder cambiar la posicion de la culebrilla
function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

// funcion para dibujar nuestra manzana
function drawApple() {
    ctx.fillStyle = "red";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255, 255, 255, .4)"
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

// funcion para ver si la culebrilla choca con la manzana
function checkAppleCollision() {
    if(appleX == headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
    }
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    // arriba
    if (event.keyCode == 38) {
        if(yVelocity == 1)
            return;
        yVelocity = -1;
        xVelocity = 0;
    }

    //abajo
    if (event.keyCode == 40) {
        if(yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }

    //izquierda
    if (event.keyCode == 37) {
        if(xVelocity == 1)
            return;
        yVelocity = 0;
        xVelocity = -1;
    }

    //derecha
    if (event.keyCode == 39) {
        if(xVelocity == -1)
            return;
        yVelocity = 0;
        xVelocity = 1;
    }
}

drawGame();