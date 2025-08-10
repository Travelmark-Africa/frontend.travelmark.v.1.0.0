import HomePage from '@/pages/home';
import AboutPage from '@/pages/about';
import OurServicesPage from '@/pages/ourServices';
import PortfolioPage from '@/pages/portfolio';
import ContactUsPage from '@/pages/contactUs';
import NotFoundPage from '@/pages/NotFound';

// Define routes with directly imported components
const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/about-us', element: <AboutPage /> },
  { path: '/our-services', element: <OurServicesPage /> },
  { path: '/portfolio', element: <PortfolioPage /> },
  { path: '/contact-us', element: <ContactUsPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export default routes;
