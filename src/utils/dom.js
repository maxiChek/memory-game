// Thin wrappers around document.createElement / createElementNS.
// All UI in the project must be built through these helpers.

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Create an HTML element.
 * @param {string} tag - tag name, e.g. 'div', 'button', 'span'
 * @param {Object} [props] - attributes/props for the element
 * @param {Array<Node|string>} [children] - child nodes or text
 * @returns {HTMLElement}
 */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;

    if (key === 'className') {
      node.className = value;
    } else if (key === 'text') {
      node.textContent = value;
    } else if (key === 'dataset') {
      Object.assign(node.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      // onClick -> 'click', onKeydown -> 'keydown'
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      node.setAttribute(key, value === true ? '' : String(value));
    }
  }

  for (const child of children) {
    if (child === undefined || child === null || child === false) continue;
    node.append(child); // append accepts both Nodes and strings
  }

  return node;
}

// Short helpers for the most common tags
export const div = (props, children) => el('div', props, children);
export const span = (props, children) => el('span', props, children);
export const button = (props, children) =>
  el('button', { type: 'button', ...props }, children);

/**
 * Create an SVG element with the correct namespace.
 * @param {string} tag - tag name without prefix, e.g. 'svg', 'path', 'circle'
 * @param {Object} [props] - SVG attributes (d, viewBox, fill, ...)
 * @param {Array<Node>} [children]
 * @returns {SVGElement}
 */
export function svg(tag, props = {}, children = []) {
  const node = document.createElementNS(SVG_NS, tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    node.setAttribute(key, String(value));
  }

  for (const child of children) {
    if (child === undefined || child === null) continue;
    node.append(child);
  }

  return node;
}
