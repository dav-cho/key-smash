/**
 * toggle nav logo on scroll
 **/
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

/**
 * scoring system based on scrabble letter scores (uppercase letters get ~1.5x)
 **/
const letterScores = {
  11: "aeilnorstu'.,;",
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

/**
 * class for each round/game played
 **/
class Game {
  constructor() {
    // dom selectors
    this.prompt = null;
    this.currentPrompt = null;
    this.userInput = null;
    this.wordCountDisplay = null;
    this.timerDisplay = null;
    this.scoreDisplay = null;

    // game stat variables
    this.wordCount = 0;
    this.time = null;
    this.score = 0;
    this.difficulty = 'easy';
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

    /**
     * starts timer and sets gameStatus to true;
     **/
    // function initGame() {
    //   gameActive = true;
    //   time = 3;

    //   const timerActive = setInterval(() => {
    //     if (time < 0) {
    //       clearInterval(timerActive);
    //       gameOver();
    //     } else updateTimer();
    //   }, 1000);
    // }

    this.userInput.addEventListener('input', this.handleInput.bind(this));
    this.userInput.addEventListener('keydown', this.handleEnter.bind(this));
    // userInput.addEventListener('focus', handleInputFocus);
    // userInput.addEventListener('focusout', handleInputFocusOut);
  }

  /**
   * fetches quote from inspirational quotes API
   **/
  async getPrompt() {
    try {
      console.log('~ this', this);
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

  /**
   * renders prompt
   **/
  async renderPrompt() {
    const words = await this.getPrompt();

    // clear prompt tiles if there are any there
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

  /**
   * clears prompt letter highlights on word match
   **/
  clearPromptHighlights() {
    this.currentPrompt.forEach(promptTile => {
      promptTile.childNodes.forEach(letterSpan => {
        if (letterSpan.hasAttribute('class')) {
          letterSpan.removeAttribute('class');
        }
      });
    });
  }

  /**
   * changes the word count display
   **/
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

  /**
   * checks score for matched words and updates total score
   **/
  updateScore() {
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

  /**
   * timer function
   **/
  updateTimer() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (this.time >= 0 && this.gameActive) {
      minutes < 10 && seconds < 10
        ? (this.timerDisplay.innerText = `0${minutes}:0${seconds}`)
        : minutes < 10 && seconds >= 10
        ? (this.timerDisplay.innerText = `0${minutes}:${seconds}`)
        : (this.timerDisplay.innerText = `${minutes}:${seconds}`);

      this.time--;
    } else {
      console.log('~ time out');
      // initGame();
    }
  }

  /**
   * if currentPrompt is empty and time > 0
   * initiates game start and renders prompt on text input focus
   **/
  handleInputFocus() {
    if (!this.gameActive) {
      console.log(this);
    }
    // if (!gameActive) {
    //   renderPrompt();
    //   initGame();
    // }
  }

  /**
   * highlights prompt letters matching user input
   * TODO: fix delte glitches
   **/
  handleInput(e) {
    if (e.data) {
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
   * checks for matching word / removes prompTile if word matches,
   * updates game stats and clears highlights
   **/
  handleEnter(e) {
    // if ((e.key === 'Enter' || e.key === ' ') && gameActive) {
    if (e.key === 'Enter' || e.key === ' ') {
      this.currentPrompt.forEach(promptTile => {
        if (promptTile.id === this.currentWordArray.join('').trim()) {
          this.updateScore();
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
}

const game = new Game();
game.initialize();
// console.log('~ game', game);
game.renderPrompt();
// console.log('~ game currentPrompt', game.currentPrompt);
/**
 *********************************************************************************************
 **/

/**
 * starts timer and sets gameStatus to true;
 **/
function initGame() {
  gameActive = true;
  time = 3;

  const timerActive = setInterval(() => {
    if (time < 0) {
      clearInterval(timerActive);
      gameOver();
    } else updateTimer();
  }, 1000);
}

/**
 * TODO: handleInputFocusOut
 **/
function handleInputFocusOut() {
  // stops timer when input loses focus
}

/**
 * gameOver: stops timer, toggles results modal and gameActive to false
 **/
function gameOver(e) {
  const modalGameOver = document.getElementById('game-over');

  modalGameOver.style.display = 'block';
  gameActive = false;
  console.log('~ game over');
}

/**
 * modal toggle
 **/

function toggleModal(e) {
  const modals = document.querySelectorAll('.modal');

  modals.forEach(modal => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

// window.addEventListener('click', toggleModal);
// userInput.addEventListener('focus', handleInputFocus);
// userInput.addEventListener('focusout', handleInputFocusOut);
// userInput.addEventListener('input', handleInput);
// userInput.addEventListener('keydown', handleEnter);
