import { Skeleton } from '@/components/ui/skeleton';

const DestinationSkeleton = () => {
  return (
    <div className='w-full pt-20 md:pt-32'>
      {/* Skeleton Image Gallery */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 h-[600px]'>
        <div className='md:col-span-2 relative h-full'>
          <Skeleton className='w-full h-full rounded-lg' />
        </div>
        <div className='grid grid-cols-2 gap-4 h-full'>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className='w-full h-[290px] rounded-md' />
            ))}
        </div>
      </div>

      {/* Skeleton Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <div className='bg-white p-6 rounded-lg mb-6'>
            <Skeleton className='h-10 w-3/4 mb-4' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-3/4 mb-4' />
            <div className='flex items-center'>
              <Skeleton className='h-5 w-24 rounded-md' />
            </div>
          </div>
        </div>

        {/* Skeleton Booking Panel */}
        <div className='lg:col-span-1'>
          <div className='bg-white border rounded-lg p-6'>
            <Skeleton className='h-8 w-1/2 mb-4' />
            <div className='space-y-4'>
              <Skeleton className='h-10 w-full rounded-md' />
              <Skeleton className='h-10 w-full rounded-md' />
              <Skeleton className='h-10 w-full rounded-md' />
              <Skeleton className='h-10 w-full rounded-md' />
              <Skeleton className='h-10 w-full rounded-md' />
              <Skeleton className='h-24 w-full rounded-md' />
              <Skeleton className='h-12 w-full rounded-md' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationSkeleton;
