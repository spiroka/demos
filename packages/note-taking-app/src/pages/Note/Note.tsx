import { useMemo, useRef } from 'react';
import { useLoaderData, useNavigate, useRouter } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveNote as saveNoteApi } from '@features/Notes/api';
import { Editor } from '@features/Editor';
import { IconButton } from '@components/IconButton';
import { debounce } from '@utils/common';
import { Note } from '@features/Notes/types';

export function NoteComponent() {
  const note = useLoaderData({ from: '/notes/$id' });
  const { id } = note;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: saveNote } = useMutation({
    mutationFn: saveNoteApi,
    async onMutate(newNote) {
      await queryClient.cancelQueries({ queryKey: ['notes'] });

      const previousNotes = queryClient.getQueryData(['notes']);

      queryClient.setQueryData(['notes'], (oldNotes: Note[]) => (
        oldNotes.map((oldNote) => {
          if (oldNote.id === newNote.id) {
            return newNote;
          }

          return oldNote;
        })
      ));

      return { previousNotes };
    },
    onError(_err, _newNote, context) {
      queryClient.setQueryData(['notes'], context?.previousNotes);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['notes'], refetchType: 'all' });
    }
  });
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const navigate = useNavigate();

  const debouncedSave = useMemo(
    () => (
      debounce((body: string) => {
        saveNote({ id: +id, body });
      }, 200)
    ),
    [id, saveNote]
  );

  return (
    <dialog
      className="editor"
      ref={(el) => {
        if (el) {
          el.showModal();
        }

        dialogRef.current = el;
      }}
      onClose={() => {
        router.invalidate();
        navigate({ to: '/' });
      }}
    >
      <IconButton
        onClick={() => dialogRef.current?.close()}
        className="editor__close-button"
        icon="close"
        size="small"
      />
      <h2>Note title</h2>
      <Editor
        body={note.body}
        onChange={debouncedSave}
      />
    </dialog>
  );
}
