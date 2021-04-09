const userInput = document.getElementById('user-input');

function handleInput(e) {
  console.log('~ e', e)
  console.log('~ userInput', userInput.value)
}

userInput.addEventListener('input', handleInput);
// userInput.addEventListener('change', handleInput);