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
  
  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }
  
  function createBoard() {
  shuffleArray(cards);
  const gameBoard = document.getElementById('Mis-trabajos').querySelector('.row');
  gameBoard.innerHTML = ''; // Limpiar el tablero antes de crearlo
  for (let i = 0; i < cards.length; i++) {
      const cardElement = document.createElement('div');
      cardElement.classList.add('col-4', 'col-sm-4',);
      
      const card = document.createElement('div');
      card.classList.add('card');
      
      const imageTop = document.createElement('div');
      imageTop.classList.add('image-top');
      imageTop.style.backgroundImage = `url(${cards[i]})`;
  
      const cardBack = document.createElement('div');
      cardBack.classList.add('card-back');
  
      card.appendChild(imageTop);
      card.appendChild(cardBack);
      cardElement.appendChild(card);
      gameBoard.appendChild(cardElement);
  
      card.addEventListener('click', flipCard);
  }
  }
  
  function flipCard() {
      if (selectedCards.length === 2 || this.classList.contains('flipped')) {
          // Evita más interacciones si ya hay dos cartas seleccionadas o si la carta ya está volteada
          return;
      }
  
      this.classList.add('flipped'); // Voltea la carta al hacer clic
      selectedCards.push(this);
  
      if (selectedCards.length === 2) {
          checkForMatch();
      }
  }
  
  
  
  function checkForMatch() {
      if (selectedCards.length < 2) {
          return; // Asegura que hay dos cartas seleccionadas para comparar
      }
  
      const isMatch = selectedCards[0].getElementsByClassName('image-top')[0].style.backgroundImage === selectedCards[1].getElementsByClassName('image-top')[0].style.backgroundImage;
  
      if (!isMatch) {
          // Si no es un par, vuelve a ocultar las cartas después de un breve retraso
          setTimeout(() => {
              selectedCards.forEach(card => card.classList.remove('flipped'));
              selectedCards = []; // Restablece el arreglo de cartas seleccionadas
          }, 1000);
      } else {
          matchesFound++;
          selectedCards = []; // Restablece el arreglo de cartas seleccionadas para el próximo turno
          if (matchesFound === cards.length / 2) {
              alert('¡Juego completado!');
          }
      }
  }
  
  function restartGame() {
      selectedCards = [];
      matchesFound = 0;
      createBoard(); // Vuelve a crear el tablero de juego
      // Opcional: Oculta el mensaje de victoria si lo estás utilizando
      document.getElementById('win-message').style.display = 'none';
  }
  document.getElementById('restart-button').addEventListener('click', restartGame);
  
  window.onload = createBoard;