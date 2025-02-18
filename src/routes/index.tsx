import {
  HomePage,
  ExplorePage,
  DestinationPage,
  TripPlanPage,
  AboutPage,
  ContactPage,
  SearchPage,
  NotFoundPage,
} from '@/pages';

const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/explore', element: <ExplorePage /> },
  { path: '/destination-details/:id', element: <DestinationPage /> },
  { path: '/design-your-trip', element: <TripPlanPage /> },
  { path: '/about-us', element: <AboutPage /> },
  { path: '/contact-us', element: <ContactPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export default routes;
