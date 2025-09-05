const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const bgMusic = document.getElementById("bg-music");
const video = document.getElementById("birthdayVideo");

let basket, letters, score, gameOver, animationId, spawnInterval;

// Falling word "SHREYA"
const targetWord = "SHREYA".split("");

function resetGame() {
  basket = { x: canvas.width / 2 - 50, y: canvas.height - 60, width: 100, height: 20 };
  letters = [];
  score = 0;
  gameOver = false;
  if (spawnInterval) clearInterval(spawnInterval);
}

function drawBasket() {
  ctx.fillStyle = "blue";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawLetters() {
  ctx.fillStyle = "red";
  ctx.font = "40px Arial";
  letters.forEach(letter => {
    ctx.fillText(letter.char, letter.x, letter.y);
    letter.y += letter.speed;
  });
}

function checkCollision() {
  letters = letters.filter(letter => {
    if (
      letter.y + 40 > basket.y &&
      letter.x > basket.x &&
      letter.x < basket.x + basket.width
    ) {
      score++;
      if (score >= targetWord.length) {
        endGame();
      }
      return false; // caught
    }
    return letter.y < canvas.height;
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawLetters();
  checkCollision();

  // Draw Score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  if (!gameOver) animationId = requestAnimationFrame(gameLoop);
}

function spawnLetter() {
  const char = targetWord[letters.length % targetWord.length];
  const x = Math.random() * (canvas.width - 40);
  letters.push({ char, x, y: -40, speed: 2 + Math.random() * 2 });
}

function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationId);
  clearInterval(spawnInterval);
  endScreen.classList.remove("hidden");
  bgMusic.pause();
  video.play();
}

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  resetGame();
  bgMusic.play();
  gameLoop();
  spawnInterval = setInterval(spawnLetter, 1500);
});

restartBtn.addEventListener("click", () => {
  endScreen.classList.add("hidden");
  resetGame();
  bgMusic.play();
  gameLoop();
  spawnInterval = setInterval(spawnLetter, 1500);
});

// Basket control (tilt phone)
window.addEventListener("deviceorientation", (e) => {
  if (e.gamma) {
    basket.x += e.gamma;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
  }
});

// Basket control (keyboard for PC testing)
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") basket.x -= 20;
  if (e.key === "ArrowRight") basket.x += 20;
});
