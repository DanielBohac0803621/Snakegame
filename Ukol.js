const canvas = document.getElementById("gameCanvas"), ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score"), gameOverText = document.getElementById("game-over-text");
const size = 20, count = canvas.width / size;

let snake = [], food = {}, dx = size, dy = 0, score = 0, loop, isOver = false;

reset();

function reset() {
    snake = [{x: size*5, y: size*10}, {x: size*4, y: size*10}, {x: size*3, y: size*10}];
    dx = size; dy = 0; score = 0;
    scoreElement.innerText = score;
    isOver = false;
    gameOverText.classList.add("hidden");
    spawnFood();
    clearInterval(loop);
    loop = setInterval(game, 100);
}

function spawnFood() {
    food = { x: Math.floor(Math.random() * count) * size, y: Math.floor(Math.random() * count) * size };
    if (snake.some(c => c.x === food.x && c.y === food.y)) spawnFood();
}

function game() {
    if (isOver) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Kontrola kolizí se zdí nebo sebou samým
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
        snake.some(c => c.x === head.x && c.y === head.y)) {
        isOver = true;
        clearInterval(loop);
        gameOverText.classList.remove("hidden");
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        spawnFood();
    } else {
        snake.pop();
    }

    // Vykreslení
    ctx.fillStyle = "#111"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff5722"; ctx.fillRect(food.x, food.y, size - 2, size - 2);
    snake.forEach((c, i) => {
        ctx.fillStyle = i === 0 ? "#4caf50" : "#81c784";
        ctx.fillRect(c.x, c.y, size - 2, size - 2);
    });
}

window.addEventListener("keydown", e => {
    if ((e.key === "ArrowUp" || e.key === "w") && dy === 0) { dx = 0; dy = -size; }
    if ((e.key === "ArrowDown" || e.key === "s") && dy === 0) { dx = 0; dy = size; }
    if ((e.key === "ArrowLeft" || e.key === "a") && dx === 0) { dx = -size; dy = 0; }
    if ((e.key === "ArrowRight" || e.key === "d") && dx === 0) { dx = size; dy = 0; }
    if (e.key === " " && isOver) reset();
});