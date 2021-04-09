const userInput = document.getElementById('user-input');

function handleInput(e) {
  console.log('~ e', e)
  console.log('~ userInput', userInput.value)
}

userInput.addEventListener('input', handleInput);
// userInput.addEventListener('change', handleInput);

async function getLorem() {
  const res = await fetch('src/lorem-ipsum.json');
  console.log('~ res', res)
  const dummy = await res.json();
  console.log('~ dummy', dummy)
}