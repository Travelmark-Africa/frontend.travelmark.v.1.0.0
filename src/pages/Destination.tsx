import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useGetDestinationQuery } from '@/redux/api/apiSlice';
import { Carousel } from 'react-responsive-carousel';
import Container from '@/components/Container';
import Navbar from '@/components/navbar/Navbar';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Star, Users, X } from 'lucide-react';
import Error from '@/components/Error';
import { Skeleton } from '@/components/ui/skeleton';
import BlurImage from '@/components/BlurImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  travelDate: Date | null;
  message: string;
}

const Destination = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetDestinationQuery(id);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [travelerCount, setTravelerCount] = useState<number>(1);
  const [showAllImages, setShowAllImages] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    travelDate: null,
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    setFormData(prev => ({ ...prev, travelDate: date }));
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Your enquiry has been sent! We'll get back to you soon.");
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      travelDate: null,
      message: '',
    });
  };

  const renderContent = () => {
    if (isLoading) {
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
    const displayImages = destination.images.slice(0, 5);
    const averageRating =
      destination.reviews.length > 0
        ? destination.reviews.reduce((acc, review) => acc + review.rating, 0) / destination.reviews.length
        : 0;

    return (
      <div className='w-full pt-20 md:pt-32'>
        {/* Image Gallery */}
        {showAllImages ? (
          <div className='fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4'>
            <button
              onClick={() => setShowAllImages(false)}
              className='absolute top-4 right-4 text-white cursor-pointer'
            >
              <X size={24} />
            </button>
            <div className='max-w-5xl w-full'>
              <Carousel
                showArrows={true}
                showThumbs={true}
                infiniteLoop={true}
                thumbWidth={100}
                selectedItem={0}
                renderArrowPrev={(onClickHandler, hasPrev) =>
                  hasPrev && (
                    <button
                      onClick={onClickHandler}
                      className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 p-2 rounded-md overflow-hidden hover:bg-white/40 transition'
                    >
                      <ChevronLeft size={24} className='text-white' />
                    </button>
                  )
                }
                renderArrowNext={(onClickHandler, hasNext) =>
                  hasNext && (
                    <button
                      onClick={onClickHandler}
                      className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 p-2 rounded-md overflow-hidden hover:bg-white/40 transition'
                    >
                      <ChevronRight size={24} className='text-white' />
                    </button>
                  )
                }
                renderThumbs={() =>
                  destination.images.map((image, index) => (
                    <div key={index} className='h-20 w-full'>
                      <BlurImage src={image} alt={`thumbnail-${index}`} className='h-full w-full object-cover' />
                    </div>
                  ))
                }
                className='w-full custom-carousel'
              >
                {destination.images.map((image: string, index: number) => (
                  <div key={index} className='h-[70vh] flex items-center justify-center'>
                    <BlurImage
                      src={image}
                      alt={`${destination.name} ${index + 1}`}
                      className='max-h-full max-w-full object-contain'
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 overflow-hidden rounded-lg h-[600px]'>
            <div className='md:col-span-2 relative group h-full'>
              <Button
                onClick={() => navigate('/explore')}
                className='absolute h-10 w-10 top-4 left-4 z-10 bg-white/90 p-2 rounded-full hover:bg-white transition'
              >
                <ArrowLeft size={20} className='text-gray-800' />
              </Button>
              <BlurImage src={displayImages[0]} alt={destination.name} className='w-full h-full object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end'>
                <div className='p-4 text-white'>
                  <h3 className='text-xl font-bold'>{destination.name}</h3>
                  <p>{destination.location}</p>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4 h-full'>
              {displayImages.slice(1).map((image, index) => (
                <div key={index} className='relative overflow-hidden rounded-md group h-[290px]'>
                  <BlurImage
                    src={image}
                    alt={`${destination.name} ${index + 2}`}
                    className='w-full h-full object-cover'
                  />
                  {index === displayImages.length - 2 && (
                    <div
                      onClick={() => setShowAllImages(true)}
                      className='absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-all duration-300'
                    >
                      <button className='text-white text-lg font-medium cursor-pointer'>View all</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='bg-white p-6 rounded-lg mb-6'>
              <h1 className='text-3xl font-bold mb-4'>{destination.name}</h1>
              <p className='text-gray-700'>{destination.description}</p>
              <div className='mt-4 flex items-center'>
                <Star size={18} className='text-orange-500 mr-1' fill='currentColor' />
                <span className='font-medium'>{averageRating.toFixed(1)}</span>
                <span className='text-gray-500 ml-1'>({destination.reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className='lg:col-span-1'>
            <div className='bg-white border rounded-lg p-6 sticky top-4'>
              {destination.price > 0 ? (
                <div className='text-2xl font-bold text-orange-600 mb-4'>
                  {destination.country.code}F {destination.price}
                </div>
              ) : (
                <h4 className='text-2xl font-bold mb-4'>Fill this form</h4>
              )}

              <form onSubmit={handleSendEnquiry} className='space-y-4'>
                <Input
                  type='text'
                  name='fullName'
                  placeholder='Full Name'
                  className='w-full p-2 border rounded-md'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type='email'
                  name='email'
                  placeholder='Email'
                  className='w-full p-2 border rounded-md'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type='tel'
                  name='phone'
                  placeholder='Phone'
                  className='w-full p-2 border rounded-md'
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <div
                  onClick={() => setShowDatePicker(true)}
                  className='w-full p-2 border rounded-md flex items-center cursor-pointer'
                >
                  <Calendar size={16} className='text-gray-500 mr-2' />
                  <span>{selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}</span>
                </div>
                {showDatePicker && (
                  <div className='absolute z-10 mt-1 bg-white rounded-md p-2'>
                    <DatePicker selected={selectedDate} onChange={handleDateChange} minDate={new Date()} inline />
                  </div>
                )}
                <div className='flex items-center border rounded-md p-2'>
                  <Users size={16} className='text-gray-500 mr-2' />
                  <button
                    type='button'
                    className='px-2 py-1 bg-gray-100 rounded-md'
                    onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                  >
                    -
                  </button>
                  <span className='mx-4'>{travelerCount}</span>
                  <button
                    type='button'
                    className='px-2 py-1 bg-gray-100 rounded-md'
                    onClick={() => setTravelerCount(travelerCount + 1)}
                  >
                    +
                  </button>
                </div>
                <textarea
                  name='message'
                  placeholder='Message'
                  className='w-full p-2 border rounded-md h-24 resize-none'
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
                <Button
                  type='submit'
                  className='py-6 w-full bg-primary text-white rounded-md hover:bg-primary/90 transition'
                >
                  {destination.price > 0 ? 'Book Now' : 'Request Invoice'}
                </Button>
              </form>
            </div>
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
