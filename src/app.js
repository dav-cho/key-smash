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
 ***** Gameplay ******************************************************************************
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

    // game stat properties
    this.wordCount = 0;
    this.time = null;
    this.score = 0;
    this.highScore = null;
    this.difficulty = 'easy';
    this.gameActive = false;
    this.currentWordArray = [];
  }

  initialize() {
    // initialize dom selectors
    this.prompt = document.getElementById('prompt');
    this.currentPrompt = this.prompt.childNodes;
    this.userInput = document.getElementById('user-input');
    this.wordCountDisplay = document.getElementById('word-count');
    this.timerDisplay = document.getElementById('timer');
    this.scoreDisplay = document.getElementById('score');

    /**
     * event listeners
     **/
    this.userInput.addEventListener('focus', this.handleInputFocus.bind(this));
    this.userInput.addEventListener('input', this.handleInput.bind(this));
    this.userInput.addEventListener('keydown', this.handleEnter.bind(this));
  }

  /**
   * fetch quotes from inspirational quotes API
   **/
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

  /**
   * render prompt
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
   * clear prompt letter highlights on word match
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
   * change word count display
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
   * timer function (setInterval in initGameStartEnd)
   **/
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
   * check for matched words and update score
   **/
  updateScore() {
    /**
     * scoring system based on scrabble letter scores (uppercase letters get ~1.5x)
     **/
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

  /**
   * check current score after word match
   **/
  updateHighScore() {
    if (this.score > this.highScore) this.highScore = this.score;
  }

  /**
   * highlight prompt letters matching user input
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
   * check for matching word / remove prompTile if word matches,
   * updateWordCount, clearPromptHighlights, userInput to null, clear currentWordArray
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
      this.time = 5;
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
        clearInterval(timerActive);
        gameOver();
        this.gameActive = false;
      } else this.updateTimer();
    }, 1000);
  }
}

class Results {
  constructor(currentGame) {
    // dom selectors
    this.wordCountResults = null;
    this.scoreResults = null;
    this.highScoreResults = null;

    // result stats properties
    this.wordCount = currentGame.wordCount;
    this.score = currentGame.score;
    this.highScore = currentGame.highScore;
  }

  initialize() {
    // initialize dom selectors
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

const game = new Game();
game.initialize();

/**
 * gameOver: stops timer, toggles results modal and gameActive to false
 **/
function gameOver() {
  const modalGameOver = document.getElementById('game-over');
  modalGameOver.style.display = 'block';

  const result = new Results(game);
  result.initialize();
  result.displayResults();
}

/**
 ***** Modals ********************************************************************************
 **/
class Modal {
  constructor() {}
}

/**
 * options modal
 **/
const navLinks = document.getElementById('nav-links');

function toggleOptions(e) {
  e.preventDefault();
  // const optionsLink = document.getElementById('options-link');
  const modalOptions = document.getElementById('options');
  console.log('~ e.target', e.target.id);

  if (e.target.id === 'options-link') {
    modalOptions.style.display = 'block';
  }
}

navLinks.addEventListener('click', toggleOptions);

/**
 * modal toggle
 **/
function toggleModal(e) {
  const modals = document.querySelectorAll('.modal');

  modals.forEach(modal => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

window.addEventListener('click', toggleModal);

/**
 *********************************************************************************************
 **/

/**
 * TODO: handleInputFocusOut
 **/
function handleInputFocusOut() {
  // stops timer when input loses focus
}

// userInput.addEventListener('focusout', handleInputFocusOut);
