import Container from '@/components/Container';
import DestinationCard from '@/components/destinations/DestinationCard';
import DestinationCardSkeleton from '@/components/destinations/DestinationCardSkeleton';
import Empty from '@/components/Empty';
import Navbar from '@/components/navbar/Navbar';
import { useGetDestinationsQuery } from '@/redux/api/apiSlice';

const Explore = () => {
  const { data: destinations, isLoading, isError, error } = useGetDestinationsQuery({});

  // Determine the content based on loading state
  const renderDestinationContent = () => {
    if (isLoading) {
      // Only show skeletons for cards, keep header visible
      const skeletonCards = Array(8).fill(0).map((_, index) => (
        <DestinationCardSkeleton key={`skeleton-${index}`} />
      ));
      
      return (
        <div className='
          grid 
          grid-cols-1
          sm:grid-cols-2 
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          2xl:grid-cols-4
          gap-8
        '>
          {skeletonCards}
        </div>
      );
    } else if (isError) {
      return (
        <div className='text-center text-red-500 mt-8'>
          Error loading destinations:{' '}
          {'error' in error ? error.error : 'Failed to load destination. Please try again later.'}
        </div>
      );
    } else if (!destinations?.data?.destinations || destinations?.data?.destinations.length === 0) {
      return <Empty />;
    } else {
      // Render actual destination cards
      return (
        <div className='
          grid 
          grid-cols-1
          sm:grid-cols-2 
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          2xl:grid-cols-4
          gap-8
        '>
          {destinations?.data?.destinations?.map((destination: Destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        {/* Header Section - Always visible */}
        <div className="text-center space-y-2 pb-12">
          <h4 className="text-4xl font-bold pt-32">Explore Amazing Destinations</h4>
          <p className="text-gray-600 text-md max-w-lg mx-auto">
            Discover breathtaking locations and plan your next adventure
          </p>

          {/* Stats Section - Show loading indicator if needed */}
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600 pt-2">
            {isLoading ? (
              <span>Loading destinations...</span>
            ) : isError ? (
              <span className="text-red-400">Error loading stats</span>
            ) : (
              <>
                <span className="font-semibold">
                  {destinations?.data?.destinations.length} destinations
                </span>
                <span>|</span>
                <span>Updated daily</span>
              </>
            )}
          </div>
        </div>

        {/* Render destination content based on state */}
        {renderDestinationContent()}
      </Container>
    </>
  );
};

export default Explore;