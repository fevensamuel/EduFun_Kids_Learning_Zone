let isMuted = false;

// Sounds
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");
const clapSound = new Audio("sounds/clap.mp3");
const finishSound = new Audio("sounds/finish.mp3");

// Mute/unmute button
const muteBtn = document.getElementById("muteBtn");
muteBtn.onclick = () => {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "🔇 ድምፅ ጠፍቷል" : "🔊 ድምፅ በርቷል";
};

function playSound(sound){
  if(!isMuted){
    sound.currentTime = 0;
    sound.play();
  }
}

// Elements
const geezCol = document.getElementById("geez-column");
const arabicCol = document.getElementById("arabic-column");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");
const container = document.querySelector(".container");

let score = 0;
let currentSection = 0;

// Sections (15 numbers, 3 sections)
const sections = [
  { geez: ["፩","፪","፫","፬","፭"], arabic:["1","2","3","4","5"] },
  { geez: ["፮","፯","፰","፱","፲"], arabic:["6","7","8","9","10"] },
  { geez: ["፲፩","፲፪","፲፫","፲፬","፲፭"], arabic:["11","12","13","14","15"] }
];

// Load current section
function loadSection(){
  geezCol.innerHTML = "";
  arabicCol.innerHTML = "";
  messageEl.textContent = "";

  const {geez, arabic} = sections[currentSection];
  const shuffledArabic = [...arabic].sort(() => Math.random() - 0.5);

  const matchMap = {};
  geez.forEach((g,i)=>{
    const div = document.createElement("div");
    div.className = "number geez";
    div.textContent = g;
    div.setAttribute("draggable","true");
    geezCol.appendChild(div);
    matchMap[g] = arabic[i];

    div.addEventListener("dragstart", e => e.dataTransfer.setData("text", g));
  });

  shuffledArabic.forEach(a => {
    const div = document.createElement("div");
    div.className = "number arabic";
    div.textContent = a;
    arabicCol.appendChild(div);

    div.addEventListener("dragover", e => e.preventDefault());
    div.addEventListener("drop", e => {
      e.preventDefault();
      const dragged = e.dataTransfer.getData("text");

      if(matchMap[dragged] === a){
        div.style.backgroundColor = "#4caf50"; // correct
        const draggedEl = [...geezCol.children].find(c=>c.textContent===dragged);
        draggedEl.style.visibility = "hidden";
        score++; scoreEl.textContent = "Score: " + score;
        playSound(correctSound);
        messageEl.textContent = "";
        if(score % 5 === 0) playSound(clapSound);
      } else {
        div.style.backgroundColor = "#ff0000"; // wrong
        messageEl.textContent = "❌ Oops! Try again!";
        playSound(wrongSound);
        // Reset color after 0.5s when user tries again
        setTimeout(()=>{ div.style.backgroundColor = "#03a9f4"; }, 500);
      }
    });
  });

  prevBtn.style.display = currentSection === 0 ? "none" : "inline-block";
  nextBtn.style.display = "inline-block";
}

// Function to reset the game
function resetGame() {
  score = 0;
  currentSection = 0;
  scoreEl.textContent = "Score: " + score;
  
  // Remove congratulations card if it exists
  const congratsCard = document.querySelector(".congrats");
  if (congratsCard) {
    congratsCard.remove();
  }
  
  // Show the game columns and buttons
  geezCol.style.display = "flex";
  arabicCol.style.display = "flex";
  nextBtn.style.display = "inline-block";
  prevBtn.style.display = "none";
  
  // Reload the first section
  loadSection();
}

// Next section
nextBtn.onclick = () => {
  if(currentSection < sections.length - 1){
    currentSection++;
    loadSection();
  } else {
    playSound(finishSound);
    geezCol.innerHTML = "";
    arabicCol.innerHTML = "";
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";

    // Show congratulations card
    const congrats = document.createElement("div");
    congrats.className = "congrats";
    congrats.innerHTML = `
      <h2>🎉 Congratulations! 🎉</h2>
      <p>You finished all matches 👏</p>
      <p>Final score: ${score} ✅</p>
      <button id="playAgainBtn" class="btn">PLAY AGAIN</button>
    `;
    container.appendChild(congrats);
    congrats.scrollIntoView({behavior:"smooth"});
    
    // Add event listener to the play again button
    const playAgainBtn = document.getElementById("playAgainBtn");
    playAgainBtn.addEventListener("click", resetGame);
  }
};

// Previous section
prevBtn.onclick = () => {
  if(currentSection > 0){
    currentSection--;
    loadSection();
  }
};

// Initial load
window.onload = loadSection;