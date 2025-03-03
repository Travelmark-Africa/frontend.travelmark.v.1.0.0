import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetDestinationQuery } from '@/redux/api/apiSlice';
import Container from '@/components/Container';
import Navbar from '@/components/navbar/Navbar';
import Error from '@/components/Error';
import DestinationGallery from './DestinationGallery';
import DestinationInfo from './DestinationInfo';
import BookingForm from './BookingForm';
import DestinationSkeleton from './DestinationSkeleton';

const Destination = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetDestinationQuery(id);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <DestinationSkeleton />;
    }

    if (error)
      return (
        <div className='pt-20 md:pt-32'>
          <Error />
        </div>
      );

    if (!response?.ok || !response?.data) {
      return (
        <div className='p-8 text-center'>
          <div className='bg-gray-50 p-6 rounded-lg'>
            <h2 className='text-xl font-bold text-gray-700 mb-2'>No destination found</h2>
            <p className='text-gray-600'>This destination is not available.</p>
          </div>
        </div>
      );
    }

    const destination: Destination = response.data;

    return (
      <div className='w-full pt-20 md:pt-32'>
        <DestinationGallery destination={destination} navigate={navigate} isMobile={isMobile} />

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='lg:col-span-1'>
            <DestinationInfo destination={destination} />
          </div>

          {/* Booking Panel */}
          <div className='lg:col-span-1'>
            <BookingForm destination={destination} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <Container>{renderContent()}</Container>
      <style>
        {`
        .custom-carousel .thumbs-wrapper {
          margin: 20px 0 0 0 !important;
          overflow-x: auto !important;
        }
        .custom-carousel .thumbs {
          display: flex !important;
          justify-content: flex-start !important;
          padding: 0 !important;
          transform: none !important;
        }
        .custom-carousel .thumb {
          margin-right: 8px !important;
          border: 2px solid transparent !important;
          border-radius: 4px !important;
          transition: all 0.3s !important;
          padding: 0 !important;
        }
        .custom-carousel .thumb.selected {
          border: 2px solid #ff7e1d !important;
        }
        .custom-carousel .thumb:hover {
          border-color: #ffaa66 !important;
        }

        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: repeat(2, 1fr);
          }
          .grid-cols-2 > div:nth-child(n+3) {
            display: none;
          }
          .view-more-button {
            display: block;
            width: 100%;
            text-align: center;
            margin-top: 16px;
          }
        }
      `}
      </style>
    </>
  );
};

export default Destination;
