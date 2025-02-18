import { useNavigate } from 'react-router-dom';
import { CircleX } from 'lucide-react';
import { Button } from './ui/button';

const Error = ({ description = 'An error occured, please try again later.' }) => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center justify-center py-16'>
      <CircleX size={40} className='text-red-800' />
      <p className='mt-4 text-sm text-red-800'>{description}</p>
      <Button className='mt-10' onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </div>
  );
};

export default Error;
