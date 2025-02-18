import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useGetDestinationQuery } from '@/redux/api/apiSlice';
import { Carousel } from 'react-responsive-carousel';
import Container from '@/components/Container';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { Calendar, ChevronLeft, ChevronRight, Star, Users, X } from 'lucide-react';
import Error from '@/components/Error';

interface Destination {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  reviews: { rating: number }[];
  country: {
    code: string;
  };
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  travelDate: Date | null;
  message: string;
}

const Destination = () => {
  const { id } = useParams<{ id: string }>();
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
    console.log('Sending enquiry:', formData);
    alert("Your enquiry has been sent! We'll get back to you soon.");
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      travelDate: null,
      message: '',
    });
  };

  if (isLoading)
    return (
      <Container>
        <div className='flex items-center justify-center min-h-screen'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500'></div>
        </div>
      </Container>
    );

  if (error) return <Error />;

  if (!response?.ok || !response?.data)
    return (
      <Container>
        <div className='p-8 text-center'>
          <div className='bg-gray-50 p-6 rounded-lg'>
            <h2 className='text-xl font-bold text-gray-700 mb-2'>No destination found</h2>
            <p className='text-gray-600'>This destination is not available.</p>
          </div>
        </div>
      </Container>
    );

  const destination: Destination = response.data;
  const displayImages = destination.images.slice(0, 5);
  const averageRating =
    destination.reviews.length > 0
      ? destination.reviews.reduce((acc, review) => acc + review.rating, 0) / destination.reviews.length
      : 0;

  return (
    <Container>
      <div className='w-full py-6'>
        {/* Image Gallery */}
        {showAllImages ? (
          <div className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4'>
            <button onClick={() => setShowAllImages(false)} className='absolute top-4 right-4 text-white'>
              <X size={24} />
            </button>
            <Carousel
              showArrows={true}
              showThumbs={true}
              infiniteLoop={true}
              renderArrowPrev={(onClickHandler, hasPrev) =>
                hasPrev && (
                  <button
                    onClick={onClickHandler}
                    className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 p-2 rounded-r-md hover:bg-white/40 transition'
                  >
                    <ChevronLeft size={24} className='text-white' />
                  </button>
                )
              }
              renderArrowNext={(onClickHandler, hasNext) =>
                hasNext && (
                  <button
                    onClick={onClickHandler}
                    className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 p-2 rounded-l-md hover:bg-white/40 transition'
                  >
                    <ChevronRight size={24} className='text-white' />
                  </button>
                )
              }
              className='w-full max-w-4xl'
            >
              {destination.images.map((image: string, index: number) => (
                <div key={index}>
                  <img src={image} alt={`${destination.name} ${index + 1}`} className='max-h-[80vh] object-contain' />
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 overflow-hidden rounded-lg shadow-lg h-[600px]'>
            <div className='md:col-span-2 relative group h-full'>
              <img src={displayImages[0]} alt={destination.name} className='w-full h-full object-cover' />
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
                  <img src={image} alt={`${destination.name} ${index + 2}`} className='w-full h-full object-cover' />
                  {index === displayImages.length - 2 && (
                    <div
                      onClick={() => setShowAllImages(true)}
                      className='absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-all duration-300'
                    >
                      <button className='text-white text-lg font-medium'>View all</button>
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
            <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
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
            <div className='bg-white border rounded-lg p-6 shadow-md sticky top-4'>
              {destination.price > 0 ? (
                <div className='text-2xl font-bold text-orange-600 mb-4'>
                  {destination.country.code}F {destination.price}
                </div>
              ) : (
                <div className='text-2xl font-bold text-green-600 mb-4'>Free Entry</div>
              )}

              <form onSubmit={handleSendEnquiry} className='space-y-4'>
                <input
                  type='text'
                  name='fullName'
                  placeholder='Full Name'
                  className='w-full p-2 border rounded-md'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  className='w-full p-2 border rounded-md'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
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
                  <div className='absolute z-10 mt-1 bg-white shadow-lg rounded-md p-2'>
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
                <button
                  type='submit'
                  className='w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition'
                >
                  {destination.price > 0 ? 'Book Now' : 'Request Invoice'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Destination;
