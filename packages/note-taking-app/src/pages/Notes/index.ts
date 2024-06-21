import { createRoute } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';

import { getNotes } from '@features/Notes/api';
import { rootRoute } from '../';
import { Notes } from './Notes';

const notesQueryOptions = queryOptions({
  queryKey: ['notes'],
  queryFn: getNotes
});

export const notesRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  loader({ context: { queryClient } }) {
    return queryClient.ensureQueryData(notesQueryOptions);
  },
  shouldReload: true,
  component: Notes
});
