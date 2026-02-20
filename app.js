const yearElement = document.getElementById('year');
const selectorElement = document.getElementById('game-selector');
const gameCards = document.querySelectorAll('.game-card');
const miniGameSelector = document.getElementById('mini-game-selector');
const startGameButton = document.getElementById('start-game');
const actionButton = document.getElementById('action-btn');
const resetGameButton = document.getElementById('reset-game');
const openReplitLink = document.getElementById('open-replit');
const statusElement = document.getElementById('game-status');
const inputZone = document.getElementById('game-input-zone');

yearElement.textContent = new Date().getFullYear();

selectorElement.addEventListener('change', () => {
  const selectedGame = selectorElement.value;
  gameCards.forEach((card) => {
    const isMatch = selectedGame === 'all' || card.dataset.game === selectedGame;
    card.style.display = isMatch ? 'block' : 'none';
    card.classList.toggle('is-active', selectedGame !== 'all' && isMatch);
  });
});

const games = [
  'Number Guess',
  'Rock Paper Scissors',
  'Math Sprint',
  'Word Scramble',
  'Reaction Test',
  'Dice Duel',
  'Coin Toss Streak',
  'Even or Odd',
  'Trivia Quick',
  'High-Low Card'
];

const replitLinks = Object.fromEntries(games.map((name, index) => {
  const query = encodeURIComponent(`${name} mini game`);
  return [index, `https://replit.com/search?query=${query}`];
}));

games.forEach((name, index) => {
  const opt = document.createElement('option');
  opt.value = String(index);
  opt.textContent = `${index + 1}. ${name}`;
  miniGameSelector.appendChild(opt);
});

const state = {};

const clearInputZone = () => {
  inputZone.innerHTML = '';
};

