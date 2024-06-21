import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Outlet, useLoaderData, useNavigate } from '@tanstack/react-router';

import { createNote } from '@features/Notes/api';
import { NotesList } from '@features/Notes/NotesList';
import { IconButton } from '@components/IconButton';

export function Notes() {
  const notes = useLoaderData({ from: '/' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: createNewNote, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess({ id }) {
      navigate({ to: `notes/${id}` });
      queryClient.invalidateQueries({ queryKey: ['notes'], refetchType: 'all' });
    }
  });

  return (
    <>
      <section className="notes">
        <IconButton
          className="notes__add"
          size="large"
          icon="add"
          onClick={() => createNewNote(' ')}
          disabled={isPending}
        />
        <NotesList notes={notes} />
      </section>
      <Outlet />
    </>
  );
}
