import { useEffect, ReactNode } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

interface LoadingProgressManagerProps {
  children: ReactNode;
}

NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200
});

const LoadingProgressManager = ({ children }: LoadingProgressManagerProps) => {
  useEffect(() => {
    NProgress.start();
    
    // Complete the progress once children are mounted
    return () => {
      NProgress.done();
    };
  }, []);

  return <>{children}</>;
};

export default LoadingProgressManager;