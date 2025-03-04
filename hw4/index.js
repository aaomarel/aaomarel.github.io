const choices = ["Rock", "Paper", "Scissors"];
const playerDisplay = document.getElementById("playerDisplay");
const computerDisplay = document.getElementById("computerDisplay");
const resultDisplay = document.getElementById("result");

function playGame(playerChoice) {
    // Show player's choice immediately
    playerDisplay.textContent = `You chose: ${playerChoice}`;
    
    // Reset computer and result displays
    computerDisplay.textContent = "Computer is picking";
    computerDisplay.classList.add("picking"); // Add the 'picking' class to trigger animation
    resultDisplay.textContent = "";
    
    // Remove any previous result classes
    resultDisplay.classList.remove("win", "lose", "tie");
    
    // Delay the computer's choice
    setTimeout(() => {
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        let result = "";
        
        if (playerChoice === computerChoice) {
            result = "IT'S A TIE!";
            resultDisplay.classList.add("tie");
        } else if (
            (playerChoice === "Rock" && computerChoice === "Scissors") ||
            (playerChoice === "Paper" && computerChoice === "Rock") ||
            (playerChoice === "Scissors" && computerChoice === "Paper")
        ) {
            result = "YOU WIN!";
            resultDisplay.classList.add("win");
        } else {
            result = "YOU LOSE!";
            resultDisplay.classList.add("lose");
        }
        
        // Update computer's choice and result after delay
        computerDisplay.textContent = `The computer chose: ${computerChoice}`;
        computerDisplay.classList.remove("picking"); // Remove the 'picking' class to stop animation
        resultDisplay.textContent = result;
    }, 2000); // 2 second delay (2000ms)
}