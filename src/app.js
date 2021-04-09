const prompt = document.getElementById('prompt');
const currentPrompt = prompt.childNodes;
const userInput = document.getElementById('user-input');
const wordCount = document.getElementById('word-count');
const timerDisplay = document.getElementById('timer');
// const mistakesDisplay = document.getElementById('mistakes');

let time = 63;
let difficulty = 'easy';

/**
* fetch lorem ipsum text from dummy json
* TODO: fetch text from API
**/
async function getLorem() {
  try {
    const res = await fetch('src/dummy.json');
    const dummy = await res.json();
    console.log('SUCCESS', res);
    
    return dummy[difficulty][Math.floor(Math.random() * 20)]
    .split(' ')
    .slice(0, 5); // sliced length to 5 for testing
  } catch (err) {
    console.log('ERROR', err);
  }
}

/** 
* render prompt
**/
async function renderPrompt() {
  const words = await getLorem();
  
  words.forEach(word => {
    const wordTile = document.createElement('div');
    wordTile.classList.add('word-tile');
    wordTile.id = word;
    wordTile.innerText = word;
    prompt.append(wordTile);
  });
}

/**
* timer function
**/
function timer() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (time < 0) {
    console.log('game over');
    return;
  }

  minutes < 10 && seconds < 10
    ? (timerDisplay.innerText = `0${minutes}:0${seconds}`)
    : minutes < 10 && seconds >= 10
    ? (timerDisplay.innerText = `0${minutes}:${seconds}`)
    : (timerDisplay.innerText = `${minutes}:${seconds}`);

  time--;
}

/**
* starts timer and renders prompt text when text input is focused
**/
function handleFocus() {
  if (!currentPrompt.length) renderPrompt();

  setInterval(timer, 1000);
}

/**
* TODO: clears text prompt and stops timer when text input loses focus 
**/
function clearGame(e) {
console.log('~ e', e)

  clearInterval(timer)
}

/**
* TODO: use for letter highlighting
**/
function handleInput() {
}

/**
* handle enter or space keydown event
**/
function handleEnter(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    // check for matching word
    currentPrompt.forEach(div => {
      if (div.innerText === userInput.value.trim()) {
        div.remove();
        userInput.value = null;
      }
    });
    // if prompt is empty, render new prompt
    if (!currentPrompt.length) renderPrompt();
  }
}

/**
* event listeners
**/
userInput.addEventListener('keydown', handleEnter);
userInput.addEventListener('input', handleInput);
// userInput.addEventListener('focus', handleFocus);
userInput.addEventListener('focusout', clearGame);

// const startStop = document.getElementById('start-stop');
// startStop.addEventListener('click', changePrompt);