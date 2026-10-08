// Application entry point.
// Builds the UI, creates the game controller, and wires everything together.

import { el } from './utils/dom.js';
import { state } from './state.js';
import { createGame } from './game.js';
import { renderHeader } from './ui/header.js';
import { renderCounters } from './ui/counters.js';
import { renderBoard } from './ui/board.js';
import { createVictoryModal } from './ui/victoryModal.js';
import { createLeadersModal } from './ui/leadersModal.js';
import { loadLeaderboard } from './utils/storage.js';
import './style.css';

// The game controller is created after the board, but callbacks
// reference it lazily through arrow functions, so declaration order
// does not matter as long as they are not invoked during setup.
/** @type {ReturnType<typeof createGame>} */
let game;

// --- UI: header ------------------------------------------------------------

const header = renderHeader({
  onNewGame: () => game.startNewGame(),
  onShowLeaderboard: () => leadersModal.open(loadLeaderboard()),
});

// --- UI: counters ----------------------------------------------------------

const counters = renderCounters();

// --- UI: board -------------------------------------------------------------

const board = renderBoard({
  onCardClick: id => game.handleCardClick(id),
});

// --- Modals ----------------------------------------------------------------

const victoryModal = createVictoryModal({
  onNewGame: () => game.startNewGame(),
});

const leadersModal = createLeadersModal();

// --- Game controller -------------------------------------------------------

game = createGame({
  onChange: () => {
    board.render(state);
    counters.update(state.moves, state.matches);
  },
  onWin: () => {
    victoryModal.open(state.moves);
  },
});

// --- Mount -----------------------------------------------------------------

const app = el('div', { className: 'app' }, [
  header,
  el('main', { className: 'app__main' }, [counters.node, board.node]),
]);

document.body.append(app);
document.body.append(victoryModal.dialog);
document.body.append(leadersModal.dialog);

// --- Start the first game on page load -------------------------------------

game.startNewGame();
