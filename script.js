window.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const endScreen = document.getElementById("end-screen");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const catcher = document.getElementById("catcher");
  const collectedDiv = document.getElementById("collected");

  let catcherX = window.innerWidth / 2 - 60;
  let letters = [];
  let collected = [];
  let spawnInterval;
  const targetWord = "SHREYA".split("");

  // Reset game
  function resetGame() {
    letters.forEach(l => l.el.remove());
    letters = [];
    collected = [];
    catcherX = window.innerWidth / 2 - 60;
    catcher.style.left = catcherX + "px";
    updateCollectedDisplay();
  }

  // Update collected and remaining letters display
  function updateCollectedDisplay() {
    const remaining = targetWord.filter(l => !collected.includes(l));
    collectedDiv.textContent = "Collected: " + collected.join(" ") +
                               " | Remaining: " + remaining.join(" ");
  }

  // Spawn falling letter
  function spawnLetter() {
    const letter = targetWord[Math.floor(Math.random() * targetWord.length)];
    const el = document.createElement("div");
    el.classList.add("letter");
    el.textContent = letter;
    const x = Math.random() * (window.innerWidth - 30);
    el.style.left = x + "px";
    el.style.top = "0px";
    gameScreen.appendChild(el);

    letters.push({ el, x, y: 0, speed: 2 + Math.random() * 3, char: letter });
  }

  // Game loop
  function gameLoop() {
    letters.forEach((l, i) => {
      l.y += l.speed;
      l.el.style.top = l.y + "px";

      // Collision
      if (
        l.y + 30 >= window.innerHeight - 60 &&
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
      if (l.y > window.innerHeight) {
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
    endScreen.classList.remove("hidden");
  }

  // Desktop controls
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") catcherX -= 20;
    if (e.key === "ArrowRight") catcherX += 20;
    if (catcherX < 0) catcherX = 0;
    if (catcherX > window.innerWidth - 120) catcherX = window.innerWidth - 120;
    catcher.style.left = catcherX + "px";
  });

  // Mobile touch controls
  let touchStartX = null;
  window.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
  });
  window.addEventListener("touchmove", e => {
    if (touchStartX !== null) {
      let touchX = e.touches[0].clientX;
      let deltaX = touchX - touchStartX;
      catcherX += deltaX;
      if (catcherX < 0) catcherX = 0;
      if (catcherX > window.innerWidth - 120) catcherX = window.innerWidth - 120;
      catcher.style.left = catcherX + "px";
      touchStartX = touchX;
    }
  });
  window.addEventListener("touchend", () => {
    touchStartX = null;
  });

  // Start button
  startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    resetGame();
    spawnInterval = setInterval(spawnLetter, 1500);
    gameLoop();
  });

  // Restart button
  restartBtn.addEventListener("click", () => {
    endScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    resetGame();
    spawnInterval = setInterval(spawnLetter, 1500);
    gameLoop();
  });
});
