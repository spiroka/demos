import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { notesRoute } from '@pages/Notes';
import { noteRoute } from '@pages/Note';
import { rootRoute } from './pages';

import './index.css'

const queryClient = new QueryClient({
  defaultOptions:{
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const routeTree = rootRoute.addChildren([notesRoute.addChildren([noteRoute])]);

const router = createRouter({
  basepath: '/demos/note-taking-app',
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: {
    queryClient
  }
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
