import { Box } from 'lucide-react';

const Empty = ({ description = 'There is no data at the moment!' }) => {
  return (
    <div className='flex flex-col items-center justify-center py-32'>
      <Box size={40} className='text-foreground' />
      <p className='mt-4 text-sm text-foreground'>{description}</p>
    </div>
  );
};

export default Empty;
