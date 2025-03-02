import { lazy } from 'react';

// Add a delay to lazy imports to ensure loading state is visible in development
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createLazyComponent = (importFn: () => Promise<any>, minDelay = 0) => {
  if (process.env.NODE_ENV === 'production' || minDelay === 0) {
    return lazy(importFn);
  }

  return lazy(() =>
    Promise.all([importFn(), new Promise(resolve => setTimeout(resolve, minDelay))]).then(([module]) => module)
  );
};

// Lazy load all the pages
const HomePage = createLazyComponent(() => import('@/pages/Home'));
const ExplorePage = createLazyComponent(() => import('@/pages/Explore'));
const DestinationPage = createLazyComponent(() => import('@/pages/Destination'));
const TripPlanPage = createLazyComponent(() => import('@/pages/TripPlan'));
const AboutPage = createLazyComponent(() => import('@/pages/about/index'));
const ContactUsPage = createLazyComponent(() => import('@/pages/contactUs/index'));
const SearchPage = createLazyComponent(() => import('@/pages/Search'));
const NotFoundPage = createLazyComponent(() => import('@/pages/NotFound'));

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
