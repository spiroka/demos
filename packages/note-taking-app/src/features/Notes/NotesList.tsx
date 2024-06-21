import { flushSync } from 'react-dom';
import { useNavigate } from '@tanstack/react-router';

import { IconButton } from '@components/IconButton';
import { sanitize } from '@utils/dom';
import { Note } from './types';

import './NotesList.css';

interface Props {
  notes: Note[]
}

export function NotesList({ notes }: Props) {
  const navigate = useNavigate();
  // show new notes first
  const noteList = notes ? notes.slice().reverse() : [];

  return (
    <div className="notes__container">
      {noteList.map((note) => (
        <article key={note.id}>
          <h2>Note title</h2>
          <p dangerouslySetInnerHTML={{ __html: sanitize(note.body) }}/>
          <IconButton
            icon="edit"
            onClick={() => {
              if ('startViewTransition' in document) {
                document.startViewTransition(() => {
                  flushSync(() => {
                    navigate({ to: `notes/${note.id}` });
                  });
                });
              } else {
                navigate({ to: `notes/${note.id}` });
              }
            }}
          />
        </article>
      ))}
    </div>
  );
}
