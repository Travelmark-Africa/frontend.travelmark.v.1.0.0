import { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProjectsQuery } from '@/hooks/useProjectsQuery';
import BlurImage from '@/components/BlurImage';

const ModernCardCarousel = () => {
  const { data: projectsData, isLoading, isError, error } = useGetProjectsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = projectsData?.data || [];

  const nextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + projects.length) % projects.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div className='w-full min-h-screen bg-white flex items-center justify-center pt-16 px-6'>
        <div className='max-w-6xl w-full'>
          {/* Header */}
          <div className='text-center mb-12'>
            <p className='text-base text-primary/70 mb-4'>Our Expertise</p>
            <h2 className='text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug'>
              Unlocking Africa's Potential Through
              <br />
              <span className='text-secondary italic'>Strategic Excellence</span>
            </h2>
            <p className='text-base text-primary/70 max-w-2xl mx-auto leading-relaxed'>
              Discover how our involvement in high-impact events reflects our commitment to smart coordination, African
              innovation, and lasting partnerships.
            </p>
          </div>

          {/* Carousel Container - Loading */}
          <div className='relative'>
            <div className='overflow-hidden rounded-2xl shadow-2xl'>
              <div className='w-full h-[500px] relative'>
                <Skeleton className='absolute inset-0 w-full h-full' />
                <div className='absolute inset-0 bg-black/60' />
                <div className='relative h-full flex flex-col justify-between p-8 md:p-12'>
                  <div>
                    <Skeleton className='w-32 h-8 rounded-full' />
                  </div>
                  <div className='space-y-6'>
                    <Skeleton className='h-8 w-3/4' />
                    <Skeleton className='w-32 h-12 rounded-full' />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Navigation Arrows */}
            <div className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white/50 z-10'>
              <ChevronLeft className='w-5 h-5' />
            </div>
            <div className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white/50 z-10'>
              <ChevronRight className='w-5 h-5' />
            </div>
          </div>

          {/* Loading Dots */}
          <div className='flex justify-center mt-8 space-x-2'>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className='w-2 h-2 rounded-full' />
            ))}
          </div>

          {/* Loading Counter */}
          <div className='text-center mt-4'>
            <Skeleton className='h-4 w-16 mx-auto' />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='w-full min-h-screen bg-white flex items-center justify-center pt-16 px-6'>
        <div className='max-w-6xl w-full'>
          {/* Header */}
          <div className='text-center mb-12'>
            <p className='text-base text-primary/70 mb-4'>Our Expertise</p>
            <h2 className='text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug'>
              Unlocking Africa's Potential Through
              <br />
              <span className='text-secondary italic'>Strategic Excellence</span>
            </h2>
            <p className='text-base text-primary/70 max-w-2xl mx-auto leading-relaxed'>
              Discover how our involvement in high-impact events reflects our commitment to smart coordination, African
              innovation, and lasting partnerships.
            </p>
          </div>

          {/* Error State */}
          <div className='flex items-center justify-center h-[500px] bg-gray-50 rounded-2xl'>
            <div className='text-center'>
              <AlertCircle className='w-16 h-16 mx-auto text-red-400 mb-4' />
              <p className='text-gray-500 text-lg mb-2'>Unable to load projects</p>
              <p className='text-gray-400 text-sm'>
                {error instanceof Error ? error.message : 'Please try again later'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className='w-full min-h-screen bg-white flex items-center justify-center pt-16 px-6'>
        <div className='max-w-6xl w-full'>
          {/* Header */}
          <div className='text-center mb-12'>
            <p className='text-base text-primary/70 mb-4'>Our Expertise</p>
            <h2 className='text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug'>
              Unlocking Africa's Potential Through
              <br />
              <span className='text-secondary italic'>Strategic Excellence</span>
            </h2>
            <p className='text-base text-primary/70 max-w-2xl mx-auto leading-relaxed'>
              Discover how our involvement in high-impact events reflects our commitment to smart coordination, African
              innovation, and lasting partnerships.
            </p>
          </div>

          {/* Empty State */}
          <div className='flex items-center justify-center h-[500px] bg-gray-50 rounded-2xl'>
            <div className='text-center'>
              <Globe className='w-16 h-16 mx-auto text-gray-400 mb-4' />
              <p className='text-gray-500 text-lg'>No projects available</p>
              <p className='text-gray-400 text-sm'>Check back later for updates on our latest work</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-white flex items-center justify-center pt-16 px-6'>
      <div className='max-w-6xl w-full'>
        {/* Header */}
        <div className='text-center mb-12'>
          <p className='text-base text-primary/70 mb-4'>Our Expertise</p>
          <h2 className='text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug'>
            Unlocking Africa's Potential Through
            <br />
            <span className='text-secondary italic'>Strategic Excellence</span>
          </h2>
          <p className='text-base text-primary/70 max-w-2xl mx-auto leading-relaxed'>
            Discover how our involvement in high-impact events reflects our commitment to smart coordination, African
            innovation, and lasting partnerships.
          </p>
        </div>

        {/* Carousel Container */}
        <div className='relative'>
          <div className='overflow-hidden rounded-2xl shadow-2xl'>
            <div
              className='flex transition-transform duration-700 ease-in-out'
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {projects.map((project, index) => (
                <div key={project.$id || index} className='w-full flex-shrink-0 relative h-[500px] group'>
                  {/* Background Image */}
                  <div className='absolute inset-0 transition-transform duration-700 group-hover:scale-[1.01]'>
                    <BlurImage src={project.image} alt={project.title} className='w-full h-full object-cover' />
                  </div>

                  {/* Dark Overlay for better text readability */}
                  <div className='absolute inset-0 bg-black/60' />

                  {/* Content */}
                  <div className='relative h-full flex flex-col justify-between p-8 md:p-12'>
                    <div>
                      <span className='inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-[0.87rem] font-medium text-white border border-white/30'>
                        {project.category}
                      </span>
                    </div>

                    <div className='space-y-6'>
                      <div>
                        <h3 className='text-2xl md:text-3xl font-bold text-white leading-snug max-w-2xl mb-2'>
                          {project.title}
                        </h3>
                        {project.subtitle && <p className='text-lg text-white/80 mb-3'>{project.subtitle}</p>}
                        <div className='flex items-center space-x-4 text-sm text-white/70'>
                          <span>{project.impact}</span>
                          <span>•</span>
                          <span>{project.location}</span>
                          <span>•</span>
                          <span>{project.year}</span>
                        </div>
                      </div>

                      <Link to='portfolio'>
                        <button className='group/btn inline-flex items-center px-6 py-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium hover:bg-white/25 transition-all duration-300 text-[0.87rem] cursor-pointer'>
                          Learn More
                          <ChevronRight className='ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform' />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {projects.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-10'
              >
                <ChevronLeft className='w-5 h-5' />
              </button>

              <button
                onClick={nextSlide}
                className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-10'
              >
                <ChevronRight className='w-5 h-5' />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {projects.length > 1 && (
          <div className='flex justify-center mt-8 space-x-2'>
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary scale-125 w-6' : 'bg-primary/40 hover:bg-primary/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Card Counter */}
        {projects.length > 0 && (
          <div className='text-center mt-4'>
            <span className='text-primary/70 text-[0.87rem]'>
              {currentIndex + 1} of {projects.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernCardCarousel;
