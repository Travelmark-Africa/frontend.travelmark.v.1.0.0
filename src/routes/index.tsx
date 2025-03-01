import { lazy } from 'react';

// Lazy load all the pages
const HomePage = lazy(() => import('@/pages/Home'));
const ExplorePage = lazy(() => import('@/pages/Explore'));
const DestinationPage = lazy(() => import('@/pages/Destination'));
const TripPlanPage = lazy(() => import('@/pages/TripPlan'));
const AboutPage = lazy(() => import('@/pages/about/index'));
const ContactUsPage = lazy(() => import('@/pages/contactUs/index'));
const SearchPage = lazy(() => import('@/pages/Search'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

// Define routes with lazy-loaded components
const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/explore', element: <ExplorePage /> },
  { path: '/destination-details/:id', element: <DestinationPage /> },
  { path: '/design-your-trip', element: <TripPlanPage /> },
  { path: '/about-us', element: <AboutPage /> },
  { path: '/contact-us', element: <ContactUsPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export default routes;
