// Helpers for reading and writing the leaderboard in localStorage.
// The leaderboard is a list of finished games, sorted by moves ascending.
// All access to localStorage goes through this module.

const STORAGE_KEY = 'memory-game:leaderboard';
const MAX_RESULTS = 10;

/**
 * @typedef {Object} GameResult
 * @property {number} moves - number of moves in the finished game
 * @property {number} timestamp - finish time (ms since epoch)
 */

/**
 * Read the leaderboard from localStorage.
 * Returns an empty array on missing/corrupted data.
 * @returns {GameResult[]}
 */
export function loadLeaderboard() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Keep only entries that look like valid results.
    return parsed.filter(
      item =>
        item &&
        typeof item.moves === 'number' &&
        typeof item.timestamp === 'number',
    );
  } catch {
    // Corrupted JSON — treat as empty leaderboard.
    return [];
  }
}

/**
 * Add a finished game to the leaderboard.
 * The list is re-sorted, trimmed to MAX_RESULTS, and persisted.
 * @param {GameResult} result
 * @returns {GameResult[]} the updated leaderboard
 */
export function saveResult(result) {
  const next = [...loadLeaderboard(), result].sort(compareResults);
  const trimmed = next.slice(0, MAX_RESULTS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage may be full or blocked — ignore, the app keeps working.
  }

  return trimmed;
}

/**
 * Sort comparator:
 *   - fewer moves first
 *   - on equal moves, earlier game first
 * @param {GameResult} a
 * @param {GameResult} b
 */
export function compareResults(a, b) {
  if (a.moves !== b.moves) return a.moves - b.moves;
  return a.timestamp - b.timestamp;
}
