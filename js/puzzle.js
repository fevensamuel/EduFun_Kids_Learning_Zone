const fullImage = document.getElementById("full-image");
const puzzle = document.getElementById("puzzle");
const message = document.getElementById("message");
const title = document.getElementById("title");
const scoreEl = document.getElementById("score");
const muteBtn = document.getElementById("muteBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const correctSound = document.getElementById("correctSound");

let isMuted = false;
let score = 0;

const places = [
  { name: "Lalibela", img: "images/lalibla.jpg" },
  { name: "Traditional Food", img: "images/food.avif" },
  { name: "Ethiopian Flag", img: "images/flag.avif" },
  { name: "Axum", img: "images/axum.webp" }
];

let current = 0;
let dragged = null;
const gridSize = 2;

/* 🔇 MUTE / UNMUTE */
muteBtn.onclick = () => {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "🔇 Sound OFF" : "🔊 Sound ON";
};

function playSound() {
  if (!isMuted) {
    correctSound.currentTime = 0;
    correctSound.play();
  }
}

/* 🚀 START / RESET PUZZLE */
function startPuzzle() {
  dragged = null;
  puzzle.innerHTML = "";
  puzzle.classList.add("hidden");
  fullImage.style.display = "block";

  title.textContent = places[current].name;
  message.textContent = "👀 Look carefully!";

  fullImage.style.backgroundImage = `url(${places[current].img})`;
  fullImage.style.backgroundSize = "cover";

  setTimeout(() => {
    fullImage.style.display = "none";
    puzzle.classList.remove("hidden");
    createPieces();
    shufflePieces();
    message.textContent = "Slide the pieces to solve!";
  }, 3000);
}

/* 🧩 CREATE PUZZLE PIECES */
function createPieces() {
  for (let i = 0; i < 4; i++) {
    const piece = document.createElement("div");
    piece.className = "piece";

    piece.dataset.correct = i;
    piece.dataset.locked = "false";
    piece.style.order = i;

    const x = -(i % gridSize) * 100;
    const y = -Math.floor(i / gridSize) * 100;

    piece.style.backgroundImage = `url(${places[current].img})`;
    piece.style.backgroundSize = "200% 200%";
    piece.style.backgroundPosition = `${x}% ${y}%`;

    piece.addEventListener("pointerdown", () => {
      if (piece.dataset.locked === "true") return;
      dragged = piece;
    });

    piece.addEventListener("pointerup", () => {
      dragged = null;
    });

    piece.addEventListener("pointerenter", () => {
      if (!dragged || dragged === piece) return;
      if (piece.dataset.locked === "true") return;

      swapPieces(dragged, piece);
      checkCorrect();
    });

    puzzle.appendChild(piece);
  }
}

/* 🔀 SHUFFLE POSITIONS */
function shufflePieces() {
  const orders = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  [...puzzle.children].forEach((piece, i) => {
    piece.style.order = orders[i];
  });
}

/* 🔄 SWAP */
function swapPieces(a, b) {
  const temp = a.style.order;
  a.style.order = b.style.order;
  b.style.order = temp;
}

/* ✅ CHECK CORRECT POSITIONS */
function checkCorrect() {
  [...puzzle.children].forEach(piece => {
    if (
      piece.dataset.locked === "false" &&
      Number(piece.style.order) === Number(piece.dataset.correct)
    ) {
      piece.dataset.locked = "true";
      piece.classList.add("locked");

      score += 1;
      scoreEl.textContent = `⭐ Score: ${score}`;

      playSound();
    }
  });

  if ([...puzzle.children].every(p => p.dataset.locked === "true")) {
    message.textContent = "🎉 Congratulations! Puzzle Completed!";
  }
}

/* ▶ NEXT / PREVIOUS */
nextBtn.onclick = () => {
    if (current < places.length - 1) {
        current++;
        startPuzzle();
    } else {const finishSound = new Audio("sounds/finish.mp3");
    finishSound.play();
        // Hide everything except the congratulations card
        document.querySelector(".puzzle-card").style.display = "none";
        document.getElementById("score").style.display = "none";
        document.getElementById("muteBtn").style.display = "none";
        document.getElementById("message").style.display = "none";
        document.getElementById("title").style.display = "none";
        document.querySelector(".controls").style.display = "none";

        const container = document.querySelector(".container");
        const congrats = document.createElement("div");
        congrats.className = "congrats";
        congrats.innerHTML = `
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You completed all puzzles 👏</p>
            <p>Final Score: ⭐ ${score}</p>
            <button id="backBtn">Play Again</button>
        `;
        container.appendChild(congrats);

        document.getElementById("backBtn").onclick = () => {
            congrats.remove();

            document.querySelector(".puzzle-card").style.display = "block";
            document.getElementById("score").style.display = "inline-block";
            document.getElementById("muteBtn").style.display = "inline-block";
            document.getElementById("message").style.display = "block";
            document.getElementById("title").style.display = "block";
            document.querySelector(".controls").style.display = "block";

            current = 0;
            score = 0;
            scoreEl.textContent = `⭐ ${score}`;
            startPuzzle();
        };
    }
};

prevBtn.onclick = () => {
    if (current > 0) {
        current--;
        startPuzzle();
    }
};

window.onload = startPuzzle;
