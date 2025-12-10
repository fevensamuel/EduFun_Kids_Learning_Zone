let score = 0;

// Map of draggable items to correct drop zones
const matches = {
    apple: "zone2",
    banana: "zone1",
    grapes: "zone4",
    strawberry: "zone3"
};

const draggables = document.querySelectorAll(".draggable");
const dropzones = document.querySelectorAll(".dropzone");

// Drag events
draggables.forEach(item => {
    item.addEventListener("dragstart", dragStart);
});

dropzones.forEach(zone => {
    zone.addEventListener("dragover", dragOver);
    zone.addEventListener("drop", drop);
});

// Drag functions
function dragStart(e) {
    e.dataTransfer.setData("text", e.target.id);
}

function dragOver(e) {
    e.preventDefault(); // Necessary to allow drop
}

function drop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text");
    const draggedEl = document.getElementById(draggedId);
    
    // Check correct match
    if (matches[draggedId] === e.target.id) {
        e.target.textContent = draggedEl.textContent; // Show fruit in dropzone
        draggedEl.style.visibility = "hidden";        // Hide original fruit
        score++;
        document.getElementById("score").textContent = score;
    } else {
        alert("❌ Oops! Try again!"); // Friendly message
    }
}
