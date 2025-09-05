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

let basket, balloons, score, gameOver, animationId;

const basketImg = new Image();
basketImg.src = "assets/cake.png";

const balloonImg = new Image();
balloonImg.src = "assets/balloons.jpg";

function resetGame() {
  basket = { x: canvas.width / 2 - 40, y: canvas.height - 100, width: 80, height: 80 };
  balloons = [];
  score = 0;
  gameOver = false;
}

function drawBasket() {
  ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);
}

function drawBalloons() {
  balloons.forEach(balloon => {
    ctx.drawImage(balloonImg, balloon.x, balloon.y, balloon.size, balloon.size);
    balloon.y += balloon.speed;
  });
}

function checkCollision() {
  balloons = balloons.filter(balloon => {
    if (balloon.y + balloon.size > basket.y &&
        balloon.x < basket.x + basket.width &&
        balloon.x + balloon.size > basket.x) {
      score++;
      if (score >= 10) {
        endGame();
      }
      return false; // caught
    }
    return balloon.y < canvas.height;
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawBalloons();
  checkCollision();
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  if (!gameOver) animationId = requestAnimationFrame(gameLoop);
}

function spawnBalloon() {
  const size = 50;
  const x = Math.random() * (canvas.width - size);
  balloons.push({ x, y: -size, size, speed: 3 + Math.random() * 2 });
}

function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationId);
  endScreen.classList.remove("hidden");
  bgMusic.pause();
  video.play();
}

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  resetGame();
  bgMusic.play();
  gameLoop();
  setInterval(spawnBalloon, 1500);
});

restartBtn.addEventListener("click", () => {
  endScreen.classList.add("hidden");
  resetGame();
  bgMusic.play();
  gameLoop();
});

window.addEventListener("deviceorientation", (e) => {
  if (e.gamma) {
    basket.x += e.gamma;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
  }
});
