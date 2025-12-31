// List of Amharic letters
const letters = [
  "ሀ","ለ","ሐ","መ","ሰ","ረ","ቀ","በ","ተ","ነ","አ","ደ","ገ","ጠ","ጨ","ፈ"
];

// Map each letter to its sound file (all in 'sounds/' folder)
const letterSounds = {
  "ሀ": "sounds/Ha-1.mp3",
  "ለ": "sounds/Le.mp3",
  "ሐ": "sounds/Ha2-1.mp3",
  "መ": "sounds/Me-1.mp3",
  "ሰ": "sounds/Se-1.mp3",
  "ረ": "sounds/Re-1.mp3",
  "ቀ": "sounds/Ke-1.mp3",
  "በ": "sounds/Be.mp3",
  "ተ": "sounds/Te_2.mp3",
  "ነ": "sounds/Ne.mp3",
  "አ": "sounds/a.mp3",
  "ደ": "sounds/De.mp3",
  "ገ": "sounds/Ge.mp3",
  "ጠ": "sounds/te2.mp3",
  "ጨ": "sounds/Che.mp3",
  "ፈ": "sounds/Fe.mp3"
};

// Insert letters into grid
const lettersGrid = document.getElementById("lettersGrid");

letters.forEach(letter => {
  const btn = document.createElement("button");
  btn.className = "letter-btn";
  btn.textContent = letter;

  btn.addEventListener("click", () => {
    const audioSrc = letterSounds[letter];
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play().catch(err => console.log("Audio error:", err));
    }

    // Visual click feedback
    btn.style.transform = "scale(1.3)";
    setTimeout(() => btn.style.transform = "scale(1)", 300);
  });

  lettersGrid.appendChild(btn);
});
