// Definición de los sonidos utilizados en el juego
const backgroundMusic = new Audio('assets/audio/fondo.mp3');
const victorySound = new Audio('assets/audio/victoria.mp3');
const defeatSound = new Audio('assets/audio/derrota.mp3');
const touchSound = new Audio('assets/audio/toque.mp3');

// Configuración inicial para la música de fondo
backgroundMusic.loop = true; // Configura la música de fondo para que se repita

document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play-button');
    if (playButton) {
        playButton.addEventListener('click', function() {
            playBackgroundMusic(); // Inicia la música de fondo cuando el jugador presiona el botón de jugar
            restartGame(); // Inicia la secuencia del juego
        });
    }
});

function playBackgroundMusic() {
    let playPromise = backgroundMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            console.log('Reproducción iniciada con éxito');
        }).catch(error => {
            console.error('Error al intentar reproducir la música de fondo:', error);
        });
    }
}

let cards = [
    'assets/img/A.png', 'assets/img/A.png',
    'assets/img/B.png', 'assets/img/B.png',
    'assets/img/C.png', 'assets/img/C.png',
    'assets/img/D.png', 'assets/img/D.png',
    'assets/img/E.png', 'assets/img/E.png',
    'assets/img/F.png', 'assets/img/F.png',
];
let selectedCards = [];
let matchesFound = 0;
let activeInterval;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    shuffleArray(cards);
    const gameBoard = document.getElementById('game-board').querySelector('.row');
    gameBoard.innerHTML = '';
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('col-4', 'col-sm-4');
        
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        
        const imageTop = document.createElement('div');
        imageTop.classList.add('image-top');
        imageTop.style.backgroundImage = `url(${card})`;
        
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        
        cardDiv.appendChild(imageTop);
        cardDiv.appendChild(cardBack);
        cardElement.appendChild(cardDiv);
        gameBoard.appendChild(cardElement);
        
        cardDiv.addEventListener('click', flipCard);
    });
}

function flipCard() {
    if (selectedCards.length === 2 || this.classList.contains('flipped')) {
        return;
    }

    touchSound.currentTime = 0;
    touchSound.play();
    this.classList.add('flipped');
    selectedCards.push(this);
    
    if (selectedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const isMatch = selectedCards[0].getElementsByClassName('image-top')[0].style.backgroundImage ===
                    selectedCards[1].getElementsByClassName('image-top')[0].style.backgroundImage;
    
    if (!isMatch) {
        setTimeout(() => {
            selectedCards.forEach(card => card.classList.remove('flipped'));
            selectedCards = [];
        }, 1000);
    } else {
        matchesFound++;
        selectedCards = [];
        if (matchesFound === cards.length / 2) {
            endGame(true);
        }
    }
}

function endGame(won) {
    clearInterval(activeInterval); // Detiene cualquier temporizador activo
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    if (won) {
        victorySound.play();
    } else {
        defeatSound.play();
    }

    showEndGamePopup(won);
}

function showEndGamePopup(won) {
    const modal = document.getElementById('endgame-modal');
    const message = document.getElementById('endgame-message');
    const playAgainButton = document.getElementById('play-again-button');

    message.textContent = won ? '¡Felicidades, has ganado!' : 'Perdiste, vuelve a intentarlo.';
    modal.style.display = "flex";

    playAgainButton.onclick = function() {
        modal.style.display = "none";
        restartGame(); // Reinicia el juego
    };
}

function restartGame() {
    selectedCards = [];
    matchesFound = 0;
    createBoard(); // Re-crea el tablero
    gameSequence(); // Reinicia la secuencia del juego
}

function gameSequence() {
    startCountdown(30, 'Tiempo restante: ', () => endGame(false));
}

function startCountdown(seconds, messagePrefix, callback) {
    let counter = seconds;
    displayStatus(`${messagePrefix} `, counter);
    clearInterval(activeInterval); // Limpiar cualquier intervalo previo
    activeInterval = setInterval(() => {
        counter--;
        displayStatus(`${messagePrefix} `, counter);
        if (counter <= 0) {
            clearInterval(activeInterval);
            callback();
        }
    }, 1000);
}

function displayStatus(message, countdown) {
    const statusElement = document.getElementById('game-status');
    if (statusElement) {
        statusElement.innerHTML = `${message} <span class="countdown-number">${countdown}</span> segundos`;
    } else {
        console.error("No se encontró el elemento 'game-status'.");
    }
}


//Call this function at the beginning to set up event listeners for the modal
function setupModal() {
    function closeModal() {
        const modal = document.getElementById('endgame-modal');
        modal.style.display = "none";
    }
    
}

window.onload = function() {
    createBoard();
    gameSequence();
    setupModal(); // Setup modal listeners
};

