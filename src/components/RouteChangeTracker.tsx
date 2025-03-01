import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

let nprogessTimeout: number | null = null;

const RouteChangeTracker = (): null => {
  const location = useLocation();

  useEffect(() => {
    // Clear any existing timeouts to prevent multiple progress bars
    if (nprogessTimeout) {
      clearTimeout(nprogessTimeout);
    }
    
    // Start NProgress
    NProgress.start();
    
    // Set a timeout to ensure NProgress completes
    nprogessTimeout = window.setTimeout(() => {
      NProgress.done();
      nprogessTimeout = null;
    }, 500);
    
    // Cleanup function
    return () => {
      if (nprogessTimeout) {
        clearTimeout(nprogessTimeout);
      }
      NProgress.done();
    };
  }, [location.pathname]);

  return null;
};

export default RouteChangeTracker;