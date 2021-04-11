const prompt = document.getElementById('prompt');
const currentPrompt = prompt.childNodes;
const userInput = document.getElementById('user-input');
const wordCountDisplay = document.getElementById('word-count');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

let wordCount = 0;
let time = 65;
let score = 0;
let difficulty = 'medium';
const currentWordArray = [];

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
    promptTile.classList.add('prompt-tile');
    promptTile.id = word;
    prompt.append(promptTile);

    word.split('').forEach(letter => {
      const letterSpan = document.createElement('span');
      letterSpan.innerText = letter;
      promptTile.append(letterSpan);
    });
  });
}

/**
 * changes the word count display
 **/
function updateWordCount() {
  wordCount++;

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
function updateScore() {
  currentWordArray.forEach(letter => {
    for (const letterScore in letterScores) {
      if (letterScores[letterScore].includes(letter)) score += +letterScore;
    }
  });

  score < 10
    ? (scoreDisplay.innerText = `000${score}`)
    : score < 100
    ? (scoreDisplay.innerText = `00${score}`)
    : score < 1000
    ? (scoreDisplay.innerText = `0${score}`)
    : (scoreDisplay.innerText = `${score}`);
}

/**
 * timer function
 **/

function updateTimer() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (time >= 0) {
    minutes < 10 && seconds < 10
      ? (timerDisplay.innerText = `0${minutes}:0${seconds}`)
      : minutes < 10 && seconds >= 10
      ? (timerDisplay.innerText = `0${minutes}:${seconds}`)
      : (timerDisplay.innerText = `${minutes}:${seconds}`);

    time--;
  }
}

/**
 * gameStatus
 **/
function gameStatus() {
  // const initTimer = setInterval(updateTimer, 1000);
  // if (time >= 0) initTimer;

  if (time >= 0) setInterval(updateTimer, 1000);
  // clearInterval(initTimer);
}

/**
 * if currentPrompt is empty and time > 0
 * starts timer and renders prompt on text input focus
 **/
function handleInputFocus() {
  if (!currentPrompt.length && time >= 0) {
    renderPrompt();
    gameStatus();
  }
}

/**
 * TODO: handleInputFocusOut
 **/
function handleInputFocusOut() {
  // stops timer when input loses focus
}

/**
 * TODO: use for letter highlighting / consider renaming function
 **/
function handleInput(e) {
  if (e.data) {
    currentWordArray.push(e.data);
    // if word array has white space in the front, clear array
    if (currentWordArray.join('') === ' ') {
      currentWordArray.splice(0, currentWordArray.length);
    }

    currentPrompt.forEach(wordSpan => {
      const currentWord = currentWordArray.join('').trim();
      const letterSpans = wordSpan.childNodes;
      const promptWordSlice = wordSpan.id.slice(0, currentWordArray.length);

      if (promptWordSlice === currentWord) {
        for (let i = 0; i < currentWord.length; ++i) {
          letterSpans[i].classList.add('letter-match');
        }
      }
    });
  } else {
    const deletedLetter = currentWordArray.pop();
    console.log('~ deletedLetter', deletedLetter);
    console.log('~ currentWordArray', currentWordArray);

    currentPrompt.forEach(wordSpan => {
      const wordSpanArray = Array.from(wordSpan.childNodes);

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
 * checks for matching word / removes prompTile if word matches
 * invokes updateScore, updateWordCountDisplay, increment wordCount
 **/
function handleEnter(e) {
  if ((e.key === 'Enter' || e.key === ' ') && time >= 0) {
    currentPrompt.forEach(wordSpan => {
      if (wordSpan.id === currentWordArray.join('')) {
        updateScore();
        updateWordCount();
        wordSpan.remove();
        userInput.value = null;
        currentWordArray.splice(0, currentWordArray.length);
        
        // TODO: clear highlighted letter
        // wordSpan.forEach(letterSpan => {
        //   if (letterSpan.hasAttribute('class')) {
        //     letterSpan.removeAttribute('class');
        //   }
        // })
      }
    });
    // if prompt is empty, render new prompt
    if (!currentPrompt.length) renderPrompt();
  }
}

/**
 * TODO: gameOver: stops timer, toggles results modal and ends game
 **/
function gameOver() {
  console.log('~ game over');
}

/**
 * event listeners
 **/
userInput.addEventListener('focus', handleInputFocus);
userInput.addEventListener('focusout', handleInputFocusOut);
userInput.addEventListener('input', handleInput);
userInput.addEventListener('keydown', handleEnter);

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
