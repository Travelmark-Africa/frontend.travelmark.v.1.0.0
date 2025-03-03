import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import BlurImage from '@/components/BlurImage';
import { Button } from '@/components/ui/button';

interface DestinationGalleryProps {
  destination: Destination;
  navigate: NavigateFunction;
  isMobile: boolean;
}

const DestinationGallery: React.FC<DestinationGalleryProps> = ({ destination, navigate, isMobile }) => {
  const [showAllImages, setShowAllImages] = useState<boolean>(false);
  const displayImages = destination.images.slice(0, isMobile ? 3 : 5);

  return (
    <>
      {showAllImages ? (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4'>
          <button onClick={() => setShowAllImages(false)} className='absolute top-4 right-4 text-white cursor-pointer'>
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
                {isMobile && index === 1 && (
                  <div
                    onClick={() => setShowAllImages(true)}
                    className='absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-all duration-300'
                  >
                    <button className='text-white text-lg font-medium cursor-pointer'>View all</button>
                  </div>
                )}
                {!isMobile && index === displayImages.length - 2 && (
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
    </>
  );
};

export default DestinationGallery;
