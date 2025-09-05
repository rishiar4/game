const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const winScreen = document.getElementById("winScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const controls = document.getElementById("controls");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let basket = { x: canvas.width / 2 - 40, y: canvas.height - 40, width: 80, height: 20 };
let letters = [];
let caughtLetters = [];
let gameRunning = false;
let gameLoopId;
let letterInterval;

const word = "SHREYA".split("");

// 🎮 Start Game
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  winScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  canvas.style.display = "block";
  controls.style.display = "flex";
  resetGame();
  startGame();
});

// 🔁 Restart Game
restartBtn.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  winScreen.style.display = "none";
  canvas.style.display = "block";
  controls.style.display = "flex";
  resetGame();
  startGame();
});

function resetGame() {
  letters = [];
  caughtLetters = [];
  gameRunning = true;
  clearInterval(letterInterval);
  if (gameLoopId) cancelAnimationFrame(gameLoopId);
}

function startGame() {
  letterInterval = setInterval(spawnLetter, 1500);
  gameLoop();
}

function spawnLetter() {
  const size = 40;
  const x = Math.random() * (canvas.width - size);
  const letter = word[Math.floor(Math.random() * word.length)];
  letters.push({ x, y: -size, size, speed: 2 + Math.random() * 3, char: letter });
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Basket
  ctx.fillStyle = "blue";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

  // Letters
  drawLetters();

  // Score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Caught: " + caughtLetters.join(" "), 10, 30);

  // Win
  if (caughtLetters.length === word.length && caughtLetters.sort().join("") === word.sort().join("")) {
    endGame(true);
    return;
  }

  gameLoopId = requestAnimationFrame(gameLoop);
}

function drawLetters() {
  for (let i = 0; i < letters.length; i++) {
    const l = letters[i];
    l.y += l.speed;

    ctx.fillStyle = "red";
    ctx.font = `${l.size}px Arial`;
    ctx.fillText(l.char, l.x, l.y);

    // Collision
    if (
      l.y + l.size > basket.y &&
      l.x > basket.x &&
      l.x < basket.x + basket.width
    ) {
      if (!caughtLetters.includes(l.char)) {
        caughtLetters.push(l.char);
      }
      letters.splice(i, 1);
      i--;
    }

    // Missed
    if (l.y > canvas.height) {
      letters.splice(i, 1);
      i--;
    }
  }
}

function endGame(win) {
  gameRunning = false;
  clearInterval(letterInterval);
  cancelAnimationFrame(gameLoopId);

  canvas.style.display = "none";
  controls.style.display = "none";

  if (win) {
    winScreen.style.display = "flex";
    winScreen.innerHTML = "<h1>🎉 Happy Birthday Shreya! 🎉</h1>";
  } else {
    gameOverScreen.style.display = "flex";
  }
}

// Keyboard
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft" && basket.x > 0) basket.x -= 20;
  if (e.key === "ArrowRight" && basket.x + basket.width < canvas.width) basket.x += 20;
});

// On-screen buttons
leftBtn.addEventListener("click", () => {
  console.log("Left button pressed"); // debug
  if (basket.x > 0) basket.x -= 30;
});

rightBtn.addEventListener("click", () => {
  console.log("Right button pressed"); // debug
  if (basket.x + basket.width < canvas.width) basket.x += 30;
});
