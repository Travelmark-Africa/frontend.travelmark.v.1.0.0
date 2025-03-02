import { useEffect, ReactNode } from 'react';
import NProgress from 'nprogress';
import 'nprogress';

interface LoadingProgressManagerProps {
  children: ReactNode;
}

NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
});

const LoadingProgressManager = ({ children }: LoadingProgressManagerProps) => {
  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    // Complete the progress once children are mounted
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, []);

  return <>{children}</>;
};

export default LoadingProgressManager;
