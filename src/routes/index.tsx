import {
  HomePage,
  SearchPage,
  NotFoundPage,
} from '@/pages';

const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export default routes;
