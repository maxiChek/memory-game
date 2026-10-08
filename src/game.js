// Core game logic.
// This module owns the flow: start, click, resolve pair, win.
// It does NOT touch the DOM — UI updates are delegated to callbacks.

import { state, resetState, getCard, clearMismatchTimer } from './state.js';
import { PAIRS_COUNT } from './data/cards.js';
import { saveResult } from './utils/storage.js';

// How long a mismatched pair stays visible before being flipped back (ms).
// Requirement: 700–1500 ms.
const MISMATCH_DELAY_MS = 900;

/**
 * Create a game controller.
 * @param {Object} handlers
 * @param {() => void} handlers.onChange - called after every state change
 * @param {() => void} handlers.onWin - called once when the game is finished
 * @returns {{ startNewGame: () => void, handleCardClick: (id: number) => void }}
 */
export function createGame({ onChange, onWin }) {
  /**
   * Handle a click on a card.
   * All "should this click count?" rules live here.
   * @param {number} id
   */
  function handleCardClick(id) {
    // Ignore clicks while a mismatched pair is still on screen.
    if (state.locked) return;
    // Ignore clicks after the game is finished.
    if (state.finished) return;

    const card = getCard(id);
    if (!card) return;

    // Ignore already-matched cards.
    if (card.matched) return;
    // Ignore a card that is already face-up (double-click on the same card).
    if (state.flippedIds.includes(id)) return;

    // First card of the pair: just reveal it.
    if (state.flippedIds.length === 0) {
      state.flippedIds.push(id);
      onChange();
      return;
    }

    // Second card of the pair: reveal, count the move, then resolve.
    state.flippedIds.push(id);
    state.moves += 1;

    const [firstId] = state.flippedIds;
    const firstCard = getCard(firstId);

    if (firstCard && firstCard.iconIndex === card.iconIndex) {
      // Matched pair: keep both face-up for the rest of the game.
      firstCard.matched = true;
      card.matched = true;
      state.flippedIds = [];
      state.matches += 1;

      onChange();

      if (state.matches === PAIRS_COUNT) {
        finishGame();
      }
    } else {
      // Mismatched pair: lock the board, then flip both back.
      state.locked = true;
      onChange();

      state.timerId = setTimeout(() => {
        state.flippedIds = [];
        state.locked = false;
        state.timerId = null;
        onChange();
      }, MISMATCH_DELAY_MS);
    }
  }

  /**
   * Finish the current game: mark it done, save the result once,
   * and notify the caller so it can open the victory modal.
   */
  function finishGame() {
    state.finished = true;

    if (!state.resultSaved) {
      saveResult({ moves: state.moves, timestamp: Date.now() });
      state.resultSaved = true;
    }

    onWin();
  }

  /**
   * Start a new game: cancel any pending timer, reset the state,
   * and ask the caller to re-render.
   */
  function startNewGame() {
    // Must run BEFORE resetState, otherwise the pending timeout
    // would fire against the fresh deck and flip wrong cards.
    clearMismatchTimer();
    resetState();
    onChange();
  }

  return { startNewGame, handleCardClick };
}
