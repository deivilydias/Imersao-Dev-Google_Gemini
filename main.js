// Lista de letras do alfabeto e o caminho para as imagens dos sinais em Libras
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const signsPath = "./signs/"; // Aponte para a pasta onde as imagens estão armazenadas

// Elementos do DOM
const cardsContainer = document.getElementById('cards-container');
const startButton = document.getElementById('start-game');
const startTeachingButton = document.getElementById('start-teaching');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const coinsDisplay = document.getElementById('coins');
const currentLetterDisplay = document.getElementById('current-letter');
const teachingPhase = document.getElementById('teaching-phase');
const questionPhase = document.getElementById('question-phase');
const teachingLetterDisplay = document.getElementById('teaching-letter');
const teachingSignDisplay = document.getElementById('teaching-sign');
const nextLetterButton = document.getElementById('next-letter');

// Variáveis do jogo
let score = 0;
let coins = 0;
let timeLeft = 60;
let timer;
let correctLetter;
let teachingIndex = 0;

function startTeaching() {
    teachingIndex = 0;
    teachingPhase.style.display = 'block';
    questionPhase.style.display = 'none';
    startTeachingButton.style.display = 'none';
    startButton.style.display = 'none';
    showTeachingLetter();
}

function showTeachingLetter() {
    if (teachingIndex < alphabet.length) {
        const currentTeachingLetter = alphabet[teachingIndex];
        teachingLetterDisplay.textContent = currentTeachingLetter;
        teachingSignDisplay.src = `${signsPath}${currentTeachingLetter}.png`;
        teachingSignDisplay.alt = `Sinal de ${currentTeachingLetter}`;
    } else {
        endTeaching();
    }
}

function endTeaching() {
    teachingPhase.style.display = 'none';
    startButton.style.display = 'block'; // Mostrar o botão para iniciar o questionário
}

nextLetterButton.addEventListener('click', () => {
    teachingIndex++;
    showTeachingLetter();
});

function startGame() {
    console.log('Jogo iniciado'); // Verificação para garantir que a função é chamada
    score = 0;
    coins = 0;
    timeLeft = 60;
    updateDisplay();
    startButton.disabled = true;

    // Iniciar o temporizador
    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    // Mostrar a fase do quiz e ocultar outras fases
    questionPhase.style.display = 'block';
    cardsContainer.innerHTML = ''; // Limpar cartas anteriores
    generateCards();
}

function generateCards() {
    // Selecionar aleatoriamente uma letra correta para mostrar
    correctLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    currentLetterDisplay.textContent = correctLetter; // Mostrar a letra que o jogador deve identificar

    // Embaralhar o alfabeto e selecionar algumas letras incorretas para mostrar junto
    let shuffledAlphabet = alphabet.filter(letter => letter !== correctLetter);
    shuffledAlphabet = shuffledAlphabet.sort(() => 0.5 - Math.random()).slice(0, 4); // Pegar 4 letras incorretas
    shuffledAlphabet.push(correctLetter); // Adicionar a letra correta no mix

    // Embaralhar novamente para não sabermos onde está a correta
    shuffledAlphabet = shuffledAlphabet.sort(() => 0.5 - Math.random());

    // Limpar cartas anteriores
    while (cardsContainer.firstChild) {
        cardsContainer.removeChild(cardsContainer.firstChild);
    }

    shuffledAlphabet.forEach(letter => {
        const card = document.createElement('div');
        card.classList.add('card');
        const img = document.createElement('img');
        img.src = `${signsPath}${letter}.png`; // Caminho da imagem correspondente à letra
        img.alt = `Sinal de ${letter}`;
        card.appendChild(img);
        card.addEventListener('click', () => checkAnswer(letter, card));
        cardsContainer.appendChild(card);
    });
}

function checkAnswer(selectedLetter, card) {
    if (selectedLetter === correctLetter) {
        score++;
        coins += 10;
        card.style.backgroundColor = 'lightgreen';
    } else {
        card.style.backgroundColor = 'red';
    }
    card.style.pointerEvents = 'none'; // Desativar clique na carta já clicada
    updateDisplay();

    // Gerar novas cartas após um pequeno atraso
    setTimeout(generateCards, 1000);
}

function updateDisplay() {
    timerDisplay.textContent = timeLeft;
    scoreDisplay.textContent = score;
    coinsDisplay.textContent = coins;
}

function endGame() {
    clearInterval(timer);
    alert(`Jogo Terminado! Você fez ${score} acertos e ganhou ${coins} coins.`);
    startButton.disabled = false;
    questionPhase.style.display = 'none'; // Ocultar a fase do quiz após o término do jogo
}

// Esperar o DOM estar pronto antes de adicionar o evento
document.addEventListener('DOMContentLoaded', () => {
    startTeachingButton.addEventListener('click', startTeaching);
    startButton.addEventListener('click', startGame);
});
