import { Skeleton } from '@/components/ui/skeleton';
import { useGetRegionsQuery } from '@/hooks/useRegions';
import BlurImage from '@/components/BlurImage';
import { Globe } from 'lucide-react';
import Container from '@/components/Container';

const OurPresence = () => {
  const { data: regionsData, isLoading, isError, error } = useGetRegionsQuery();

  const regions = regionsData?.data || [];

  if (isLoading) {
    return (
      <div className='py-16 sm:py-24 pl-16 bg-white'>
        <Container className='grid gap-x-8 gap-y-12 xl:grid-cols-12'>
          <div className='max-w-2xl sm:max-w-none col-span-5'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>WHERE YOU CAN FIND US</h2>
            <p className='mt-6 text-lg leading-8 text-gray-600'>
              Discover our global presence and explore the locations where we provide our exceptional services.
            </p>
          </div>
          <ul role='list' className='grid gap-x-16 gap-y-8 sm:grid-cols-2 sm:gap-y-12 xl:col-span-7'>
            {Array.from({ length: 8 }).map((_, index) => (
              <li key={index}>
                <div className='flex items-center gap-x-3'>
                  <Skeleton className='h-32 w-36 rounded-lg flex-shrink-0' />
                  <div>
                    <Skeleton className='h-6 w-24' />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='py-24 sm:py-32 pl-16 bg-white'>
        <Container className='grid gap-x-8 gap-y-12 px-6 lg:px-8 xl:grid-cols-12'>
          <div className='max-w-2xl sm:max-w-none col-span-5'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>WHERE YOU CAN FIND US</h2>
            <p className='mt-6 text-lg leading-8 text-gray-600'>
              Discover our global presence and explore the locations where we provide our exceptional services.
            </p>
          </div>
          <div className='xl:col-span-7 flex items-center justify-center'>
            <div className='text-center'>
              <Globe className='w-16 h-16 mx-auto text-red-400 mb-4' />
              <p className='text-gray-500'>{error instanceof Error ? error.message : 'Unable to load regions'}</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className='py-24 sm:py-32 pl-16 bg-white'>
      <Container className='grid gap-x-8 gap-y-20 xl:grid-cols-12'>
        <div className='max-w-2xl sm:max-w-none col-span-5'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>WHERE YOU CAN FIND US</h2>
          <p className='mt-6 text-lg leading-8 text-gray-600'>
            Discover our global presence and explore the locations where we provide our exceptional services.
          </p>
        </div>

        {regions.length > 0 ? (
          <ul role='list' className='grid gap-x-16 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-7'>
            {regions.map((region, index) => (
              <li key={region.$id || index}>
                <div className='flex items-center gap-x-3 cursor-default'>
                  <BlurImage
                    src={region.image}
                    alt={region.name}
                    className='h-28 w-32 object-contain rounded-lg flex-shrink-0'
                  />
                  <div>
                    <h3 className='text-base font-semibold leading-7 tracking-tight text-gray-900'>{region.name}</h3>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className='xl:col-span-7 flex items-center justify-center'>
            <div className='text-center'>
              <Globe className='w-16 h-16 mx-auto text-gray-400 mb-4' />
              <p className='text-gray-500'>No regions available</p>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OurPresence;