const setStatus = (text) => {
  statusElement.textContent = text;
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const startSelectedGame = () => {
  clearInputZone();
  const selected = Number(miniGameSelector.value);
  state.current = selected;
  openReplitLink.href = replitLinks[selected] || 'https://replit.com/';

  if (selected === 0) {
    state.answer = randomInt(1, 20);
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = 'Guess 1-20';
    input.id = 'guess-input';
    inputZone.appendChild(input);
    setStatus('Number Guess: enter your guess then tap Action.');
  }

  if (selected === 1) {
    state.rpsTurn = 'p1';
    state.rpsPicks = {};

    const modeSelect = document.createElement('select');
    modeSelect.id = 'rps-mode';
    [
      { value: 'cpu', label: 'Vs CPU' },
      { value: '1v1', label: '1v1 (same device)' }
    ].forEach((item) => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      modeSelect.appendChild(option);
    });

    const choiceSelect = document.createElement('select');
    choiceSelect.id = 'rps-input';
    ['rock', 'paper', 'scissors'].forEach((item) => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      choiceSelect.appendChild(option);
    });

    inputZone.appendChild(modeSelect);
    inputZone.appendChild(choiceSelect);
    setStatus('Rock Paper Scissors: choose mode, then pick and tap Action.');
  }

  if (selected === 2) {
    state.a = randomInt(1, 12);
    state.b = randomInt(1, 12);
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = `${state.a} + ${state.b} = ?`;
    input.id = 'math-input';
    inputZone.appendChild(input);
    setStatus('Math Sprint: solve the equation then tap Action.');
  }

  if (selected === 3) {
    const words = ['android', 'ios', 'mobile', 'arcade', 'puzzle'];
    state.word = words[randomInt(0, words.length - 1)];
    state.scramble = state.word.split('').sort(() => 0.5 - Math.random()).join('');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Unscramble: ${state.scramble}`;
    input.id = 'scramble-input';
    inputZone.appendChild(input);
    setStatus('Word Scramble: type the original word then Action.');
  }

  if (selected === 4) {
    setStatus('Reaction Test: press Action now and see your random reaction score.');
  }

  if (selected === 5) {
    setStatus('Dice Duel: tap Action to roll your dice vs CPU.');
  }

  if (selected === 6) {
    state.streak = 0;
    const select = document.createElement('select');
    select.id = 'coin-input';
    ['heads', 'tails'].forEach((item) => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      select.appendChild(option);
    });
    inputZone.appendChild(select);
    setStatus('Coin Toss Streak: predict heads/tails and tap Action.');
  }

  if (selected === 7) {
    state.number = randomInt(1, 99);
    const select = document.createElement('select');
    select.id = 'evenodd-input';
    ['even', 'odd'].forEach((item) => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      select.appendChild(option);
    });
    inputZone.appendChild(select);
    setStatus(`Even or Odd: is ${state.number} even or odd? Then Action.`);
  }

  if (selected === 8) {
    const trivia = [
      { q: 'How many games are on this page?', a: '10' },
      { q: 'Which platform is mentioned with Android?', a: 'ios' }
    ];
    state.trivia = trivia[randomInt(0, trivia.length - 1)];
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = state.trivia.q;
    input.id = 'trivia-input';
    inputZone.appendChild(input);
    setStatus('Trivia Quick: answer then tap Action.');
  }

  if (selected === 9) {
    state.cpuCard = randomInt(1, 13);
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = 'Pick your card value 1-13';
    input.id = 'card-input';
    inputZone.appendChild(input);
    setStatus('High-Low Card: pick your card then tap Action.');
  }
};

const resetCurrentGame = () => {
  startSelectedGame();
  setStatus(`Reset complete for ${games[state.current]}.`);
};

const handleAction = () => {
  const selected = state.current;

  if (selected === 0) {
    const val = Number(document.getElementById('guess-input').value);
    if (!val) return setStatus('Enter a number first.');
    if (val === state.answer) return setStatus('🎉 Correct! You win.');
    setStatus(val > state.answer ? 'Too high!' : 'Too low!');
  }

  if (selected === 1) {
    const user = document.getElementById('rps-input').value;
    const mode = document.getElementById('rps-mode').value;
    const options = ['rock', 'paper', 'scissors'];

    if (mode === 'cpu') {
      const cpu = options[randomInt(0, 2)];
      if (user === cpu) return setStatus(`Draw. CPU picked ${cpu}.`);
      const win = (user === 'rock' && cpu === 'scissors') || (user === 'paper' && cpu === 'rock') || (user === 'scissors' && cpu === 'paper');
      return setStatus(win ? `✅ You win. CPU: ${cpu}` : `❌ CPU wins with ${cpu}`);
    }

    if (state.rpsTurn === 'p1') {
      state.rpsPicks.p1 = user;
      state.rpsTurn = 'p2';
      return setStatus('1v1: Player 1 locked. Player 2 choose now and tap Action.');
    }

    state.rpsPicks.p2 = user;
    state.rpsTurn = 'p1';

    if (state.rpsPicks.p1 === state.rpsPicks.p2) {
      return setStatus(`1v1 Draw: both picked ${state.rpsPicks.p1}.`);
    }

    const playerOneWins =
      (state.rpsPicks.p1 === 'rock' && state.rpsPicks.p2 === 'scissors') ||
      (state.rpsPicks.p1 === 'paper' && state.rpsPicks.p2 === 'rock') ||
      (state.rpsPicks.p1 === 'scissors' && state.rpsPicks.p2 === 'paper');

    setStatus(
      playerOneWins
        ? `🏆 1v1 Winner: Player 1 (${state.rpsPicks.p1} beats ${state.rpsPicks.p2}).`
        : `🏆 1v1 Winner: Player 2 (${state.rpsPicks.p2} beats ${state.rpsPicks.p1}).`
    );
  }

  if (selected === 2) {
    const val = Number(document.getElementById('math-input').value);
    const correct = state.a + state.b;
    setStatus(val === correct ? 'Correct answer!' : `Not quite. Correct was ${correct}.`);
  }

  if (selected === 3) {
    const text = document.getElementById('scramble-input').value.trim().toLowerCase();
    setStatus(text === state.word ? 'Great unscramble!' : `Try again. Word was "${state.word}".`);
  }

  if (selected === 4) {
    setStatus(`Reaction score: ${randomInt(120, 420)} ms.`);
  }

  if (selected === 5) {
    const you = randomInt(1, 6);
    const cpu = randomInt(1, 6);
    if (you === cpu) return setStatus(`Tie ${you}-${cpu}`);
    setStatus(you > cpu ? `You win ${you}-${cpu}` : `CPU wins ${cpu}-${you}`);
  }

  if (selected === 6) {
    const pick = document.getElementById('coin-input').value;
    const flip = Math.random() > 0.5 ? 'heads' : 'tails';
    if (pick === flip) {
      state.streak += 1;
      return setStatus(`Correct (${flip})! Streak: ${state.streak}`);
    }
    state.streak = 0;
    setStatus(`Wrong (${flip}). Streak reset.`);
  }

  if (selected === 7) {
    const pick = document.getElementById('evenodd-input').value;
    const answer = state.number % 2 === 0 ? 'even' : 'odd';
    setStatus(pick === answer ? 'Correct!' : `Wrong. ${state.number} is ${answer}.`);
  }

  if (selected === 8) {
    const text = document.getElementById('trivia-input').value.trim().toLowerCase();
    const answer = state.trivia.a.toLowerCase();
    setStatus(text === answer ? 'Trivia correct!' : `Nope. Answer: ${state.trivia.a}`);
  }

  if (selected === 9) {
    const player = Number(document.getElementById('card-input').value);
    if (player < 1 || player > 13) return setStatus('Card must be 1 to 13.');
    if (player === state.cpuCard) return setStatus(`Draw! CPU also had ${state.cpuCard}.`);
    setStatus(player > state.cpuCard ? `You win! ${player} > ${state.cpuCard}` : `CPU wins! ${state.cpuCard} > ${player}`);
  }
};

startGameButton.addEventListener('click', startSelectedGame);
actionButton.addEventListener('click', handleAction);
resetGameButton.addEventListener('click', resetCurrentGame);
openReplitLink.addEventListener('click', () => {
  setStatus(`Opening ${games[state.current]} on Replit web...`);
});
startSelectedGame();
