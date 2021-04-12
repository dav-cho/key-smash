const prompt = document.getElementById('prompt');
const currentPrompt = prompt.childNodes;
const userInput = document.getElementById('user-input');
const wordCountDisplay = document.getElementById('word-count');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

let wordCount = 0;
let time = 65;
let score = 0;
let difficulty = 'easy';
const currentWordArray = [];

/**
 * toggle nav logo on scroll
 **/
const navLogoImg = document.getElementById('nav-logo-img');
const navLogoText = document.getElementById('nav-logo-text');

function toggleHiddenNavLogo() {
  if (window.scrollY > 115) {
    navLogoImg.style.display = 'block';
    navLogoText.style.display = 'none';
  } else {
    navLogoImg.style.display = 'none';
    navLogoText.style.display = 'block';
  }
}

document.addEventListener('scroll', toggleHiddenNavLogo);

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
 * fetches lorem ipsum text from json
 **/
async function getPrompt() {
  try {
    const res = await fetch('https://type.fit/api/quotes');
    const json = await res.json();

    const fetchedPrompt = json[Math.floor(Math.random() * json.length)].text.split(' ');
    return fetchedPrompt.slice(0, 30);
  } catch (err) {
    console.log('ERROR', err);
  }
}
// async function getPrompt() {
//   try {
//     const res = await fetch('src/lorem-ipsum.json');
//     const json = await res.json();
//     console.log('SUCCESS', res);
    
//     const fetchedPrompt = json[difficulty][Math.floor(Math.random() * json[difficulty].length)].split(' ');
//     const randomSliceStart = Math.floor(Math.random() * (fetchedPrompt.length - 5));
//     return fetchedPrompt.slice(randomSliceStart, randomSliceStart + 5); // slice to 5 for testing. actual length tbd
//   } catch (err) {
//     console.log('ERROR', err);
//   }
// }

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
 * clears prompt letter highlights on word match
 **/
function clearPromptHighlights() {
  currentPrompt.forEach(promptTile => {
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
  if (time >= 0) setInterval(updateTimer, 1000);
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
 * highlights prompt letters matching user input
 * TODO: fix delte glitches
 **/
function handleInput(e) {
  if (e.data) {
    currentWordArray.push(e.data);
    currentPrompt.forEach(promptTile => {
      const currentWord = currentWordArray.join('').trim();
      const promptWordSlice = promptTile.id.slice(0, currentWord.length);
      const letterSpans = promptTile.childNodes;

      if (promptWordSlice === currentWord) {
        for (let i = 0; i < currentWord.length; ++i) {
          letterSpans[i].classList.add('letter-match');
        }
      }
    });
  } else {
    const deletedLetter = currentWordArray.pop();

    currentPrompt.forEach(promptTile => {
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
function handleEnter(e) {
  if ((e.key === 'Enter' || e.key === ' ') && time >= 0) {
    currentPrompt.forEach(promptTile => {
      if (promptTile.id === currentWordArray.join('').trim()) {
        updateScore();
        updateWordCount();
        clearPromptHighlights();
        promptTile.remove();
        userInput.value = null;
        currentWordArray.splice(0, currentWordArray.length);
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

userInput.addEventListener('focus', handleInputFocus);
userInput.addEventListener('focusout', handleInputFocusOut);
userInput.addEventListener('input', handleInput);
userInput.addEventListener('keydown', handleEnter);
