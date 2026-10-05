// Reusable modal component built on top of the native <dialog> element.
// Both the victory modal and the leaderboard modal share this shell;
// only the content and footer differ.
//
// Note: the caller must append `dialog` to the DOM (e.g. document.body)
// before calling `open()`. `showModal()` requires the element to be
// connected to the document.

import { el } from '../utils/dom.js';

/**
 * Create a modal instance.
 * @param {Object} [options]
 * @param {string} [options.className] - extra class on the dialog element
 * @returns {{
 *   dialog: HTMLDialogElement,
 *   open: () => void,
 *   close: () => void,
 *   setContent: (nodes: Node[]) => void,
 *   setFooter: (nodes: Node[]) => void,
 * }}
 */
export function createModal({ className = '' } = {}) {
  const body = el('div', { className: 'modal__body' });
  const footer = el('div', { className: 'modal__footer' });

  const dialog = el('dialog', { className: `modal ${className}`.trim() }, [
    body,
    footer,
  ]);

  // Close on backdrop click.
  // A click outside the dialog content lands on the <dialog> element
  // itself (the ::backdrop pseudo-element is not a separate target),
  // so `event.target === dialog` distinguishes backdrop from content.
  dialog.addEventListener('click', event => {
    if (event.target === dialog) close();
  });

  // Restore page scroll whenever the dialog closes:
  // via the Close button, backdrop click, or Escape.
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
  });

  function open() {
    // Block page scroll while a modal is open.
    document.body.classList.add('modal-open');
    dialog.showModal();
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  /**
   * Replace the modal body content.
   * @param {Node[]} nodes
   */
  function setContent(nodes) {
    body.replaceChildren(...nodes);
  }

  /**
   * Replace the modal footer content (typically action buttons).
   * @param {Node[]} nodes
   */
  function setFooter(nodes) {
    footer.replaceChildren(...nodes);
  }

  return { dialog, open, close, setContent, setFooter };
}
