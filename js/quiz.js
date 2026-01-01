// =========================
// 🔊 SOUND SETUP
// =========================
let isMuted = false;

const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");
const clapSound = new Audio("sounds/clap.mp3");
const finishSound = new Audio("sounds/finish.mp3");

function playSound(sound) {
    if (!isMuted) {
        sound.currentTime = 0;
        sound.play();
    }
}
muteBtn.onclick = () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? "🔇 Sound OFF" : "🔊 Sound ON";
};

// =========================
// 🧠 QUIZ DATA
// =========================
const questions = [
    { question: "Which number comes after 2?", options: ["1", "2", "3", "4"], answer: "3" },
    { question: "Which letter is first in the alphabet?", options: ["A", "B", "C", "D"], answer: "A" },
    { question: "Which color is the sky?", options: ["Blue", "Red", "Green", "Yellow"], answer: "Blue" },
    { question: "What animal says 'Meow'?", options: ["Dog", "Cat", "Cow", "Sheep"], answer: "Cat" },
    { question: "Which number comes before 5?", options: ["3", "4", "5", "6"], answer: "4" },
    { question: "Which fruit is yellow?", options: ["Apple", "Banana", "Grapes", "Cherry"], answer: "Banana" }
];

let score = 0;
let currentIndex = 0;
let tries = [0, 0];

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const quizBox = document.querySelector(".quiz-box"); // Get the quiz-box container

// =========================
// 📄 LOAD QUESTIONS
// =========================
function loadQuestions() {
    tries = [0, 0];

    prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
    nextBtn.style.display = "inline-block";

    // Make sure quiz box is visible
    if (quizBox) {
        quizBox.style.display = "block";
    }

    for (let i = 0; i < 2; i++) {
        const qIndex = currentIndex + i;
        const qText = document.getElementById(`question${i + 1}`);
        const feedback = document.getElementById(`feedback${i + 1}`);

        if (questions[qIndex]) {
            qText.textContent = questions[qIndex].question;
            feedback.textContent = "Select an answer!";

            for (let j = 0; j < 4; j++) {
                const btn = document.getElementById(`q${i + 1}a${j + 1}`);
                btn.style.display = "inline-block";
                btn.textContent = questions[qIndex].options[j];
                btn.disabled = false;
                btn.classList.remove("disabled");
                btn.onclick = () => checkAnswer(i, questions[qIndex].options[j], qIndex);
            }
        } else {
            qText.textContent = "";
            feedback.textContent = "";
            for (let j = 0; j < 4; j++) {
                document.getElementById(`q${i + 1}a${j + 1}`).style.display = "none";
            }
        }
    }
}

// =========================
// ✅ CHECK ANSWER (SOUNDS)
// =========================
function checkAnswer(displayIndex, selected, qIndex) {
    const feedback = document.getElementById(`feedback${displayIndex + 1}`);
    const correctAnswer = questions[qIndex].answer;

    if (selected === correctAnswer) {
        feedback.textContent = "✅ Yay! Correct!";
        score++;
        document.getElementById("score").textContent = score;

        playSound(correctSound);

        // 👏 Clap every 5 correct answers
        if (score % 5 === 0) {
            setTimeout(() => playSound(clapSound), 300);
        }

        disableButtons(displayIndex);
    } else {
        tries[displayIndex]++;
        playSound(wrongSound);

        if (tries[displayIndex] >= 3) {
            feedback.textContent = `❌ Oops! The correct answer is "${correctAnswer}"`;
            disableButtons(displayIndex);
        } else {
            feedback.textContent = "❌ Oops! Try again!";
        }
    }
}

// =========================
// 🚫 DISABLE BUTTONS
// =========================
function disableButtons(displayIndex) {
    for (let j = 0; j < 4; j++) {
        const btn = document.getElementById(`q${displayIndex + 1}a${j + 1}`);
        btn.disabled = true;
        btn.classList.add("disabled");
    }
}

// =========================
// RESET GAME FUNCTION
// =========================
function resetGame() {
    score = 0;
    currentIndex = 0;
    document.getElementById("score").textContent = score;
    
    // Remove congratulations card if it exists
    const congratsCard = document.querySelector(".congrats");
    if (congratsCard) {
        congratsCard.remove();
    }
    
    // Show the quiz box and navigation buttons
    if (quizBox) {
        quizBox.style.display = "block";
    }
    nextBtn.style.display = "inline-block";
    prevBtn.style.display = "none";
    
    // Reset all answer buttons to their original state
    for (let i = 1; i <= 2; i++) {
        const feedback = document.getElementById(`feedback${i}`);
        if (feedback) {
            feedback.textContent = "Select an answer!";
        }
        
        for (let j = 1; j <= 4; j++) {
            const btn = document.getElementById(`q${i}a${j}`);
            if (btn) {
                btn.disabled = false;
                btn.classList.remove("disabled");
            }
        }
    }
    
    // Reload the first questions
    loadQuestions();
}

// =========================
// ▶ NEXT QUESTIONS
// =========================
nextBtn.onclick = () => {
    currentIndex += 2;

    if (currentIndex >= questions.length) {
        playSound(finishSound);

        // Hide the quiz box instead of removing elements
        if (quizBox) {
            quizBox.style.display = "none";
        }
        nextBtn.style.display = "none";
        prevBtn.style.display = "none";

        const container = document.querySelector(".container");
        const congrats = document.createElement("div");
        congrats.className = "congrats";
        congrats.innerHTML = `
            <h2>🎈🎉 Congratulations! 🎉🎈</h2>
            <p>You have finished the quiz 📚</p>
            <p>Your final score is: ${score} ✅</p>
           <button id="playAgainBtn" class="btn">PLAY AGAIN</button>
        `;
        // Insert congrats before the site footer if present and a sibling,
        // otherwise append inside the container.
        // Hide everything in the container except the page title (h1)
        Array.from(container.children).forEach(child => {
            if (child.tagName.toLowerCase() === 'header') {
                Array.from(child.children).forEach(hc => {
                    if (hc.tagName.toLowerCase() !== 'h1') hc.style.display = 'none';
                });
            } else {
                child.style.display = 'none';
            }
        });

        // Insert congrats before the site footer if present and a sibling,
        // otherwise append inside the container.
        const siteFooter = document.querySelector('.site-footer') || document.querySelector('footer');
        if (siteFooter && siteFooter.parentNode === container.parentNode) {
            container.parentNode.insertBefore(congrats, siteFooter);
        } else {
            container.appendChild(congrats);
        }

        // Move the back-to-home button below the congrats card
        const footerActions = document.querySelector('.footer-actions');
        if (footerActions) {
            if (congrats.nextSibling) congrats.parentNode.insertBefore(footerActions, congrats.nextSibling);
            else congrats.parentNode.appendChild(footerActions);
            footerActions.style.display = 'block';
        }

        // Add event listener to the play again button
        const playAgainBtn = document.getElementById("playAgainBtn");
        playAgainBtn.addEventListener("click", resetGame);
    } else {
        loadQuestions();
    }
};

// =========================
// ◀ PREVIOUS QUESTIONS
// =========================
prevBtn.onclick = () => {
    if (currentIndex >= 2) {
        currentIndex -= 2;
        loadQuestions();
    }
};

// =========================
// 🚀 START
// =========================
window.onload = loadQuestions;