const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

let basket, letters, score, gameOver, animationId, spawnInterval;

// Word to collect
const targetWord = "SHREYA".split("");

function resetGame() {
  basket = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 60,
    width: 100,
    height: 20,
  };
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
  letters.forEach((letter) => {
    ctx.fillText(letter.char, letter.x, letter.y);
    letter.y += letter.speed;
  });
}

function checkCollision() {
  letters = letters.filter((letter) => {
    if (
      letter.y + 40 > basket.y &&
      letter.x > basket.x &&
      letter.x < basket.x + basket.width
    ) {
      score++;
      if (score >= targetWord.length) {
        endGame();
      }
      return false; // remove caught letter
    }
    return letter.y < canvas.height; // remove if off screen
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawLetters();
  checkCollision();

  // Score counter
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Caught: " + score + "/" + targetWord.length, 20, 40);

  if (!gameOver) animationId = requestAnimationFrame(gameLoop);
}

function spawnLetter() {
  const char = targetWord[Math.floor(Math.random() * targetWord.length)];
  const x = Math.random() * (canvas.width - 40);
  letters.push({ char, x, y: -40, speed: 2 + Math.random() * 2 });
}

function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationId);
  clearInterval(spawnInterval);
  endScreen.classList.remove("hidden");
}

startBtn.addEventListener("click", () => {
  console.log("Game Started");
  
  startScreen.classList.add("hidden");
  resetGame();
  gameLoop();
  spawnInterval = setInterval(spawnLetter, 1500);
});

restartBtn.addEventListener("click", () => {
  endScreen.classList.add("hidden");
  resetGame();
  gameLoop();
  spawnInterval = setInterval(spawnLetter, 1500);
});

// Basket controls: phone tilt
window.addEventListener("deviceorientation", (e) => {
  if (e.gamma) {
    basket.x += e.gamma;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width)
      basket.x = canvas.width - basket.width;
  }
});

// Basket controls: keyboard (for PC testing)
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") basket.x -= 20;
  if (e.key === "ArrowRight") basket.x += 20;
});
