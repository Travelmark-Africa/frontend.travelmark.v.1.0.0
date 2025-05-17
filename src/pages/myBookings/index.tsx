import Container from '@/components/Container';
import Empty from '@/components/Empty';
import Navbar from '@/components/navbar/Navbar';

const MyBookings = () => {
  return (
    <>
      <Navbar />
      <Container>
        {/* Header Section - Always visible */}
        <div className='text-center space-y-2 pb-12'>
          <h4 className='text-4xl font-bold pt-32'>My Bookings</h4>
          <p className='text-gray-600 text-md max-w-lg mx-auto'>
            Track and manage all your confirmed reservations in one place
          </p>
        </div>

        <Empty description="You don't have any bookings at the moment. Start by reserving your destinations" />
      </Container>
    </>
  );
};

export default MyBookings;
