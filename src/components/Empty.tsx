import { cn } from '@/lib/utils';
import { Box } from 'lucide-react';

// Define the props interface
interface EmptyProps {
  description?: string;
  className?: string;
}

const Empty = ({ description = 'There is no data at the moment!', className }: EmptyProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-32', className)}>
      <Box size={40} className='text-foreground' />
      <p className='mt-4 text-sm text-foreground text-center'>{description}</p>
    </div>
  );
};

export default Empty;
