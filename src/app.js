function toggleNavLogo() {
  const navLogoImg = document.getElementById('nav-logo-img');
  const navLogoText = document.getElementById('nav-logo-text');

  if (window.scrollY > 115) {
    navLogoImg.style.display = 'block';
    navLogoText.style.display = 'none';
  } else {
    navLogoImg.style.display = 'none';
    navLogoText.style.display = 'block';
  }
}

document.addEventListener('scroll', toggleNavLogo);

class Game {
  constructor() {
    this.prompt = null;
    this.currentPrompt = null;
    this.userInput = null;
    this.wordCountDisplay = null;
    this.timerDisplay = null;
    this.scoreDisplay = null;
    this.optionsButtons = null;

    this.gameMode = null;
    this.difficulty = null;
    this.time = null;
    this.highScore = null;
    this.wordCount = 0;
    this.score = 0;
    this.gameActive = false;
    this.currentWordArray = [];
  }

  initialize() {
    this.prompt = document.getElementById('prompt');
    this.currentPrompt = this.prompt.childNodes;
    this.userInput = document.getElementById('user-input');
    this.wordCountDisplay = document.getElementById('word-count');
    this.timerDisplay = document.getElementById('timer');
    this.scoreDisplay = document.getElementById('score');
    this.optionsButtons = document.querySelectorAll('.options-button');

    // TODO: turn handle functions into arrow functions to avoid binding
    this.userInput.addEventListener('focus', this.handleInputFocus.bind(this));
    this.userInput.addEventListener('input', this.handleInput.bind(this));
    this.userInput.addEventListener('keydown', this.handleEnter.bind(this));
  }

  getGameOptions() {
    this.optionsButtons.forEach(button => {
      if (button.classList.contains('selected')) {
        if (button.parentElement.id === 'game-mode-container')
          this.gameMode = button.id;
        if (button.parentElement.id === 'difficulty-container')
          this.difficulty = button.id;
        if (button.parentElement.id === 'time-container') this.time = button.id;
      }
    });
  }

  newGame() {
    this.getGameOptions();
    this.wordCount = 0;
    this.wordCountDisplay.innerText = '0000';
    this.score = 0;
    this.scoreDisplay.innerText = '0000';
  }

  async getPrompt() {
    try {
      const res = await fetch('https://type.fit/api/quotes');
      const json = await res.json();
      console.log('SUCESS', res);

      const fetchedPrompt = json[
        Math.floor(Math.random() * json.length)
      ].text.split(' ');
      return fetchedPrompt.slice(0, 30);
    } catch (err) {
      console.log('ERROR', err);
    }
  }

  async renderPrompt() {
    const words = await this.getPrompt();

    if (this.currentPrompt.length) {
      this.prompt.innerHTML = '';
    }

    words.forEach(word => {
      const promptTile = document.createElement('div');
      promptTile.classList.add('prompt-tile');
      promptTile.id = word;
      this.prompt.append(promptTile);

      word.split('').forEach(letter => {
        const letterSpan = document.createElement('span');
        letterSpan.innerText = letter;
        promptTile.append(letterSpan);
      });
    });
  }

  clearPromptHighlights() {
    this.currentPrompt.forEach(promptTile => {
      promptTile.childNodes.forEach(letterSpan => {
        if (letterSpan.hasAttribute('class')) {
          letterSpan.removeAttribute('class');
        }
      });
    });
  }

  updateWordCount() {
    this.wordCount++;

    this.wordCount < 10
      ? (this.wordCountDisplay.innerText = `000${this.wordCount}`)
      : this.wordCount < 100
      ? (this.wordCountDisplay.innerText = `00${this.wordCount}`)
      : this.wordCount < 1000
      ? (this.wordCountDisplay.innerText = `0${this.wordCount}`)
      : (this.wordCountDisplay.innerText = `${this.wordCount}`);
  }

  updateTimer() {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;

    if (this.time >= 0 && this.gameActive) {
      minutes < 10 && seconds < 10
        ? (this.timerDisplay.innerText = `0${minutes}:0${seconds}`)
        : minutes < 10 && seconds >= 10
        ? (this.timerDisplay.innerText = `0${minutes}:${seconds}`)
        : (this.timerDisplay.innerText = `${minutes}:${seconds}`);

      this.time--;
    } else {
      this.initGameStartEnd();
    }
  }

  /**
   * scoring system based on scrabble (uppercase letters get ~1.5x)
   **/
  updateScore() {
    const letterScores = {
      11: "aeilnorstu'.,-;",
      17: 'AEILNORSTU?":',
      22: 'dg',
      33: 'DG',
      33: 'bcmp',
      59: 'BCMP',
      44: 'fhvwy',
      66: 'FHVWY',
      55: 'k',
      82: 'K',
      88: 'jx',
      132: 'JX',
      100: 'qz',
      150: 'QZ',
    };

    this.currentWordArray.forEach(letter => {
      for (const letterScore in letterScores) {
        if (letterScores[letterScore].includes(letter))
          this.score += +letterScore;
      }
    });

    this.score < 10
      ? (this.scoreDisplay.innerText = `000${this.score}`)
      : this.score < 100
      ? (this.scoreDisplay.innerText = `00${this.score}`)
      : this.score < 1000
      ? (this.scoreDisplay.innerText = `0${this.score}`)
      : (this.scoreDisplay.innerText = `${this.score}`);
  }

  updateHighScore() {
    if (this.score > this.highScore) this.highScore = this.score;
  }

