// Victory modal: shown once the last pair is found.
// Wraps the shared createModal shell with victory-specific content.

import { el, button } from '../utils/dom.js';
import { createModal } from './modal.js';

/**
 * Create the victory modal.
 * @param {Object} handlers
 * @param {() => void} handlers.onNewGame - "New game" button
 * @returns {{
 *   dialog: HTMLDialogElement,
 *   open: (moves: number) => void,
 *   close: () => void,
 * }}
 */
export function createVictoryModal({ onNewGame }) {
  const modal = createModal({ className: 'modal--victory' });

  /**
   * Show the modal with the final move count.
   * @param {number} moves
   */
  function open(moves) {
    const title = el('h2', { className: 'modal__title', text: 'Победа!' });

    const text = el('p', {
      className: 'modal__text',
      text: `Вы нашли все пары за ${moves} ${pluralizeMoves(moves)}.`,
    });

    modal.setContent([title, text]);

    modal.setFooter([
      button({
        className: 'btn btn--primary',
        text: 'Новая игра',
        onClick: () => {
          modal.close();
          onNewGame();
        },
      }),
      button({
        className: 'btn btn--secondary',
        text: 'Закрыть',
        onClick: () => modal.close(),
      }),
    ]);

    modal.open();
  }

  return { dialog: modal.dialog, open, close: modal.close };
}

/**
 * Pick the correct Russian plural form for "ход" / "хода" / "ходов".
 * @param {number} n
 * @returns {string}
 */
function pluralizeMoves(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'ход';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'хода';
  return 'ходов';
}
