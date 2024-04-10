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
let gameTimeout;
let memorizeTimeout;

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

function startCountdown(seconds, messagePrefix, callback) {
    let counter = seconds;
    displayStatus(`${messagePrefix} `, counter);
    const interval = setInterval(() => {
        counter--;
        displayStatus(`${messagePrefix} `, counter);
        if (counter <= 0) {
            clearInterval(interval);
            callback();
        }
    }, 1000);
}



function gameSequence() {
    startCountdown(5, 'El juego comenzará en', function() {
        flipAllCards(true);
        startCountdown(10, 'Tiempo para memorizar', function() {
            flipAllCards(false);
            startCountdown(20, 'Tiempo para jugar', function() {
                endGame(false);
            });
        });
    });
}



function flipAllCards(show) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.toggle('flipped', show);
    });
}

function displayStatus(message, countdown) {
    const statusElement = document.getElementById('game-status');
    if (statusElement) {
        // Si countdown es un número, se mostrará el mensaje con el número resaltado.
        if (typeof countdown === 'number') {
            statusElement.innerHTML = `${message} <span class="countdown-number">${countdown}</span> segundos`;
        } else {
            statusElement.textContent = message;
        }
    } else {
        console.error("No se encontró el elemento 'game-status'.");
    }
}

function endGame(won) {
    clearTimeout(gameTimeout);
    clearTimeout(memorizeTimeout);
    const message = won ? '¡Felicidades, has ganado!' : 'Perdiste, vuelve a intentarlo.';
    displayStatus(message);
    showEndGamePopup(won);
}

function showEndGamePopup(won) {
    const modal = document.getElementById('endgame-modal');
    const message = document.getElementById('endgame-message');
    const playAgainButton = document.getElementById('play-again-button');

    message.textContent = won ? '¡Felicidades, has ganado!' : 'Perdiste, vuelve a intentarlo.';
    modal.style.display = "flex";

    playAgainButton.onclick = function() {
        window.location.href = 'index.html'; // Redirecciona al usuario a index.html
    };
}



function restartGame() {
    selectedCards = [];
    matchesFound = 0;
    createBoard();
    gameSequence();
}

//Call this function at the beginning to set up event listeners for the modal
function setupModal() {
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        const modal = document.getElementById('endgame-modal');
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

window.onload = function() {
    createBoard();
    gameSequence();
    setupModal(); // Setup modal listeners
};