  /**
   * highlight prompt letters matching user input
   **/
  handleInput(e) {
    if (e.data && this.gameActive) {
      this.currentWordArray.push(e.data);

      this.currentPrompt.forEach(promptTile => {
        const currentWord = this.currentWordArray.join('').trim();
        const promptWordSlice = promptTile.id.slice(0, currentWord.length);
        const letterSpans = promptTile.childNodes;

        if (promptWordSlice === currentWord) {
          for (let i = 0; i < currentWord.length; ++i) {
            letterSpans[i].classList.add('letter-match');
          }
        }
      });
    } else {
      const deletedLetter = this.currentWordArray.pop();

      this.currentPrompt.forEach(promptTile => {
        const wordSpanArray = Array.from(promptTile.childNodes);

        for (let i = wordSpanArray.length - 1; i >= 0; --i) {
          if (wordSpanArray[i].innerText === deletedLetter) {
            if (wordSpanArray[i].hasAttribute('class')) {
              wordSpanArray[i].removeAttribute('class');
              break;
            }
          }
        }
      });
    }
  }

  /**
   * check for matching word / remove prompTile if word matches,
   **/
  handleEnter(e) {
    if ((e.key === 'Enter' || e.key === ' ') && this.gameActive) {
      this.currentPrompt.forEach(promptTile => {
        if (promptTile.id === this.currentWordArray.join('').trim()) {
          this.updateScore();
          this.updateHighScore();
          this.updateWordCount();
          this.clearPromptHighlights();
          promptTile.remove();
          this.userInput.value = null;
          this.currentWordArray.splice(0, this.currentWordArray.length);
        }
      });
      // if prompt is empty, render new prompt
      if (!this.currentPrompt.length) this.renderPrompt();
    }
  }

  /**
   * if game is not active, initiate game start and render prompt
   **/
  handleInputFocus() {
    if (!this.gameActive) {
      this.gameActive = true;
      this.newGame();
      this.initGameStartEnd();
      this.renderPrompt();
    }
  }

  /**
   * start/clear timer interval
   **/
  initGameStartEnd() {
    const timerActive = setInterval(() => {
      if (this.time < 0) {
        this.gameActive = false;
        clearInterval(timerActive);
        modal.gameOver();
        prompt.innerHTML = '';
      } else this.updateTimer();
    }, 1000);
  }
}

class Results {
  constructor(currentGame) {
    this.wordCountResults = null;
    this.scoreResults = null;
    this.highScoreResults = null;

    this.wordCount = currentGame.wordCount;
    this.score = currentGame.score;
    this.highScore = currentGame.highScore;
  }

  initialize() {
    this.wordCountResults = document.getElementById('word-count-results');
    this.scoreResults = document.getElementById('score-results');
    this.highScoreResults = document.getElementById('high-score');
  }

  displayResults() {
    this.wordCountResults.innerText = this.wordCount;
    this.scoreResults.innerText = this.score;
    this.highScoreResults.innerText = this.highScore;
  }
}

class Modal {
  constructor() {
    this.navLinks = null;
    this.gameModeModal = null;
    this.optionsModal = null;
    this.timeContainer = null;
    this.modals = null;
  }

  initialize() {
    this.navLinks = document.getElementById('nav-links');
    this.gameModeModal = document.getElementById('game-mode-modal');
    this.optionsModal = document.getElementById('options-modal');
    this.modals = document.querySelectorAll('.modal');

    this.navLinks.addEventListener('click', this.showModals.bind(this));
    this.gameModeModal.addEventListener(
      'click',
      this.highlightButtons.bind(this)
    );
    this.optionsModal.addEventListener(
      'click',
      this.highlightButtons.bind(this)
    );
    window.addEventListener('click', this.hideModals.bind(this));
  }

  showModals(e) {
    e.preventDefault();

    if (e.target.id === 'game-mode-link') {
      this.gameModeModal.style.display = 'block';
    }

    if (e.target.id === 'options-link') {
      this.optionsModal.style.display = 'block';
    }
  }

  highlightButtons(e) {
    const parent = e.target.parentElement.childNodes;

    if (e.target.tagName === 'BUTTON') {
      parent.forEach(child => {
        if (
          child.tagName === 'BUTTON' &&
          child.classList.contains('selected')
        ) {
          child.classList.remove('selected');
        }
      });

      e.target.classList.add('selected');
    }

    if (
      e.target.id === 'normal' ||
      e.target.id === 'challenge' ||
      e.target.id === 'accuracy'
    ) {
      const gameModeHeader = document.getElementById('game-mode-header');
      gameModeHeader.innerText = `${e.target.id.toUpperCase()} MODE`;
    }
  }

  gameOver() {
    const modalGameOver = document.getElementById('game-over-modal');
    modalGameOver.style.display = 'block';

    const result = new Results(game);
    result.initialize();
    result.displayResults();
  }

  hideModals(e) {
    if (e.target.classList.contains('modal')) {
      this.modals.forEach(modal => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }

    if (e.target.id === 'nav-button') {
      game.time = 0;
      game.prompt.innerHTML = '';
    }
  }
}

const game = new Game();
game.initialize();

const modal = new Modal();
modal.initialize();

/**
 * toggle footer on hover
 **/
const navFooter = document.getElementById('nav-footer');

function toggleFooter(e) {
  if (e.type === 'mouseenter') {
    navFooter.style.opacity = 1;
  } else {
    setTimeout(() => (navFooter.style.opacity = 0), 1000);
  }
}

navFooter.addEventListener('mouseenter', toggleFooter);
navFooter.addEventListener('mouseleave', toggleFooter);
