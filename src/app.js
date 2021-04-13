import { Modal } from './components/modal.component.js';
import { Game } from './components/game.component.js';

// export const modal = new Modal();
// modal.initialize();
export const game = new Game();
const userInput = document.getElementById('user-input');

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

const navLinks = document.getElementById('nav-links');
navLinks.addEventListener('click', e => {
  const navModal = new Modal();
  navModal.initialize();
  navModal.showModals(e);
});

function handleInputFocus() {
  if (!game.gameActive) {
    game.gameActive = true;
    game.time = 10;

    game.initialize();
    game.initGameStartEnd();
    game.renderPrompt();
  }
}

document.addEventListener('scroll', toggleNavLogo);
userInput.addEventListener('focus', handleInputFocus);

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
