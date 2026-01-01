// =========================
// 🔊 SOUND SETUP + MUTE
// =========================
let isMuted = false;

const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");
const finishSound = new Audio("sounds/finish.mp3");
const clapSound = new Audio("sounds/clap.mp3");

function playSound(sound) {
  if (!isMuted) {
    sound.currentTime = 0;
    sound.play();
  }
}

// =========================
// 🔇 MUTE / UNMUTE BUTTON
// =========================
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

// =========================
// 📘 AMHARIC WORD DATA
// =========================
const words = [
  { start: "ሀ", full: ["ሀብል","ሀብት","ሀይማኖት","ሀና","ሀውልት","ሀገር","ሀበሻ","ሀሳብ","ሀላፊ","ሀዘን"] },
  { start: "ለ", full:["ለጋሽ","ለምለም","ለሰነ","ለበሰ","ለገሰ"]},
  { start: "ሐ", full:["ሐምሌ","ሐኪም","ሐሳብ","ሐይል","ሐመር","ሐቀኛ"]},
  { start: "መ", full:["መልእክት","መምህር","መረጃ","መብላት","መኪና","መንገድ","መስመር"]},
  { start: "ሰ", full:["ሰላም","ሰንበት","ሰአት","ሰማይ","ሰላጣ","ሰው","ሰኔ"]},
  { start: "ቀ", full:["ቀን","ቀለም","ቀልድ","ቀይ"]},
  { start: "በ", full:["በለስ","በቆሎ","በር","በረከት"]},
  { start: "ተ", full:["ተረት","ተልባ","ተኩስ","ተጫዋች"]},
  { start: "ነ", full:["ነፃ","ነገር","ነሐሴ","ነውር"]},
  { start: "አ", full:["አበባ","አልጋ","አንበሳ","አዲስ"]},
  { start: "ደ", full:["ደጀን","ደመና","ደብር","ደን"]},
  { start: "ገ", full:["ገበሬ","ገንዘብ","ገቢ","ገና"]},
  { start: "ጠ", full:["ጠረጴዛ","ጠባብ","ጠጣ","ጠንካራ"]},
  { start: "ጨ", full:["ጨዋታ","ጨርቅ","ጨው","ጨለማ"]},
  { start: "ፈ", full:["ፈረስ","ፈንታ","ፈላስፋ"]}
];

let currentIndex = 0;
let score = 0;

// Elements
const hohayEl = document.getElementById("hohay");
const userInput = document.getElementById("userInput");
const feedback = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const container = document.querySelector(".container");

const footerActions = document.querySelector('.footer-actions');

prevBtn.style.display = "none";

// =========================
// 🔄 LOAD WORD
// =========================
function loadWord() {
  const current = words[currentIndex];
  hohayEl.textContent = current.start;
  userInput.value = "";
  feedback.textContent = "Try to build a word!";
  feedback.style.color = "#ff4081";

  prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
}

// =========================
// ✅ SUBMIT ANSWER
// =========================
submitBtn.onclick = () => {
  const current = words[currentIndex];
  const answer = userInput.value.trim();
  if (!answer) return;

  if (current.full.includes(answer)) {
    feedback.textContent = "✅ ትክክል ነው!";
    feedback.style.color = "#4caf50";
    score++;
    scoreEl.textContent = score;

    playSound(correctSound);

    // 👏 Clap every 5 correct
    if (score % 5 === 0) {
      setTimeout(() => playSound(clapSound), 300);
    }
  } else {
    feedback.textContent = "❌ ዳግመኛ ሞክር!";
    feedback.style.color = "#ff4081";
    playSound(wrongSound);
  }
};

// =========================
// ▶ NEXT WORD
// =========================
nextBtn.onclick = () => {
  if (currentIndex < words.length - 1) {
    currentIndex++;
    loadWord();
  } else {
    // Play finish sound
    playSound(finishSound);

    // Hide quiz elements
    hohayEl.style.display = "none";
    userInput.style.display = "none";
    submitBtn.style.display = "none";
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
    feedback.style.display = "none";
    scoreEl.parentElement.style.display = "none"; // hides Score
    const labelEl = document.querySelector('.hohay-box .start-text');
    if (labelEl) labelEl.style.display = 'none';

    // Show congratulations card inline
    const congrats = document.createElement("div");
    congrats.className = "congrats";
    congrats.style.textAlign = "center"; 
    congrats.style.margin = "50px auto"; 

    congrats.innerHTML = `
      <h2>🎉 እንኳን ደስ አለህ! 🎉</h2>
      <p>የመጨረሻ ውጤትህ: ${score} ✅</p>
      <button id="playAgainBtn" class="btn">PLAY AGAIN</button>
      
    `;

    // Insert card before the site footer if present, otherwise append inside the container.
    const siteFooter = document.querySelector('.site-footer') || document.querySelector('footer');
    if (siteFooter && siteFooter.parentNode) {
      siteFooter.parentNode.insertBefore(congrats, siteFooter);
    } else {
      container.appendChild(congrats);
    }

    // Move the back-to-home actions below the congrats card
    if (footerActions) {
      congrats.parentNode.insertBefore(footerActions, congrats.nextSibling);
      footerActions.style.display = 'flex';
      footerActions.style.justifyContent = 'center';
      footerActions.style.marginTop = '18px';
    }

    // PLAY AGAIN button
    document.getElementById("playAgainBtn").addEventListener("click", () => {
      score = 0;
      scoreEl.textContent = "0";
      currentIndex = 0;

      congrats.remove();

      // move footer actions back into the game area
      if (footerActions) {
        container.appendChild(footerActions);
        footerActions.style.display = '';
        footerActions.style.marginTop = '';
      }

      // Show quiz elements again
      hohayEl.style.display = "block";
      userInput.style.display = "block";
      submitBtn.style.display = "inline-block";
      nextBtn.style.display = "inline-block";
      prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
      feedback.style.display = "block";
      scoreEl.parentElement.style.display = "block";
      const labelEl2 = document.querySelector('.hohay-box .start-text');
      if (labelEl2) labelEl2.style.display = '';

      loadWord();
    });

    // BACK TO HOME button (attach safely to the link)
    const backHomeLink = document.querySelector('.back-home-btn');
    if (backHomeLink) {
      backHomeLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'index.html';
      });
    }
  }
};
