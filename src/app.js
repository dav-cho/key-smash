const prompt = document.getElementById('prompt');
const currentPrompt = prompt.childNodes;
const userInput = document.getElementById('user-input');
const wordCountDisplay = document.getElementById('word-count');
const timerDisplay = document.getElementById('timer');
// const mistakesDisplay = document.getElementById('mistakes');

let wordCount = 0;
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
  console.log('~ e', e);

  clearInterval(timer);
}

/**
 * TODO: use for letter highlighting
 **/
function handleInput() {}

/**
 * check for matching word on enter or space keydown event
 **/
function handleEnter(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    currentPrompt.forEach(div => {
      if (div.innerText === userInput.value.trim()) {
        div.remove();
        userInput.value = null;
        wordCount++;
        renderWordCount();
      }
    });
    // if prompt is empty, render new prompt
    if (!currentPrompt.length) renderPrompt();
  }
}

/**
 * word count display function
 **/
function renderWordCount() {
  wordCount < 10
    ? (wordCountDisplay.innerText = `00${wordCount}`)
    : wordCount < 100
    ? (wordCountDisplay.innerText = `0${wordCount}`)
    : (wordCountDisplay.innerText = `${wordCount}`);
}

/**
 * event listeners
 **/
userInput.addEventListener('keydown', handleEnter);
userInput.addEventListener('input', handleInput);
userInput.addEventListener('focus', handleFocus);
userInput.addEventListener('focusout', clearGame);

// const startStop = document.getElementById('start-stop');
// startStop.addEventListener('click', changePrompt);

/**
 * Scrabble letter scores for scoring points
 **/
const a = 1;
const e = 1;
const i = 1;
const l = 1;
const n = 1;
const o = 1;
const r = 1;
const s = 1;
const t = 1;
const u = 1;
const d = 2;
const g = 2;
const b = 3;
const c = 3;
const m = 3;
const p = 3;
const f = 4;
const h = 4;
const v = 4;
const w = 4;
const y = 4;
const k = 5;
const j = 8;
const x = 8;
const q = 10;
const z = 10;

/**
 * letter scores by frequency in english dictionary
 **/
// const e = 1;
// const t = 2;
// const a = 3;
// const o = 4;
// const n = 5;
// const i = 6;
// const h = 7;
// const s = 8;
// const r = 9;
// const l = 10;
// const d = 11;
// const u = 12;
// const c = 13;
// const m = 14;
// const w = 15;
// const y = 16;
// const f = 17;
// const g = 18;
// const p = 19;
// const b = 20;
// const v = 21;
// const k = 22;
// const j = 23;
// const x = 24;
// const q = 25;
// const z = 26;
