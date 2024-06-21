import DOMPurify from 'dompurify';

export function insertNodeAtCaret(node: Node) {
  const selection = getSelection() as Selection;
  const text = selection.anchorNode?.textContent;
  const textBefore = text?.slice(0, selection.anchorOffset - 1);
  const textAfter = text?.slice(selection.anchorOffset);
  const newContent = document.createDocumentFragment();
  newContent.appendChild(new Text(textBefore));
  newContent.appendChild(node);
  newContent.appendChild(new Text(textAfter));
  selection.anchorNode?.parentNode?.replaceChild(newContent, selection.anchorNode);
}

export function placeCaretAfter(node: Node) {
  const selection = document.getSelection();
  const range = new Range();
  range.setStartAfter(node);
  range.collapse();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

DOMPurify.addHook('uponSanitizeElement', (node) => {
  if (node.hasAttribute?.('editor-tool')) {
    node.parentNode?.removeChild(node);
  }
});

export function sanitize(dirty: string) {
  return DOMPurify.sanitize(dirty, { ADD_ATTR: ['contenteditable'] }).replace('&nbsp;', ' ');
}
