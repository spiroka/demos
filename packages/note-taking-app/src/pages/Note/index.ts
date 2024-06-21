import { queryOptions } from '@tanstack/react-query';
import { createRoute } from '@tanstack/react-router';

import { getNote } from '@features/Notes/api';
import { notesRoute } from '@pages/Notes';
import { NoteComponent } from './Note';

const noteQueryOptions = (id: number) => (
  queryOptions({
    queryKey: ['notes', id],
    queryFn: () => getNote(id)
  })
);

export const noteRoute = createRoute({
  getParentRoute: () => notesRoute,
  path: '/notes/$id',
  loader({ context: { queryClient }, params: { id } }) {
    return queryClient.ensureQueryData(noteQueryOptions(+id));
  },
  component: NoteComponent
});
