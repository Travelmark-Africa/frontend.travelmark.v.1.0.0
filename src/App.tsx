import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import routes from './routes';

import AuthGuard from './authGuard';
import { getNetworkStatus } from './lib/utils';

import DefaultSEO from './components/DefaultSEO';

const App = () => {
  const [isOnline, setIsOnline] = useState(getNetworkStatus());
  const [isReloaded, setIsReloaded] = useState(true);

  useEffect(() => {
    const handleNetworkChange = () => {
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

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  return (
    <Router>
      <DefaultSEO />
      <ScrollToTop />
      <Routes>
        {routes.map(route =>
          route.authRequired ? (
            <Route key={route.path} path={route.path} element={<AuthGuard />}>
              <Route path={route.path} element={route.element} />
            </Route>
          ) : (
            <Route key={route.path} path={route.path} element={route.element} />
          )
        )}
      </Routes>
    </Router>
  );
};

export default App;
