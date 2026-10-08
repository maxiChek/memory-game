// Header UI: title, "New game" and "Leaderboard" buttons.
// Renders the header node and wires click handlers passed from main.js.

import { el, button } from '../utils/dom.js';

/**
 * Build the header.
 * @param {Object} handlers
 * @param {() => void} handlers.onNewGame
 * @param {() => void} handlers.onShowLeaderboard
 * @returns {HTMLElement}
 */
export function renderHeader({ onNewGame, onShowLeaderboard }) {
  const newGameBtn = button({
    className: 'btn btn--primary',
    text: 'Новая игра',
    onClick: onNewGame,
  });

  const leadersBtn = button({
    className: 'btn btn--secondary',
    text: 'Таблица лидеров',
    onClick: onShowLeaderboard,
  });

  return el('header', { className: 'header' }, [
    el('h1', { className: 'header__title', text: 'Memory Game' }),
    el('div', { className: 'header__actions' }, [newGameBtn, leadersBtn]),
  ]);
}
