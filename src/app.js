const prompt = document.getElementById('prompt');
const currentPrompt = prompt.childNodes;
const userInput = document.getElementById('user-input');
const wordCountDisplay = document.getElementById('word-count');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

let wordCount = 0;
let time = 63;
let score = 0;
let difficulty = 'medium';

/**
 * scoring system based on scrabble letter scores (uppercase letters get ~1.5x)
 **/
const letterScores = {
  11: 'aeilnorstu',
  17: 'AEILNORSTU',
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
 * fetches lorem ipsum text from dummy json
 * TODO: fetch text from API
 **/
async function getPrompt() {
  try {
    const res = await fetch('src/dummy.json');
    const dummy = await res.json();
    console.log('SUCCESS', res);

    // TODO: generate random number 0 - 14 for string slice length 5 (string length is 20);
    // const sliceNum = Math.floor(Math.random() * 14);

    const fetchedPrompt = dummy[difficulty][Math.floor(Math.random() * 20)]
      .split(' ')
      .slice(0, 5); // sliced length to 5 for testing. final - 5/10/15/20?

    return fetchedPrompt;
  } catch (err) {
    console.log('ERROR', err);
  }
}

/**
 * renders prompt
 **/
async function renderPrompt() {
  const words = await getPrompt();

  words.forEach(word => {
    const promptTile = document.createElement('div');
    promptTile.classList.add('word-tile');
    promptTile.id = word;
    promptTile.innerText = word;
    prompt.append(promptTile);
  });
}

/**
 * timer function
 **/
function timer() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (time < 0) {   // move to clear game function? game over function?
    console.log('game over');
    // TODO: clearInterval?
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

  clearInterval(timer);
}

/**
 * TODO: use for letter highlighting / consider renaming function
 **/
function handleInput() {
  // split words to characters array?
}

/**
 * changes the word count display
 **/
function updateWordCountDisplay() {
  wordCount < 10
    ? (wordCountDisplay.innerText = `000${wordCount}`)
    : wordCount < 100
    ? (wordCountDisplay.innerText = `00${wordCount}`)
    : wordCount < 1000
    ? (wordCountDisplay.innerText = `0${wordCount}`)
    : (wordCountDisplay.innerText = `${wordCount}`);
}

/**
 * checks score for matched words and updates total score
 **/
function updateScore(currentWord) {
  const wordArray = currentWord.split('');

  wordArray.forEach(letter => {
    for (const letterScore in letterScores) {
      if (letterScores[letterScore].includes(letter)) score += +letterScore;
    }
  });

  updateScoreDisplay();
}

/**
 * changes score count display
 * TODO: combine with updateScore?
 **/
function updateScoreDisplay() {
  score < 10
    ? (scoreDisplay.innerText = `000${score}`)
    : score < 100
    ? (scoreDisplay.innerText = `00${score}`)
    : score < 1000
    ? (scoreDisplay.innerText = `0${score}`)
    : (scoreDisplay.innerText = `${score}`);
}

/**
 * checks for matching word / removes prompTile if word matches
 * invokes updateScore, updateWordCountDisplay, increment wordCount
 **/
function handleEnter(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    const currentWord = userInput.value.trim();

    currentPrompt.forEach(div => {
      if (div.innerText === currentWord) {
        updateScore(currentWord);
        div.remove();
        userInput.value = null;
        wordCount++;
        updateWordCountDisplay();
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
userInput.addEventListener('focus', handleFocus);
userInput.addEventListener('focusout', clearGame);

// const startStop = document.getElementById('start-stop');
// startStop.addEventListener('click', changePrompt);

/**
 * letter scores by frequency in english dictionary
 **/
// const letterScore = {
//   1: e,
//   2: t,
//   3: a,
//   4: o,
//   5: n,
//   6: i,
//   7: h,
//   8: s,
//   9: r,
//   10: l,
//   11: d,
//   12: u,
//   13: c,
//   14: m,
//   15: w,
//   16: y,
//   17: f,
//   18: g,
//   19: p,
//   20: b,
//   21: v,
//   22: k,
//   23: j,
//   24: x,
//   25: q,
//   26: z,
// };