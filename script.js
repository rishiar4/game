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

let basket, letters, score, gameOver, animationId, letterInterval;

const basketImg = new Image();
basketImg.src = "assets/cake.png";

// Reset game state
function resetGame() {
  basket = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 100,
    width: 80,
    height: 80
  };
  letters = [];
  score = 0;
  gameOver = false;
}

// Draw basket
function drawBasket() {
  ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);
}

// Draw letters and move them
function drawLetters() {
  ctx.fillStyle = "blue";
  ctx.font = "40px Arial";
  letters.forEach(letter => {
    ctx.fillText("S", letter.x, letter.y);
    letter.y += letter.speed; // falling
  });
}

// Check collisions
function checkCollision() {
  letters = letters.filter(letter => {
    if (
      letter.y > basket.y &&
      letter.x < basket.x + basket.width &&
      letter.x + 20 > basket.x // approx width of "S"
    ) {
      score++;
      if (score >= 10) {
        endGame();
      }
      return false; // caught
    }
    return letter.y < canvas.height; // keep if still on screen
  });
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawLetters();
  checkCollision();

  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  if (!gameOver) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

// Spawn a new “S”
function spawnLetter() {
  const x = Math.random() * (canvas.width - 20);
  letters.push({ x, y: -20, speed: 2 + Math.random() * 3 });
}

// End game
function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationId);
  clearInterval(letterInterval);
  bgMusic.pause();

  canvas.style.display = "none";
  endScreen.classList.remove("hidden");

  document.querySelector("#end-screen h1").innerText =
    `🎂 Happy Birthday [HER_NAME] 💕 🎂\nYou caught ${score}/10 🎈`;

  video.play();
}

// Start button
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  canvas.style.display = "block";
  endScreen.classList.add("hidden");

  resetGame();
  bgMusic.play();
  gameLoop();

  spawnLetter();
  letterInterval = setInterval(spawnLetter, 1500);
});

// Restart button
restartBtn.addEventListener("click", () => {
  endScreen.classList.add("hidden");
  canvas.style.display = "block";
  startScreen.classList.add("hidden");

  resetGame();
  bgMusic.play();
  gameLoop();

  spawnLetter();
  letterInterval = setInterval(spawnLetter, 1500);
});

// Mobile tilt control
window.addEventListener("deviceorientation", (e) => {
  if (e.gamma) {
    basket.x += e.gamma;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
  }
});
