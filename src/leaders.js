// Leaderboard helpers: formatting dates and preparing rows for display.
// Actual storage access lives in utils/storage.js;
// this module only turns raw results into view-ready data.

import { compareResults, MAX_RESULTS } from './utils/storage.js';

/**
 * Format a timestamp as DD.MM.YYYY (no time part).
 * @param {number} timestamp - ms since epoch
 * @returns {string}
 */
export function formatDate(timestamp) {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Prepare leaderboard rows for rendering.
 * Re-sorts a defensive copy, assigns places (1-based), formats dates.
 * @param {import('./utils/storage.js').GameResult[]} results
 * @returns {Array<{ place: number, moves: number, date: string }>}
 */
export function buildLeaderboardRows(results) {
  return [...results]
    .sort(compareResults)
    .slice(0, MAX_RESULTS)
    .map((item, index) => ({
      place: index + 1,
      moves: item.moves,
      date: formatDate(item.timestamp),
    }));
}
