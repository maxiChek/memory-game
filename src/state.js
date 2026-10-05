// Central game state.
// This module owns the data; the game logic mutates it,
// and the UI reads it for rendering.

import { PAIRS_COUNT } from './data/cards.js';
import { shuffle } from './utils/shuffle.js';

/**
 * @typedef {Object} Card
 * @property {number} id - unique card id (0..15)
 * @property {number} iconIndex - index into cardIcons (0..7)
 * @property {boolean} matched - true if the pair has already been found
 */

export const state = {
  /** @type {Card[]} */
  cards: [],
  moves: 0,
  matches: 0,
  /** ids of cards currently face-up but not yet matched (max 2) */
  flippedIds: [],
  /** true while a mismatched pair is shown; blocks further clicks */
  locked: false,
  /** id of the active mismatch timer, if any */
  timerId: null,
  finished: false,
  /** set to true once the finished game has been saved to the leaderboard */
  resultSaved: false,
};

/**
 * Build a fresh shuffled deck: one pair of cards per icon.
 * @returns {Card[]}
 */
function buildDeck() {
  const deck = [];
  for (let iconIndex = 0; iconIndex < PAIRS_COUNT; iconIndex++) {
    deck.push({ id: deck.length, iconIndex, matched: false });
    deck.push({ id: deck.length, iconIndex, matched: false });
  }
  return shuffle(deck);
}

/**
 * Reset the state for a new game.
 * Note: the caller must cancel a pending mismatch timer
 * (via clearMismatchTimer) *before* calling this.
 */
export function resetState() {
  state.cards = buildDeck();
  state.moves = 0;
  state.matches = 0;
  state.flippedIds = [];
  state.locked = false;
  state.timerId = null;
  state.finished = false;
  state.resultSaved = false;
}

/**
 * Cancel the active mismatch timer, if any.
 */
export function clearMismatchTimer() {
  if (state.timerId !== null) {
    clearTimeout(state.timerId);
    state.timerId = null;
  }
}

/**
 * Get a card by id.
 * @param {number} id
 * @returns {Card|undefined}
 */
export function getCard(id) {
  return state.cards.find(card => card.id === id);
}

/**
 * Whether a card is currently face-up.
 * A card is face-up if it's matched OR if it's one of the flipped pair.
 * @param {Card} card
 */
export function isFaceUp(card) {
  return card.matched || state.flippedIds.includes(card.id);
}
