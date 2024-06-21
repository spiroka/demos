import {  ReactPortal, useState, memo, useCallback, forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { MentionPopup } from './MentionPopup';
import { insertNodeAtCaret, placeCaretAfter, sanitize } from '@utils/dom';

import './Editor.css'

// this should never re-render, contents are managed outside of React
const TextArea = memo(forwardRef<HTMLElement>((_, ref) => (
  <section
    ref={ref}
    role="textbox"
    aria-label="Note editor"
    className="editor"
    contentEditable
    spellCheck={false}
  />
)));

interface Props {
  body: string;
  onChange(newBody: string): void;
}

function EditorComponent({ body, onChange }: Props) {
  const [textArea, setTextArea] = useState<HTMLElement | null>(null);
  const [mentionsPopup, setMentionsPopup] = useState<ReactPortal | null>(null);

  const handleInput = useCallback((e: Event) => {
    const { data } = e as InputEvent;

    if (data === '@' && !mentionsPopup) {
      const mentionsPopupNode = document.createElement('span');
      mentionsPopupNode.setAttribute('editor-tool', '');
      insertNodeAtCaret(mentionsPopupNode);

      setMentionsPopup(
        createPortal(
          <MentionPopup
            onClear={() => {
              setMentionsPopup(null);
              mentionsPopupNode.remove();
            }}
            onAddMention={(userName) => {
              const mentionEl = document.createElement('span');
              mentionEl.textContent = `@${userName}`;
              mentionEl.classList.add('user-mention');
              mentionEl.contentEditable = 'false';
              mentionsPopupNode.replaceWith(mentionEl);

              // Restore caret position.
              // Using timeout to make sure the element is inserted into the DOM
              // before placing the caret.
              setTimeout(() => {
                placeCaretAfter(mentionEl);
                onChange(sanitize(textArea?.innerHTML || ''));
              });
              setMentionsPopup(null);
            }}
          />,
          mentionsPopupNode
        )
      );
    } else {
      onChange(sanitize(textArea?.innerHTML || ''));
    }
  }, [onChange, textArea, mentionsPopup]);

  useEffect(() => {
    if (!textArea) return;

    textArea.addEventListener('input', handleInput);

    return () => {
      textArea.removeEventListener('input', handleInput);
    };
  }, [handleInput, textArea]);

  useEffect(() => {
    if (!textArea) return;

    textArea.innerHTML = body ? sanitize(body) : '';

    if (textArea.lastChild) {
      placeCaretAfter(textArea.lastChild);
    }
  }, [body, textArea]);

  return (
    <>
      <TextArea
        ref={setTextArea}
      />
      {mentionsPopup}
    </>
  )
}

export const Editor = memo(EditorComponent);
