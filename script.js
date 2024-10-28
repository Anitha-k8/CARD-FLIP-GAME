const cards = document.querySelectorAll('.card');
const startButton = document.getElementById("start-button");
const timerDisplay = document.getElementById("timer");
const attemptsDisplay = document.getElementById("attempts");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-button");
const difficultyLevel = document.getElementById("levels"); 

let cardOne, cardTwo;
let disableDeck = false;
let matchedCard = 0;
let attempts = 0;
let timer;
let timeElapsed = 0;
let score = 0;
let maxPairs = 8; 

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

function startGame() {
    setDifficulty(); 
    resetGame(); 
    shuffleCard(); 
    timer = setInterval(updateTimer, 1000);
}

function setDifficulty() {
    const difficulty = difficultyLevel.value;
    if (difficulty === 'easy') {
        maxPairs = 4; 
    } else if (difficulty === 'medium') {
        maxPairs = 6; 
    } else {
        maxPairs = 8; 
    }
}

function resetGame() {
    clearInterval(timer); 
    timeElapsed = 0;
    attempts = 0;
    matchedCard = 0;
    score = 0;
    cardOne = cardTwo = null;
    disableDeck = false;

    timerDisplay.textContent = `Time: 0s`;
    attemptsDisplay.textContent = `Attempts: 0`;
    scoreDisplay.textContent = `Score: 0`;

    
    cards.forEach((card, index) => {
        card.classList.remove('flip');
        card.removeEventListener('click', flipCard);
        if (index < maxPairs * 2) {
            card.style.display = 'flex'; 
            card.addEventListener('click', flipCard);
        } else {
            card.style.display = 'none'; 
        }
    });
}

function updateTimer() {
    timeElapsed++;
    timerDisplay.textContent = `Time: ${timeElapsed}s`;
}

function flipCard(e) {
    let clickedCard = e.target;

    if (clickedCard !== cardOne && !disableDeck) {
        clickedCard.classList.add('flip');

        if (!cardOne) {
            cardOne = clickedCard;
            return;
        }

        cardTwo = clickedCard;
        disableDeck = true;
        attempts++;
        attemptsDisplay.textContent = `Attempts: ${attempts}`;

        let cardOneImg = cardOne.querySelector('img').src;
        let cardTwoImg = cardTwo.querySelector('img').src;

        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if (img1 === img2) {
        matchedCard++;
        score += 20;
        scoreDisplay.textContent = `Score: ${score}`;

        if (matchedCard === maxPairs) { 
            clearInterval(timer);
            setTimeout(() => alert(`Game Over! You completed the game in ${attempts} attempts, ${timeElapsed} seconds, and scored ${score} points.`), 500);
        }

        cardOne.removeEventListener('click', flipCard);
        cardTwo.removeEventListener('click', flipCard);
        resetFlipState();
    } else {
        setTimeout(() => {
            cardOne.classList.add('shake');
            cardTwo.classList.add('shake');
        }, 400);

        setTimeout(() => {
            cardOne.classList.remove('shake', 'flip');
            cardTwo.classList.remove('shake', 'flip');
            resetFlipState();
        }, 1200);
    }
}

function resetFlipState() {
    cardOne = cardTwo = null;
    disableDeck = false;
}

function shuffleCard() {
    const arr = Array.from({ length: maxPairs }, (_, i) => i + 1).flatMap(i => [i, i]);
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);

    cards.forEach((card, index) => {
        if (index < maxPairs * 2) {
            const imgTag = card.querySelector('img');
            imgTag.src = `cards/img-${arr[index]}.png`;
            card.classList.remove("flip");
        }
    });
}