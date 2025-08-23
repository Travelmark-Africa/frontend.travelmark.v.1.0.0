import { RouteObject } from 'react-router-dom';
import ProtectedRoute, { PublicOnlyRoute } from '@/authGuard';

// Public pages
import HomePage from '@/pages/home';
import AboutPage from '@/pages/about';
import OurServicesPage from '@/pages/ourServices';
import PortfolioPage from '@/pages/portfolio';
import ContactUsPage from '@/pages/contactUs';

// Auth pages
import LoginPage from '@/pages/auth/Login';

// Dashboard pages
import DashboardPage from '@/pages/dashboard/Dashboard';
import CompanySettingsPage from '@/pages/dashboard/CompanySettings';
import ServicesPage from '@/pages/dashboard/Services';
import UniquenessPage from '@/pages/dashboard/Uniqueness';
import DashboardPortfolioPage from '@/pages/dashboard/Portfolio';
import PartnersPage from '@/pages/dashboard/Partners';
import GlobalPresencePage from '@/pages/dashboard/GlobalPresence';
import TeamPage from '@/pages/dashboard/Team';
import ContactsPage from '@/pages/dashboard/Contacts';
import AccountSettingsPage from '@/pages/dashboard/AccountSettings';

// Error pages
import NotFoundPage from '@/pages/NotFound';

const routes: RouteObject[] = [
  // Public routes
  { path: '/', element: <HomePage /> },
  { path: '/about-us', element: <AboutPage /> },
  { path: '/our-services', element: <OurServicesPage /> },
  { path: '/portfolio', element: <PortfolioPage /> },
  { path: '/contact-us', element: <ContactUsPage /> },

  // Public-only route (redirects if authenticated)
  {
    path: '/auth/login',
    element: <PublicOnlyRoute />,
    children: [{ path: '', element: <LoginPage /> }],
  },

  // Protected dashboard routes
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      { path: '', element: <DashboardPage /> },
      { path: 'settings', element: <CompanySettingsPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'uniqueness', element: <UniquenessPage /> },
      { path: 'portfolio', element: <DashboardPortfolioPage /> },
      { path: 'partners', element: <PartnersPage /> },
      { path: 'presence', element: <GlobalPresencePage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'contacts', element: <ContactsPage /> },
      { path: 'account-settings', element: <AccountSettingsPage /> },
    ],
  },

  // 404 fallback
  { path: '*', element: <NotFoundPage /> },
];

export default routes;
