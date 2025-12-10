// All quiz questions
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

// Load 2 questions at a time
function loadQuestions() {
    tries = [0, 0]; // reset tries

    // Show/hide Previous button
    prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
    nextBtn.style.display = "inline-block";

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

// Check answer
function checkAnswer(displayIndex, selected, qIndex) {
    const feedback = document.getElementById(`feedback${displayIndex + 1}`);
    const correctAnswer = questions[qIndex].answer;

    if (selected === correctAnswer) {
        feedback.textContent = "✅ Yay! Correct!";
        score++;
        document.getElementById("score").textContent = score;
        disableButtons(displayIndex);
    } else {
        tries[displayIndex]++;
        if (tries[displayIndex] >= 3) {
            feedback.textContent = `❌ Oops! The correct answer is "${correctAnswer}"`;
            disableButtons(displayIndex);
        } else {
            feedback.textContent = "❌ Oops! Try again!";
        }
    }
}

// Disable buttons
function disableButtons(displayIndex) {
    for (let j = 0; j < 4; j++) {
        document.getElementById(`q${displayIndex + 1}a${j + 1}`).disabled = true;
    }
}

// Next questions
nextBtn.onclick = () => {
    currentIndex += 2;

    if (currentIndex >= questions.length) {
        // Remove questions
        document.querySelectorAll(".question-block").forEach(q => q.remove());
        nextBtn.style.display = "none";
        prevBtn.style.display = "none";

        // Show congratulations
        const container = document.querySelector(".container");
        const congrats = document.createElement("div");
        congrats.className = "congrats";
        congrats.innerHTML = `
            <h2>🎈🎉 Congratulations! 🎉🎈</h2>
            <p>🐱 You have finished the quiz! 📚</p>
            <p>Your final score is: 🍎 ${score} ✅</p>
            <p>🌟 Keep learning and having fun! 🌈✨</p>
        `;
        container.insertBefore(congrats, document.querySelector("footer"));
    } else {
        loadQuestions();
    }
};

// Previous questions
prevBtn.onclick = () => {
    if (currentIndex >= 2) {
        currentIndex -= 2;
        loadQuestions();
    }
};

// Initial load
window.onload = loadQuestions;
