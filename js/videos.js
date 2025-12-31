/* =====================
   TAB FUNCTIONALITY
===================== */
const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");
const finishSound = new Audio("sounds/finish.mp3");
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
    });
});

/* =====================
   STARS
===================== */
let stars = 0;

function addStar() {
    stars++;
    document.getElementById("starCount").innerText = stars;
}

/* =====================
   RIDDLES + LANGUAGE
===================== */
let lang = "en";
let index = 0;

const riddles = [
    {
        en: { q: "What has hands but cannot clap?", a: "A clock ⏰" },
        am: { q: "እጆች ያሉት ግን መደብደብ የማይችል ምንድን ነው?", a: "ሰዓት ⏰" }
    },
    {
        en: { q: "What goes up but never comes down?", a: "Your age 🎂" },
        am: { q: "የሚወጣ ግን የማይወርድ ምንድን ነው?", a: "እድሜ 🎂" }
    },
    {
        en: { q: "What has a face and two hands but no arms?", a: "A clock 🕒" },
        am: { q: "ፊትና ሁለት እጆች ያሉት ግን እጆች የሌለው ምንድን ነው?", a: "ሰዓት 🕒" }
    },
    {
        en: { q: "What has a mouth but cannot talk?", a: "A river 🌊" },
        am: { q: "አፍ ያለው ግን መናገር የማይችል ምንድን ነው?", a: "ወንዝ 🌊" }
    },
    {
        en: { q: "What has keys but cannot open doors?", a: "A piano 🎹" },
        am: { q: "ቁልፎች ያሉት ግን በር የማይከፍት ምንድን ነው?", a: "ፒያኖ 🎹" }
    },
    {
        en: { q: "What runs but never walks?", a: "Water 💧" },
        am: { q: "የሚሮጥ ግን የማይሄድ ምንድን ነው?", a: "ውሃ 💧" }
    },
    {
        en: { q: "What has a neck but no head?", a: "A bottle 🍾" },
        am: { q: "አንገት ያለው ግን ራስ የሌለው ምንድን ነው?", a: "ጠርሙስ 🍾" }
    },
    {
        en: { q: "What gets wetter the more it dries?", a: "A towel 🧺" },
        am: { q: "በሚያደርቅ መጠን የሚረጥብ ምንድን ነው?", a: "ፎጣ 🧺" }
    },
    {
        en: { q: "What has an eye but cannot see?", a: "A needle 🪡" },
        am: { q: "አይን ያለው ግን የማያይ ምንድን ነው?", a: "መርፌ 🪡" }
    },
    {
        en: { q: "What is full of holes but still holds water?", a: "A sponge 🧽" },
        am: { q: "ቀዳዳ ብዙ ያለው ግን ውሃ የሚይዝ ምንድን ነው?", a: "ስፖንጅ 🧽" }
    }
];

const riddleBox = document.querySelector(".riddle-box");
const riddleSection = document.getElementById("riddles");
let congratsCard = null;

/* Load current riddle */
function loadRiddle() {
    // Remove congrats card if going back
    if(congratsCard) {
        congratsCard.remove();
        congratsCard = null;
        riddleBox.style.display = "block";
    }

    // Clamp index
    if(index < 0) index = 0;
    if(index >= riddles.length) {
        showCongrats();
        return;
    }

    document.getElementById("riddleText").innerText = riddles[index][lang].q;
    document.getElementById("answerText").innerText = riddles[index][lang].a;
    document.getElementById("answerText").classList.add("hidden");
}

/* Show answer */
function showAnswer() {
    document.getElementById("answerText").classList.remove("hidden");
    addStar();
}

/* Next riddle */
function nextRiddle() {
    index++;
    loadRiddle();
}

/* Previous riddle */
function prevRiddle() {
    index--;
    loadRiddle();
}

/* Language switch */
function setLanguage(l) {
    lang = l;
    loadRiddle();
}


function showCongrats() {
    
    riddleBox.style.display = "none";
     const finishSound = new Audio("sounds/finish.mp3");
    finishSound.play();
 
    // Create congratulation card inside riddles section
    congratsCard = document.createElement("div");
    congratsCard.className = "congrats";
    congratsCard.innerHTML = `
        <h2>🎉 Congratulations! 🎉</h2>
        <p>You finished all riddles 👏</p>
        <p>Final score: ${stars} ⭐️</p>
        <button id="backBtn">PLAY AGIAN</button>
    `;
    riddleSection.insertBefore(congratsCard, riddleBox.nextSibling);

    // Create confetti for 5 seconds
   
    // Previous button on congrats card
    document.getElementById("backBtn").addEventListener("click", () => {
        index = riddles.length - 1; // go back to last question
        loadRiddle();
    });
}

/* =====================
   BUTTO
/* =====================
   BUTTON EVENT LISTENERS
===================== */
document.getElementById("nextBtn").addEventListener("click", nextRiddle);
document.getElementById("prevBtn").addEventListener("click", prevRiddle);

/* INITIAL LOAD */
loadRiddle();