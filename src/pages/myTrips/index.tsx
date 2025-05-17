import Container from '@/components/Container';
import Empty from '@/components/Empty';
import Navbar from '@/components/navbar/Navbar';

const MyTrips = () => {
  return (
    <>
      <Navbar />
      <Container>
        {/* Header Section - Always visible */}
        <div className='text-center space-y-2 pb-12'>
          <h4 className='text-4xl font-bold pt-32'>My Trip Plans</h4>
          <p className='text-gray-600 text-md max-w-lg mx-auto'>
            View and manage all your upcoming adventures in one place
          </p>
        </div>

        <Empty description="You don't have any trip plans yet. Start creating your dream vacation itinerary!" />
      </Container>
    </>
  );
};

export default MyTrips;
