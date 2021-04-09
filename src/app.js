const prompt = document.getElementById('prompt');
const currentPrompt = prompt.childNodes;
const userInput = document.getElementById('user-input');
const wpmDisplay = document.getElementById('wpm');
const timerDisplay = document.getElementById('timer');
const mistakesDisplay = document.getElementById('mistakes');

let difficulty = 'easy';

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

// render prompt;
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

function handleFocus() {
  if (!currentPrompt.length) renderPrompt();
  // start timer
}

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

// use for letter highlighting
function handleInput() {
  console.log('~ currentPrompt', currentPrompt);
}

userInput.addEventListener('keydown', handleEnter);
userInput.addEventListener('input', handleInput);
userInput.addEventListener('focus', handleFocus);
// const startStop = document.getElementById('start-stop');
// startStop.addEventListener('click', changePrompt);
