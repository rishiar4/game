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

let basket, balloons, score, gameOver, animationId, balloonInterval;

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
    height: 80
  };
  balloons = [];
  score = 0;
  gameOver = false;
}

// Draw basket
function drawBasket() {
  ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);
}

// Draw balloons + move them
function drawBalloons() {
  balloons.forEach(balloon => {
    if (balloonImg.complete) {
      ctx.drawImage(balloonImg, balloon.x, balloon.y, balloon.size, balloon.size);
    } else {
      // fallback debug circle
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(balloon.x + balloon.size/2, balloon.y + balloon.size/2, balloon.size/2, 0, Math.PI * 2);
      ctx.fill();
    }
    balloon.y += balloon.speed;
  });
}

// Check collision with basket
function checkCollision() {
  balloons = balloons.filter(balloon => {
    if (
      balloon.y + balloon.size > basket.y &&
      balloon.x < basket.x + basket.width &&
      balloon.x + balloon.size > basket.x
    ) {
      score++;
      if (score >= 10) {
        endGame();
      }
      return false; // caught → remove
    }
    return balloon.y < canvas.height; // keep only if still on screen
  });
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawBalloons();
  checkCollision();

  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  if (!gameOver) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

// Spawn a balloon
function spawnBalloon() {
  const size = 50;
  const x = Math.random() * (canvas.width - size);
  balloons.push({ x, y: -size, size, speed: 2 + Math.random() * 3 });
}

// End the game
function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationId);
  clearInterval(balloonInterval);
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

  spawnBalloon(); // spawn first immediately
  balloonInterval = setInterval(spawnBalloon, 1500);
});

// Restart button
restartBtn.addEventListener("click", () => {
  endScreen.classList.add("hidden");
  canvas.style.display = "block";
  startScreen.classList.add("hidden");

  resetGame();
  bgMusic.play();
  gameLoop();

  spawnBalloon();
  balloonInterval = setInterval(spawnBalloon, 1500);
});

// Tilt control (mobile)
window.addEventListener("deviceorientation", (e) => {
  if (e.gamma) {
    basket.x += e.gamma;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
  }
});
