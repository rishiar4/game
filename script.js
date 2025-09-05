window.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const endScreen = document.getElementById("end-screen");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const catcher = document.getElementById("catcher");
  const collectedDiv = document.getElementById("collected");
  const gameBox = document.getElementById("game-box");
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");

  const boxWidth = 400;
  const boxHeight = 600;
  let catcherX = boxWidth / 2 - 60;
  let letters = [];
  let collected = [];
  let spawnInterval;
  const targetWord = "SHREYA".split("");

  function resetGame() {
    letters.forEach(l => l.el.remove());
    letters = [];
    collected = [];
    catcherX = boxWidth / 2 - 60;
    catcher.style.left = catcherX + "px";
    updateCollectedDisplay();
  }

  function updateCollectedDisplay() {
    const remaining = targetWord.filter(l => !collected.includes(l));
    collectedDiv.textContent = "Collected: " + collected.join(" ") +
                               " | Remaining: " + remaining.join(" ");
  }

  function spawnLetter() {
    const letter = targetWord[Math.floor(Math.random() * targetWord.length)];
    const el = document.createElement("div");
    el.classList.add("letter");
    el.textContent = letter;
    const x = Math.random() * (boxWidth - 30);
    el.style.left = x + "px";
    el.style.top = "0px";
    gameBox.appendChild(el);
    letters.push({ el, x, y: 0, speed: 2 + Math.random() * 2, char: letter });
  }

  function gameLoop() {
    letters.forEach((l, i) => {
      l.y += l.speed;
      l.el.style.top = l.y + "px";

      // Collision
      if (
        l.y + 30 >= boxHeight - 60 &&
        l.x + 20 > catcherX &&
        l.x < catcherX + 120
      ) {
        l.el.remove();
        letters.splice(i, 1);
        collected.push(l.char);
        updateCollectedDisplay();
        if (collected.length >= targetWord.length) {
          endGame();
        }
      }

      // Remove if falls below screen
      if (l.y > boxHeight) {
        l.el.remove();
        letters.splice(i, 1);
      }
    });

    if (collected.length < targetWord.length) {
      requestAnimationFrame(gameLoop);
    }
  }

  function endGame() {
    clearInterval(spawnInterval);
    gameScreen.classList.add("hidden");
    gameBox.classList.add("hidden");
    endScreen.classList.remove("hidden");
  }

  function moveCatcher(delta) {
    catcherX += delta;
    if (catcherX < 0) catcherX = 0;
    if (catcherX > boxWidth - 120) catcherX = boxWidth - 120;
    catcher.style.left = catcherX + "px";
  }

  // Desktop arrow keys
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") moveCatcher(-20);
    if (e.key === "ArrowRight") moveCatcher(20);
  });

  // Mobile touch drag
  let touchStartX = null;
  gameBox.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
  });
  gameBox.addEventListener("touchmove", e => {
    if (touchStartX !== null) {
      const touchX = e.touches[0].clientX;
      moveCatcher(touchX - touchStartX);
      touchStartX = touchX;
    }
  });
  gameBox.addEventListener("touchend", () => {
    touchStartX = null;
  });

  // On-screen buttons hold
  let leftInterval, rightInterval;
  leftBtn.addEventListener("touchstart", () => { leftInterval = setInterval(() => moveCatcher(-5), 50); });
  leftBtn.addEventListener("touchend", () => clearInterval(leftInterval));
  rightBtn.addEventListener("touchstart", () => { rightInterval = setInterval(() => moveCatcher(5), 50); });
  rightBtn.addEventListener("touchend", () => clearInterval(rightInterval));

  // Start button
  startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameBox.classList.remove("hidden");
    resetGame();
    spawnInterval = setInterval(spawnLetter, 1500);
    gameLoop();
  });

  // Restart button
  restartBtn.addEventListener("click", () => {
    endScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    gameBox.classList.remove("hidden");
    resetGame();
    spawnInterval = setInterval(spawnLetter, 1500);
    gameLoop();
  });
});
