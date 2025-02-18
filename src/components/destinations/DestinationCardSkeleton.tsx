import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';

const DestinationCardSkeleton = () => {
  return (
    <div className='col-span-1 group'>
      <div className='flex flex-col gap-2 w-full'>
        {/* Image placeholder */}
        <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
          <Skeleton className='h-full w-full' />

          {/* Favorite Button placeholder */}
          <div className='absolute top-3 right-3'>
            <Heart

              className="h-7 w-7 fill-none stroke-white cursor-pointer transition"
            />
          </div>
        </div>

        {/* Title placeholder */}
        <Skeleton className='w-3/4 h-6 mt-2' />

        {/* Region placeholder */}
        <Skeleton className='w-1/2 h-4' />

        {/* Tag placeholder */}
        <Skeleton className='w-1/3 h-5 rounded-full' />

        {/* Price placeholder */}
        <div className='flex flex-row items-center gap-1'>
          <Skeleton className='w-20 h-5' />
          <Skeleton className='w-40 h-4' />
        </div>
      </div>
    </div>
  );
};

export default DestinationCardSkeleton;