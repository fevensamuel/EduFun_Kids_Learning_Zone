let score = 0;
let isMuted = false;

const scoreEl = document.getElementById("score");
const draggableCol = document.getElementById("draggable-column");
const dropCol = document.getElementById("drop-column");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

/* =========================
   🔊 SOUNDS
========================= */
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");
const finishSound = new Audio("sounds/finish.mp3");
const clapSound = new Audio("sounds/clap.mp3");

muteBtn.onclick = () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? "🔇 Sound OFF" : "🔊 Sound ON";
};

// Safe sound play
function playSound(sound) {
    if (!isMuted) {
        sound.currentTime = 0;
        sound.play();
    }
}

/* =========================
   🎯 GAME DATA
========================= */
const sets = [
    {
        items: [
            { emoji: "🍎", name: "Apple" },
            { emoji: "🍌", name: "Banana" },
            { emoji: "🍇", name: "Grapes" },
            { emoji: "🍓", name: "Strawberry" }
        ]
    },
    {
        items: [
            { emoji: "🍒", name: "Cherry" },
            { emoji: "🥝", name: "Kiwi" },
            { emoji: "🍍", name: "Pineapple" },
            { emoji: "🍑", name: "Peach" }
        ]
    },
    {
        items: [
            { emoji: "🍉", name: "Watermelon" },
            { emoji: "🥭", name: "Mango" },
            { emoji: "🍐", name: "Pear" },
            { emoji: "🍋", name: "Lemon" }
        ]
    }
];

let currentSet = 0;

// Shuffle helper
function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

/* =========================
   🔄 LOAD SET
========================= */
function loadSet() {
    draggableCol.innerHTML = "";
    dropCol.innerHTML = "";

    prevBtn.style.display = currentSet === 0 ? "none" : "inline-block";
    nextBtn.style.display = "inline-block";

    const items = sets[currentSet].items;
    const shuffledDrags = shuffle(items);
    const shuffledDrops = shuffle(items);

    // Draggable emojis
    shuffledDrags.forEach((item, i) => {
        const drag = document.createElement("div");
        drag.className = "draggable";
        drag.textContent = item.emoji;
        drag.id = `drag-${currentSet}-${i}`;
        drag.setAttribute("draggable", "true");
        drag.dataset.name = item.name;

        draggableCol.appendChild(drag);

        drag.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text", drag.id);
        });
    });

    // Drop labels
    shuffledDrops.forEach(item => {
        const drop = document.createElement("div");
        drop.className = "dropzone";
        drop.textContent = item.name;

        dropCol.appendChild(drop);

        drop.addEventListener("dragover", e => e.preventDefault());
        drop.addEventListener("dragenter", () => drop.classList.add("hover"));
        drop.addEventListener("dragleave", () => drop.classList.remove("hover"));

        drop.addEventListener("drop", e => {
            e.preventDefault();
            drop.classList.remove("hover");

            const draggedId = e.dataTransfer.getData("text");
            const draggedEl = document.getElementById(draggedId);

            if (!draggedEl || draggedEl.style.visibility === "hidden") return;

            // ✅ CORRECT MATCH
            if (draggedEl.dataset.name === drop.textContent) {
                playSound(correctSound);

                drop.textContent = draggedEl.textContent + " ✅";
                draggedEl.style.visibility = "hidden";

                score++;
                scoreEl.textContent = score;

                // 👏 Clap every 5 correct answers
                if (score % 5 === 0) {
                    setTimeout(() => playSound(clapSound), 300);
                }
            }
            // ❌ WRONG MATCH
            else {
                playSound(wrongSound);

                drop.style.backgroundColor = "#ff0000";
                setTimeout(() => drop.style.backgroundColor = "#ff4081", 500);
            }
        });
    });
}

/* =========================
   RESET GAME FUNCTION
========================= */
function resetGame() {
    score = 0;
    currentSet = 0;
    scoreEl.textContent = score;
    
    // Remove congratulations card if it exists
    const congratsCard = document.querySelector(".congrats");
    if (congratsCard) {
        congratsCard.remove();
    }
    
    // Show the game columns and buttons
    draggableCol.style.display = "flex";
    dropCol.style.display = "flex";
    nextBtn.style.display = "inline-block";
    prevBtn.style.display = "none";
    
    // Reload the first set
    loadSet();
}

/* =========================
   ▶ NEXT / PREVIOUS
========================= */
nextBtn.onclick = () => {
    if (currentSet < sets.length - 1) {
        currentSet++;
        loadSet();
    } else {
        playSound(finishSound);

        draggableCol.innerHTML = "";
        dropCol.innerHTML = "";
        nextBtn.style.display = "none";
        prevBtn.style.display = "none";

        const container = document.querySelector(".container");
        const congrats = document.createElement("div");
        congrats.className = "congrats";
        congrats.innerHTML = `
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You finished all matches 👏</p>
            <p>Final score: ${score} ✅</p>
            <button id="playAgainBtn" class="btn">PLAY AGAIN</button>
        `;

        container.insertBefore(congrats, document.querySelector("footer"));
        
        // Add event listener to the play again button
        const playAgainBtn = document.getElementById("playAgainBtn");
        playAgainBtn.addEventListener("click", resetGame);
    }
};

prevBtn.onclick = () => {
    if (currentSet > 0) {
        currentSet--;
        loadSet();
    }
};

/* =========================
   🚀 START GAME
========================= */
window.onload = loadSet;