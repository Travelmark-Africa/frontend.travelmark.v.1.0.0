import { useEffect, useState, Suspense } from 'react';
import { toast } from 'sonner';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import routes from './routes';

import AuthGuard from './authGuard';
import { getNetworkStatus } from './lib/utils';
import DefaultSEO from './components/DefaultSEO';
import AnimatedFaviconLoader from './components/AnimatedFaviconLoader';
import LoadingProgressManager from './components/LoadingProgressManager';
import RouteChangeTracker from './components/RouteChangeTracker';

// ScrollToTop component
const ScrollToTop = (): null => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
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
      toast("You are offline, some content won't be visible", {
        duration: 2000,
      });
    }
    setIsReloaded(false);
  }, [isReloaded, isOnline]);

  return (
    <Router>
      <DefaultSEO />
      <ScrollToTop />
      <RouteChangeTracker />
      <Suspense 
        fallback={
          <LoadingProgressManager>
            <AnimatedFaviconLoader />
          </LoadingProgressManager>
        }
      >
        <Routes>
          {routes.map((route) =>
            route.authRequired ? (
              <Route key={route.path} path={route.path} element={<AuthGuard />}>
                <Route path={route.path} element={route.element} />
              </Route>
            ) : (
              <Route key={route.path} path={route.path} element={route.element} />
            )
          )}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;