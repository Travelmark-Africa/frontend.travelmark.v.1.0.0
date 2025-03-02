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

    // Force progress to complete after a reasonable timeout
    const timer = setTimeout(() => {
      NProgress.done();
    }, 800);

    // Complete the progress once children are mounted
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, []);

  return <>{children}</>;
};

export default LoadingProgressManager;
