import { Game } from './components/game.component.js';
import { Modal } from './components/modal.component.js';
// import { Modal } from './components/modal.component.js';
// import { Result } from './components/result.component.js';

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
 * toggle nav link modals
 **/

function openNavLinkModals(e) {
  console.log('~ e', e.target);
  e.preventDefault();

  const navModal = new Modal();
  navModal.initialize();
  navModal.toggleModals(e);
}

document.addEventListener('click', openNavLinkModals);

/**
 *********************************************************************************************
 **/

// export let currentModal = new Modal();
// currentModal.initialize();

export let currentGame = new Game();
currentGame.initialize();

// export let currentResult = new Result();
// currentResult.initialize();
