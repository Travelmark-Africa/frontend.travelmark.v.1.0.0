import { cn } from '@/lib/utils';

const Loader = ({ className = 'h-screen', loadingText = 'Checking authentication, please wait...' }) => {
  return (
    <div className={cn('flex w-full flex-col items-center justify-center space-y-4 bg-white', className)}>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600'></div>
      <p className='text-sm text-gray-600'>{loadingText}</p>
    </div>
  );
};

export default Loader;
