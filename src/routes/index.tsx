import { HomePage, ExplorePage, TripPlanPage, AboutPage, ContactPage, SearchPage, NotFoundPage } from '@/pages';

const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/explore', element: <ExplorePage /> },
  { path: '/design-your-trip', element: <TripPlanPage /> },
  { path: '/about-us', element: <AboutPage /> },
  { path: '/contact-us', element: <ContactPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export default routes;
