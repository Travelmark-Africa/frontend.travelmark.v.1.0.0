import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BrowserRouter as Router, useRoutes, useLocation } from 'react-router-dom';
import routes from './routes';
import { getNetworkStatus } from './lib/utils';
import LoadingProgressManager from './components/LoadingProgressManager';
import RouteChangeTracker from './components/RouteChangeTracker';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRoutes() {
  const element = useRoutes(routes);
  return <LoadingProgressManager>{element}</LoadingProgressManager>;
}

function AppContent() {
  const isOnline = useNetworkStatus();

  return (
    <div className='antialiased min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-grow'>
        <AppRoutes />
      </main>
      <Footer />

      {/* Network status indicator */}
      {!isOnline && (
        <div className='fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50'>
          <span className='text-sm'>No internet connection</span>
        </div>
      )}
    </div>
  );
}

function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(getNetworkStatus());
  const [hasShownOfflineToast, setHasShownOfflineToast] = useState<boolean>(false);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setHasShownOfflineToast(false);
      toast.success("You're back online!", {
        duration: 2000,
      });
    }

    function handleOffline() {
      setIsOnline(false);
      if (!hasShownOfflineToast) {
        toast.error("You are offline, some content won't be visible", {
          duration: 2000,
        });
        setHasShownOfflineToast(true);
      }
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!isOnline && !hasShownOfflineToast) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, hasShownOfflineToast]);

  return isOnline;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <RouteChangeTracker />
      <AppContent />
    </Router>
  );
}
