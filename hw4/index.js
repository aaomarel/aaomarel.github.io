// Game choices
const choices = ["Rock", "Paper", "Scissors"];
const images = {
    "Rock": "images/rock.png",
    "Paper": "images/paper.png",
    "Scissors": "images/scissors.png",
    "Question": "images/question.png"
};

// DOM elements
const playerChoices = document.querySelectorAll('.player-choice');
const computerImage = document.getElementById('computer-image');
const resultDisplay = document.getElementById('result');
const winsCount = document.getElementById('wins-count');
const tiesCount = document.getElementById('ties-count');
const lossesCount = document.getElementById('losses-count');
const resetButton = document.getElementById('reset-button');

// Game state
let isGameInProgress = false;
let scores = {
    wins: 0,
    ties: 0,
    losses: 0
};

// Initialize game
function init() {
    // Load scores from local storage if available
    loadScores();
    
    // Set up event listeners
    playerChoices.forEach(choice => {
        choice.addEventListener('click', () => {
            if (!isGameInProgress) {
                playGame(choice.dataset.choice, choice);
            }
        });
    });
    
    // Reset button handler
    resetButton.addEventListener('click', resetScores);
}

// Load scores from localStorage
function loadScores() {
    const savedScores = localStorage.getItem('rpsScores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
        updateScoreDisplay();
    }
}

// Save scores to localStorage
function saveScores() {
    localStorage.setItem('rpsScores', JSON.stringify(scores));
}

// Update the score display elements
function updateScoreDisplay() {
    winsCount.textContent = scores.wins;
    tiesCount.textContent = scores.ties;
    lossesCount.textContent = scores.losses;
}

// Reset scores
function resetScores() {
    scores = {
        wins: 0,
        ties: 0,
        losses: 0
    };
    
    // Update display and localStorage
    updateScoreDisplay();
    saveScores();
    
    // Reset game elements
    resetGameElements();
}

// Reset game elements
function resetGameElements() {
    // Remove selection from player choices
    playerChoices.forEach(choice => {
        choice.classList.remove('selected');
    });
    
    // Reset computer display
    computerImage.src = images.Question;
    
    // Reset result display
    resultDisplay.textContent = "Make your move to start the game!";
    resultDisplay.classList.remove('win', 'lose', 'tie');
}

// Main game function
function playGame(playerChoice, selectedElement) {
    if (isGameInProgress) return;
    isGameInProgress = true;
    
    // Clear any previous selections
    playerChoices.forEach(choice => {
        choice.classList.remove('selected');
    });
    
    // Highlight selected choice
    selectedElement.classList.add('selected');
    
    // Begin computer choice animation
    shuffleComputerChoice();
    
    // After 3 seconds, determine computer choice and winner
    setTimeout(() => {
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        computerImage.src = images[computerChoice];
        
        // Determine winner and update result display
        const result = determineWinner(playerChoice, computerChoice);
        displayResult(result, playerChoice, computerChoice);
        
        // Update scores and save
        updateScores(result);
        saveScores();
        
        // Game is no longer in progress
        isGameInProgress = false;
    }, 3000); // 3 seconds of thinking time
}

// Shuffle computer choice images
function shuffleComputerChoice() {
    let counter = 0;
    const shuffleInterval = setInterval(() => {
        const randomChoice = choices[Math.floor(Math.random() * 3)];
        computerImage.src = images[randomChoice];
        counter++;
        
        // Stop after 6 shuffles (3 seconds total, changing every 0.5 seconds)
        if (counter >= 6) {
            clearInterval(shuffleInterval);
        }
    }, 500); // Change every 0.5 seconds
}

// Determine the winner of the game
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return "tie";
    } else if (
        (playerChoice === "Rock" && computerChoice === "Scissors") ||
        (playerChoice === "Paper" && computerChoice === "Rock") ||
        (playerChoice === "Scissors" && computerChoice === "Paper")
    ) {
        return "win";
    } else {
        return "lose";
    }
}

// Display the result of the game
function displayResult(result, playerChoice, computerChoice) {
    resultDisplay.classList.remove('win', 'lose', 'tie');
    
    let message = "";
    if (result === "win") {
        message = `You win! ${playerChoice} beats ${computerChoice}`;
        resultDisplay.classList.add('win');
    } else if (result === "lose") {
        message = `You lose! ${computerChoice} beats ${playerChoice}`;
        resultDisplay.classList.add('lose');
    } else {
        message = `It's a tie! Both chose ${playerChoice}`;
        resultDisplay.classList.add('tie');
    }
    
    resultDisplay.textContent = message;
}

// Update scores based on result
function updateScores(result) {
    if (result === "win") {
        scores.wins++;
    } else if (result === "tie") {
        scores.ties++;
    } else {
        scores.losses++;
    }
    
    updateScoreDisplay();
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', init);