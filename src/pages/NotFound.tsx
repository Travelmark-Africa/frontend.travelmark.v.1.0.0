import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-100'>
      <div className='mx-auto flex max-w-fit flex-col items-center justify-center text-center'>
        <span className='text-6xl'>🙁</span>
        <h1 className='text-4xl font-bold text-gray-800'>Page Not Found</h1>
        <p className='mt-2 mb-6 text-lg text-gray-600 '>Oops! The page you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
};

export default NotFound;
