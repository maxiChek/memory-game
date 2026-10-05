// Leaderboard modal: shows up to 10 best results, or an empty-state message.
// Wraps the shared createModal shell with leaderboard-specific content.

import { el, button } from '../utils/dom.js';
import { createModal } from './modal.js';
import { buildLeaderboardRows } from '../leaders.js';

/**
 * Create the leaderboard modal.
 * @returns {{
 *   dialog: HTMLDialogElement,
 *   open: (results: import('../utils/storage.js').GameResult[]) => void,
 *   close: () => void,
 * }}
 */
export function createLeadersModal() {
  const modal = createModal({ className: 'modal--leaders' });

  /**
   * Show the modal with the given results.
   * @param {import('../utils/storage.js').GameResult[]} results
   */
  function open(results) {
    const title = el('h2', {
      className: 'modal__title',
      text: 'Таблица лидеров',
    });

    const content =
      results.length === 0
        ? el('p', {
            className: 'modal__text',
            text: 'Пока нет результатов',
          })
        : buildTable(results);

    modal.setContent([title, content]);

    modal.setFooter([
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
 * Build the results table.
 * @param {import('../utils/storage.js').GameResult[]} results
 * @returns {HTMLTableElement}
 */
function buildTable(results) {
  const rows = buildLeaderboardRows(results);

  const headerCells = ['Место', 'Ходы', 'Дата'].map(label =>
    el('th', { className: 'leaders__th', text: label }),
  );

  const bodyRows = rows.map(row =>
    el('tr', { className: 'leaders__row' }, [
      el('td', { className: 'leaders__td', text: String(row.place) }),
      el('td', { className: 'leaders__td', text: String(row.moves) }),
      el('td', { className: 'leaders__td', text: row.date }),
    ]),
  );

  return el('table', { className: 'leaders' }, [
    el('thead', {}, [el('tr', {}, headerCells)]),
    el('tbody', {}, bodyRows),
  ]);
}
