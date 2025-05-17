import Container from '@/components/Container';
import Empty from '@/components/Empty';
import Navbar from '@/components/navbar/Navbar';

const MyFavorites = () => {
  return (
    <>
      <Navbar />
      <Container>
        {/* Header Section - Always visible */}
        <div className='text-center space-y-2 pb-12'>
          <h4 className='text-4xl font-bold pt-32'>My Favorite Destinations</h4>
          <p className='text-gray-600 text-md max-w-lg mx-auto'>
            All your dream destinations saved in one convenient collection
          </p>
        </div>

        <Empty description="You haven't saved any favorite destinations yet. Explore our listings and heart the places you'd love to visit!" />
      </Container>
    </>
  );
};

export default MyFavorites;
