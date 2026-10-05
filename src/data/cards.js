// Card icon data. 8 pairs => 16 cards total.
// Each entry is a factory that returns a fresh SVG node,
// so the same icon can be rendered on multiple cards.

import { svg } from '../utils/dom.js';

// All icons use a 24x24 viewBox for consistent sizing.
const icon = children =>
  svg('svg', { viewBox: '0 0 24 24', width: '100%', height: '100%' }, children);

export const cardIcons = [
  // 1. Red circle
  () => icon([svg('circle', { cx: 12, cy: 12, r: 9, fill: '#e74c3c' })]),

  // 2. Blue rounded square
  () =>
    icon([
      svg('rect', {
        x: 4,
        y: 4,
        width: 16,
        height: 16,
        rx: 3,
        fill: '#3498db',
      }),
    ]),

  // 3. Green triangle
  () => icon([svg('polygon', { points: '12,3 21,20 3,20', fill: '#2ecc71' })]),

  // 4. Yellow diamond
  () =>
    icon([
      svg('polygon', { points: '12,3 21,12 12,21 3,12', fill: '#f1c40f' }),
    ]),

  // 5. Purple star
  () =>
    icon([
      svg('path', {
        d: 'M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 16.9 6.6 19.6l1.2-6L3.3 9.4l6.1-.8z',
        fill: '#9b59b6',
      }),
    ]),

  // 6. Pink heart
  () =>
    icon([
      svg('path', {
        d: 'M12 20.5s-6.5-4-8.3-8A4.6 4.6 0 0 1 12 8a4.6 4.6 0 0 1 8.3 4.5c-1.8 4-8.3 8-8.3 8z',
        fill: '#e91e63',
      }),
    ]),

  // 7. Teal clock
  () =>
    icon([
      svg('circle', {
        cx: 12,
        cy: 12,
        r: 8.5,
        fill: 'none',
        stroke: '#1abc9c',
        'stroke-width': 2,
      }),
      svg('path', {
        d: 'M12 7v5l3 2',
        fill: 'none',
        stroke: '#1abc9c',
        'stroke-width': 2,
        'stroke-linecap': 'round',
      }),
    ]),

  // 8. Orange hexagon
  () =>
    icon([
      svg('polygon', {
        points: '12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5',
        fill: '#e67e22',
      }),
    ]),
];

// Number of unique pairs and total cards on the board.
export const PAIRS_COUNT = cardIcons.length; // 8
export const TOTAL_CARDS = PAIRS_COUNT * 2; // 16
