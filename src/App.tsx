import { useEffect, useState, Suspense } from 'react';
import { toast } from 'sonner';
import { BrowserRouter as Router, useRoutes, useLocation, RouteObject } from 'react-router-dom';
import routes from './routes';

import AuthGuard from './authGuard';
import { getNetworkStatus } from './lib/utils';
import AnimatedFaviconLoader from './components/AnimatedFaviconLoader';
import LoadingProgressManager from './components/LoadingProgressManager';
import RouteChangeTracker from './components/RouteChangeTracker';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ScrollToTop component
const ScrollToTop = (): null => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// AppRoutes component to handle routes with suspense
const AppRoutes = () => {
  // Prepare routes with proper auth guards
  const processedRoutes: RouteObject[] = routes.map(route => {
    if (route.authRequired) {
      return {
        path: route.path,
        element: <AuthGuard />,
        children: [{ path: '', element: route.element }],
      };
    }
    return { ...route };
  });

  // This key forces remounting of Suspense when location changes
  const element = useRoutes(processedRoutes);

  return <LoadingProgressManager>{element}</LoadingProgressManager>;
};

// Main App component
const App = () => {
  const [isOnline, setIsOnline] = useState<boolean>(getNetworkStatus());
  const [isReloaded, setIsReloaded] = useState<boolean>(true);

  useEffect(() => {
    const handleNetworkChange = (): void => {
      setIsOnline(getNetworkStatus());
    };

    window.addEventListener('offline', handleNetworkChange);
    window.addEventListener('online', handleNetworkChange);

    return () => {
      window.removeEventListener('offline', handleNetworkChange);
      window.removeEventListener('online', handleNetworkChange);
    };
  }, []);

  useEffect(() => {
    if (!isReloaded && !isOnline) {
      toast.error("You are offline, some content won't be visible", {
        duration: 2000,
      });
    }
    setIsReloaded(false);
  }, [isReloaded, isOnline]);

  return (
    <Router>
      <ScrollToTop />
      <RouteChangeTracker />
      <Suspense fallback={<AnimatedFaviconLoader />}>
        <div className='antialiased min-h-screen flex flex-col'>
          <Navbar />
          <main className='flex-grow'>
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Suspense>
    </Router>
  );
};

export default App;
