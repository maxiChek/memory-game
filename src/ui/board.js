// Game board UI: a grid of 16 card buttons.
// Each card is a <button> with two faces (back / front).
// Click events are reported upward; visuals are driven by state.

import { el, button, svg } from '../utils/dom.js';
import { cardIcons } from '../data/cards.js';

/**
 * Build the game board.
 * @param {Object} options
 * @param {(id: number) => void} options.onCardClick - called with card id
 * @returns {{ node: HTMLElement, render: (state: object) => void }}
 */
export function renderBoard({ onCardClick }) {
  // Keep a reference to each card's DOM node for fast updates.
  /** @type {Map<number, HTMLButtonElement>} */
  const nodesById = new Map();

  // Identity of the deck currently rendered into the grid.
  // resetState() creates a fresh array on every new game,
  // so a changed reference means "rebuild the grid".
  let renderedDeck = null;

  const grid = el('div', { className: 'board' });

  /**
   * Create one card button.
   * @param {import('../state.js').Card} card
   */
  function createCard(card) {
    const frontFace = el('div', { className: 'card__face card__face--front' }, [
      cardIcons[card.iconIndex](),
    ]);

    const backFace = el('div', { className: 'card__face card__face--back' }, [
      svg('svg', { viewBox: '0 0 24 24', width: '100%', height: '100%' }, [
        svg('path', {
          d: 'M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 16.9 6.6 19.6l1.2-6L3.3 9.4l6.1-.8z',
          fill: '#cfd8dc',
        }),
      ]),
    ]);

    const node = button(
      {
        className: 'card',
        'data-id': String(card.id),
        'aria-label': 'Закрытая карточка',
        onClick: () => onCardClick(card.id),
      },
      [el('div', { className: 'card__inner' }, [backFace, frontFace])],
    );

    return node;
  }

  /**
   * Rebuild the grid from scratch for a new game.
   * @param {import('../state.js').Card[]} cards
   */
  function build(cards) {
    nodesById.clear();
    // Remove all children without innerHTML.
    while (grid.firstChild) grid.removeChild(grid.firstChild);

    for (const card of cards) {
      const node = createCard(card);
      nodesById.set(card.id, node);
      grid.append(node);
    }
  }

  /**
   * Sync the DOM with the current state:
   * flipped / matched classes and aria-labels.
   * @param {object} state
   */
  function render(state) {
    if (state.cards !== renderedDeck) {
      build(state.cards);
      renderedDeck = state.cards;
    }

    for (const card of state.cards) {
      const node = nodesById.get(card.id);
      if (!node) continue;

      const faceUp = card.matched || state.flippedIds.includes(card.id);

      node.classList.toggle('card--flipped', faceUp);
      node.classList.toggle('card--matched', card.matched);

      if (card.matched) {
        node.setAttribute('aria-label', 'Найденная пара');
      } else if (faceUp) {
        node.setAttribute('aria-label', 'Открытая карточка');
      } else {
        node.setAttribute('aria-label', 'Закрытая карточка');
      }
    }
  }

  return { node: grid, render, build };
}
