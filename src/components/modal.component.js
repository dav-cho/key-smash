// import { modal, game } from '../app.js';

/**
 ***** Modals ********************************************************************************
 **/
export class Modal {
  constructor() {
    // dom selectors
    this.navLinks = null;
    this.optionsModal = null;
    this.optionsContainers = null;
    this.timeContainer = null;
    this.modals = null;

    // modal properties
    this.difficulty = null;
    this.time = null;
  }

  initialize() {
    // initialize dom selectors
    // this.navLinks = document.getElementById('nav-links');
    this.optionsModal = document.getElementById('options');
    this.optionsContainers = document.querySelectorAll('.options-container');
    this.modals = document.querySelectorAll('.modal');

    // event listeners
    // this.navLinks.addEventListener('click', this.showModals.bind(this));
    this.optionsModal.addEventListener('click', this.selectOptions);
    window.addEventListener('click', this.hideModals.bind(this));
  }


/**
 * show modals on click
 **/
  showModals(e) {
    e.preventDefault();

    if (e.target.id === 'options-link') {
      this.optionsModal.style.display = 'block';
    }
  }

  /**
   * difficulty selection
   **/
  selectOptions(e) {
    if (e.target.value === 'on') {
      console.log('~ e', e);
      // console.log('~ e.target', e.target);
      // this.clearOptionsButtons();
      e.target.nextElementSibling.classList.add('selected');
      e.target.previousElementSibling.classList.add('selected');
    }

    // if (e.target.value === 'on') {
    //   this.difficulty = e.target.id;
    //   Game.difficulty = e.target.id;
    //   game.difficulty = e.target.id;
    //   console.log('~ Game.difficulty', Game.difficulty);
    //   console.log('~ game difficulty', game.difficulty);
    //   console.log('~ modal difficulty', modal.difficulty);

    // const selected = document.querySelector('.selected');
    // selectedDifficulty.classList.remove('selected-difficulty');
    //   e.target.nextElementSibling.classList.add('selected');
    // }
  }

  /**
   * clear options buttons
   **/
  clearOptionsButtons() {
    this.optionsContainers.forEach(container => {
      console.log('~ container', container);
    });
  }

  /**
   * gameOver: stops timer, toggles results modal and gameActive to false
   * TODO: move to Game class?
   **/
  gameOver() {
    const modalGameOver = document.getElementById('game-over');
    modalGameOver.style.display = 'block';

    const result = new Results(game);
    result.initialize();
    result.displayResults();
  }

  /**
   * hide modals
   **/
  hideModals(e) {
    this.modals.forEach(modal => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
}

/**
 ***** Results *******************************************************************************
 **/
class Results {
  constructor(currentGame) {
    // dom selectors
    this.wordCountResults = null;
    this.scoreResults = null;
    this.highScoreResults = null;

    // result properties
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
