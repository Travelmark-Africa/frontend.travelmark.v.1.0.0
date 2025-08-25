import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetUSPsQuery } from '@/hooks/useUSPs';
import { getIconComponent } from '@/constants';
import { AlertCircle } from 'lucide-react';

// Define the Feature type based on API structure
interface Feature {
  $id: string;
  iconName: string;
  title: string;
  description: string;
}

const WhyChooseUs = () => {
  const { data: featuresData, isLoading, isError, error } = useGetUSPsQuery();

  const features = featuresData?.data || [];

  const handleGetStarted = () => {
    const ctaSection = document.getElementById('cta-section');
    if (ctaSection) {
      ctaSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Helper function to render feature cards
  const renderFeatureCard = (feature: Feature) => {
    const IconComponent = getIconComponent(feature.iconName);

    return (
      <div key={feature.$id} className='flex flex-col'>
        <div className='w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4'>
          <IconComponent className='w-6 h-6 text-secondary' />
        </div>
        <h3 className='text-lg font-bold text-primary mb-3'>{feature.title}</h3>
        <p className='text-primary/70 leading-relaxed text-[1rem]'>{feature.description}</p>
      </div>
    );
  };

  // Helper function to render skeleton cards
  const renderSkeletonCard = (key: number) => (
    <div key={key} className='flex flex-col'>
      <div className='w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4'>
        <Skeleton className='w-6 h-6' />
      </div>
      <Skeleton className='h-6 w-32 mb-3' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>
    </div>
  );

  return (
    <section className='py-16 px-6 bg-secondary/10'>
      <div className='max-w-6xl mx-auto'>
        {/* Breadcrumb */}
        <div className='text-secondary text-sm'>Why Choose Us?</div>

        <div className='grid lg:grid-cols-2 gap-16 items-start'>
          {/* Left Column */}
          <div className='lg:pr-6'>
            <h2 className='text-3xl md:text-4xl font-extrabold text-primary mb-4 leading-snug'>
              The Travelmark Africa
              <br />
              Difference
            </h2>

            <p className='text-lg text-primary/70 mb-0 md:mb-4 leading-relaxed max-w-lg'>
              We specialize in unlocking Africa's potential through business tourism, event consulting, and capacity
              development. From concept to execution, our support is always local, tailored, and impact-driven.
            </p>

            <div className='hidden sm:flex flex-col sm:flex-row gap-3 mb-3'>
              <Button
                onClick={handleGetStarted}
                variant='link'
                className='text-secondary! hover:text-secondary/80! font-medium! text-base! transition-colors! duration-500! cursor-pointer! text-left! px-0!'
              >
                Get Started Today
              </Button>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className='grid grid-cols-1 gap-8'>
            {isLoading ? (
              <>
                {/* First Row - Two columns (Loading) */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {Array.from({ length: 2 }).map((_, index) => renderSkeletonCard(index))}
                </div>

                {/* Separator Line */}
                <div className='border-t border-secondary/40'></div>

                {/* Second Row - Two columns (Loading) */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {Array.from({ length: 2 }).map((_, index) => renderSkeletonCard(index + 2))}
                </div>
              </>
            ) : isError ? (
              <div className='flex items-center justify-center h-60'>
                <div className='text-center'>
                  <AlertCircle className='w-16 h-16 mx-auto text-red-400 mb-4' />
                  <p className='text-gray-500'>{error instanceof Error ? error.message : 'Unable to load features'}</p>
                </div>
              </div>
            ) : features.length === 0 ? (
              <div className='flex items-center justify-center h-60'>
                <div className='text-center'>
                  <AlertCircle className='w-16 h-16 mx-auto text-gray-400 mb-4' />
                  <p className='text-gray-500'>No features available</p>
                </div>
              </div>
            ) : (
              <>
                {/* First Row - Two columns */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {features.slice(0, 2).map(renderFeatureCard)}
                </div>

                {/* Separator Line */}
                <div className='border-t border-secondary/40'></div>

                {/* Second Row - Two columns */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {features.slice(2, 4).map(renderFeatureCard)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
