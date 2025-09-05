const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas to full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// UI elements
const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const bgMusic = document.getElementById("bg-music");
const video = document.getElementById("birthdayVideo");

let basket, balloons, score, gameOver, animationId, balloonInterval;

// Load images
const basketImg = new Image();
basketImg.src = "assets/cake.png";

const balloonImg = new Image();
balloonImg.src = "assets/balloons.jpg";

// Reset game state
function resetGame() {
  basket = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 100,
    width: 80,
    height: 80,
  };
  balloons = [];
  score = 0;
  gameOver = false;
  if (balloonInterval) clearInterval(balloonInterval);
}

// Draw basket
function drawBasket() {
  ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);
}

// Draw balloons
function drawBalloons() {
  balloons.forEach(balloon => {
    ctx.drawImage(balloonImg, balloon.x, balloon.y, balloon.size, balloon.size);
    balloon.y += balloon.speed;
  });
}

// Check collisions
function checkCollision() {
  balloons = balloons.filter(balloon => {
    if (
      balloon.y + balloon.size > basket.y &&
      balloon.x < basket.x + basket.width &&
      balloon.x + balloon.size > basket.x
    ) {
      score++;
      if (score >= 10) {
        endGame(); // 🎉 Only ends when 10 caught
      }
      return false; // Balloon caught
    }
    return balloon.y < canvas.height; // Remove if it falls past screen
  });
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawBalloons();
  checkCollision();

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  if (!gameOver) animationId = requestAnimationFrame(gameLoop);
}

// Spawn a balloon
function spawnBalloon() {
  const size = 50;
  const x = Math.random() * (canvas.width - size);
  balloons.push({ x, y: -size, size, speed: 3 + Math.random() * 2 });
}

// End game
function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationId);
  clearInterval(balloonInterval);
  bgMusic.pause();

  // Show end screen with score
  document.querySelector("#end-screen h1").innerText =
    `🎂 Happy Birthday [HER_NAME] 💕 🎂\nYou caught ${score}/10 🎈`;
  
  endScreen.classList.remove("hidden");
  video.play();
}

// Start button
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  resetGame();
  bgMusic.play();
  gameLoop();

  // Spawn balloon immediately
  spawnBalloon();

  // Then keep spawning
  balloonInterval = setInterval(spawnBalloon, 1500);
});

// Restart button
restartBtn.addEventListener("click", () => {
  endScreen.classList.add("hidden");
  resetGame();
  bgMusic.play();
  gameLoop();

  spawnBalloon();
  balloonInterval = setInterval(spawnBalloon, 1500);
});

// Move basket with device tilt
window.addEventListener("deviceorientation", (e) => {
  if (e.gamma) {
    basket.x += e.gamma;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width)
      basket.x = canvas.width - basket.width;
  }
});
