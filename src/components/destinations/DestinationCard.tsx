import { useCallback, useMemo, useState } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BlurImage from '../BlurImage';
import { formatPrice } from '@/lib/utils';

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleImageNav = useCallback(
    (e: React.MouseEvent, direction: 'prev' | 'next') => {
      e.stopPropagation();
      if (direction === 'prev') {
        setImageIndex(prev => (prev === 0 ? destination.images.length - 1 : prev - 1));
      } else {
        setImageIndex(prev => (prev === destination.images.length - 1 ? 0 : prev + 1));
      }
    },
    [destination.images.length]
  );

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Add your favorite logic here
  }, []);

  // Safely access price with a default value if undefined
  const price = useMemo(() => {
    return destination.price || 0;
  }, [destination.price]);

  // Safely check if favorites exist and have length
  const isFavorited = useMemo(() => {
    return destination.favorites && destination.favorites.length > 0;
  }, [destination.favorites]);

  // Determine which arrows to show based on hover state and current image index
  const showPrevArrow = isHovering && imageIndex > 0;
  const showNextArrow = isHovering && imageIndex < destination.images.length - 1;

  return (
    <div onClick={() => navigate(`/destination-details/${destination.id}`)} className='col-span-1 cursor-pointer group'>
      <div className='flex flex-col gap-2 w-full'>
        <div
          className='aspect-square w-full relative overflow-hidden rounded-xl'
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Image */}
          <BlurImage
            className='object-cover h-full w-full group-hover:scale-105 transition-all duration-500'
            src={destination.images[imageIndex]}
            alt={`${destination.name} - Image ${imageIndex + 1}`}
          />

          {/* Navigation Arrows - Airbnb style: only visible on hover and position-dependent */}
          {destination.images.length > 1 && (
            <>
              {/* Previous arrow - only visible on hover and if we're not on the first image */}
              {showPrevArrow && (
                <button
                  onClick={e => handleImageNav(e, 'prev')}
                  className='absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 opacity-70 hover:opacity-100 transition-all duration-500 cursor-pointer'
                >
                  <ChevronLeft className='h-5 w-5 text-gray-600' />
                </button>
              )}

              {/* Next arrow - only visible on hover and if we're not on the last image */}
              {showNextArrow && (
                <button
                  onClick={e => handleImageNav(e, 'next')}
                  className='absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 opacity-70 hover:opacity-100 transition-all duration-500 cursor-pointer'
                >
                  <ChevronRight className='h-5 w-5 text-gray-600' />
                </button>
              )}
            </>
          )}

          {/* Image Indicators */}
          {destination.images.length > 1 && (
            <div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1'>
              {destination.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-[7px] w-[7px] rounded-full transition-all ${
                    idx === imageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Favorite Button */}
          <div className='absolute top-3 right-3'>
            <Heart
              onClick={handleFavoriteClick}
              className={`h-7 w-7 ${isFavorited ? 'fill-red-500' : 'fill-none'} stroke-white cursor-pointer transition`}
            />
          </div>
        </div>

        {/* Card Content */}
        <div className='font-semibold text-lg'>
          {destination.name}
          <p className='text-sm'>
            Region: <span className='text-primary/80'>{destination.location}</span>
          </p>
        </div>
        <div className='bg-secondary/10 border-[1px] border-secondary w-fit px-4 py-[1px] rounded-full text-secondary text-xs font-bold'>
          {destination.tag}
        </div>
        {price === 0 ? null : (
          <div className='flex flex-row items-center gap-1'>
            <div className='font-semibold text-[0.8rem]'>
              {destination.price !== 0 && formatPrice(price, destination.currency.code)}
            </div>
            <div className='font-light'>per person per day</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationCard;
