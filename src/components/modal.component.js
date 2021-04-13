import { currentGame } from '../app.js';
// import { Game } from './game.component.js';
// import { Result } from './result.component.js';

/**
 ***** Modals ********************************************************************************
 **/
export class Modal {
  constructor() {
    // dom selectors
    this.optionsModal = null;
    this.newGameModal = null;
    this.gameOverModal = null;
    this.playAgainButton = null;
    this.modals = null;

    // modal properties
    this.difficulty = null;
  }

  initialize() {
    // initialize dom selectors
    this.optionsModal = document.getElementById('options-modal');
    this.newGameModal = document.getElementById('new-game-modal');
    this.gameOverModal = document.getElementById('game-over-modal');
    this.playAgainButton = document.getElementById('play-again-button');
    this.modals = document.querySelectorAll('.modal');

    // event listeners
    this.playAgainButton.addEventListener('click', this.playAgain.bind(this));
    window.addEventListener('click', this.hideModals.bind(this));
  }

  /**
   * toggle modals
   **/
  toggleModals(e) {
    if (e.target.id === 'options-link') {
      this.optionsModal.style.display = 'block';
    }

    if (e.target.id === 'new-game-button') {
      this.newGameModal.style.display = 'block';
    }
  }

  /**
   * difficulty selection
   **/
  selectOptions(e) {
    if (e.target.value === 'on') {
      // this.clearOptionsButtons();
      e.target.nextElementSibling.classList.add('selected');
      e.target.previousElementSibling.classList.add('selected');
    }
  }

  /**
   * play again
   **/
  playAgain() {
    currentGame.active = false;
  }

  /**
   * hide modals
   **/
  hideModals(e) {
    if (e.target.id === 'new-game-yes' || e.target.id === 'new-game-no') {
      this.newGameModal.style.display = 'none';
    }

    if (e.target.id === 'play-again-button') {
      this.gameOverModal.style.display = 'none';
      this.playAgain();
    }

    this.modals.forEach(modal => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
}

/**
 *********************************************************************************************
 **/
