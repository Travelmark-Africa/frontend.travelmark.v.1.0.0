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
const HomePage = createLazyComponent(() => import('@/pages/home'));
const AboutPage = createLazyComponent(() => import('@/pages/about'));
const OurServicesPage = createLazyComponent(() => import('@/pages/ourServices'));
const PortfolioPage = createLazyComponent(() => import('@/pages/portfolio'));
const ContactUsPage = createLazyComponent(() => import('@/pages/contactUs'));

const NotFoundPage = createLazyComponent(() => import('@/pages/NotFound'));

// Define routes with lazy-loaded components
const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/about-us', element: <AboutPage /> },
  { path: '/our-services', element: <OurServicesPage /> },
  { path: '/portfolio', element: <PortfolioPage /> },
  { path: '/contact-us', element: <ContactUsPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export default routes;
