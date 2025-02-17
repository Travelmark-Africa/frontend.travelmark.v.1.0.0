import Container from '@/components/Container';
import DestinationCard from '@/components/destinations/DestinationCard';
import Empty from '@/components/Empty';
import { useGetDestinationsQuery } from '@/redux/api/apiSlice';

const Explore = () => {
  // Fetch destinations data using RTK Query
  const { data: destinations, isLoading, isError, error } = useGetDestinationsQuery({});

  // Prepare content based on different states
  let content;

  if (isLoading) {
    content = <div className="pt-24 text-center">Loading destinations...</div>;
  } else if (isError) {
    content = (
      <div className="pt-24 text-center text-red-500">
        Error loading destinations: {'error' in error ? error.error : 'Failed to load destination. Please try again later.'}
      </div>
    );
  } else if (!destinations?.data?.destinations || destinations?.data?.destinations.length === 0) {
    content = <Empty />;
  } else {
    content = (
      <div
        className='
          pt-24
          grid 
          grid-cols-1
          sm:grid-cols-2 
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          2xl:grid-cols-4
          gap-8
        '
      >
        {destinations?.data?.destinations?.map((destination: Destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
          />
        ))}
      </div>
    );
  }

  // Single return statement for all states
  return (
    <Container>
      {content}
    </Container>
  );
};

export default Explore;