const wordDisplay = document.getElementById('wordDisplay');
const textInput = document.getElementById('textInput');
const startButton = document.getElementById('startButton');
const accuracyDisplay = document.getElementById('accuracy');
const wpmDisplay = document.getElementById('wpm');

const sentences = [
    'Ngan sieu cap vip pro',
    'Hung khung loz',
    'Hoa sieu cap dep gai'
];

let startTime, interval;
let totalChars = 0;
let correctChars = 0;

startButton.addEventListener('click', startGame);
textInput.addEventListener('input', checkInput);

// uodate them sau khi design front
function startGame() {
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
    startButton.disabled = true;
    totalChars = 0;
    correctChars = 0;
    startTime = new Date().getTime();
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    wordDisplay.textContent = randomSentence;
    startTime = new Date().getTime();
    interval = setInterval(updateWPM, 1000);
}

function checkInput() {
    const inputText = textInput.value;
    const displayText = wordDisplay.textContent;
    totalChars = inputText.length;

    let correctCount = 0;
    for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] === displayText[i]) {
            correctCount++;
        }
    }

    correctChars = correctCount;
    const accuracy = Math.floor((correctChars / totalChars) * 100);
    accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;

    if (inputText === displayText) {
        clearInterval(interval);
        startButton.disabled = false;
        textInput.disabled = true;
    }
}

// Function check time
function updateWPM() {
    const currentTime = new Date().getTime();
    const timeDiff = (currentTime - startTime) / 1000 / 60; // in minutes
    const words = totalChars / 5;
    const wpm = Math.floor(words / timeDiff);
    wpmDisplay.textContent = `WPM: ${wpm}`;
}
// Function count time 
function startTimer(duration) {
    let timer = duration, minutes, seconds;
    const timerDisplay = document.createElement('p');
    timerDisplay.id = 'timer';
    document.querySelector('.stats').appendChild(timerDisplay);

    const countdownInterval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        timerDisplay.textContent = `Time: ${minutes}:${seconds}`;

        if (--timer < 0) {
            clearInterval(countdownInterval);
            endGame();
        }
    }, 1000);
}
// Function end game
function endGame() {
    clearInterval(interval);
    textInput.disabled = true;
    startButton.disabled = false;
    alert("Time out!! you loser");
}
