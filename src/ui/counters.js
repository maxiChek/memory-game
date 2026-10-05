// Counters UI: moves and matched pairs.
// Renders the panel and exposes an update function that main.js
// calls after every state change.

import { el, span } from '../utils/dom.js';
import { PAIRS_COUNT } from '../data/cards.js';

/**
 * Build the counters panel.
 * @returns {{ node: HTMLElement, update: (moves: number, matches: number) => void }}
 */
export function renderCounters() {
  const movesValue = span({ className: 'counters__value', text: '0' });
  const matchesValue = span({
    className: 'counters__value',
    text: `0 из ${PAIRS_COUNT}`,
  });

  const node = el('div', { className: 'counters' }, [
    el('div', { className: 'counters__item' }, [
      span({ className: 'counters__label', text: 'Ходы:' }),
      movesValue,
    ]),
    el('div', { className: 'counters__item' }, [
      span({ className: 'counters__label', text: 'Пары:' }),
      matchesValue,
    ]),
  ]);

  /**
   * Update the displayed values.
   * @param {number} moves
   * @param {number} matches
   */
  function update(moves, matches) {
    movesValue.textContent = String(moves);
    matchesValue.textContent = `${matches} из ${PAIRS_COUNT}`;
  }

  return { node, update };
}
