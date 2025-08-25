import { useGetCompanySettingsQuery } from '@/hooks/useCompanySettings';
import { useGetServicesQuery } from '@/hooks/useServices';
import BlurImage from '@/components/BlurImage';
import { Button } from '@/components/ui/button';
import Container from '@/components/Container';
import { Skeleton } from '@/components/ui/skeleton';

const HeroSection = () => {
  const { data: companySettingsData, isLoading: isLoadingSettings } = useGetCompanySettingsQuery();
  const { data: servicesData, isLoading: isLoadingServices } = useGetServicesQuery();

  const companySettings = companySettingsData?.data;
  const services = servicesData?.data || [];

  // Filter services that have homepage hero step descriptions and sort by creation date
  const heroStepServices = services
    .filter(service => service.homepageHeroStepDescriptionText?.trim())
    .sort((a, b) => {
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateA - dateB; // Oldest first for consistent ordering
    })
    .slice(0, 3); // Limit to 3 services for the hero section

  const handleCalendlyClick = () => {
    window.open(companySettings?.calendlyLink, '_blank');
  };

  // Loading skeleton for step cards
  const StepCardsSkeleton = () => (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4'>
      {[1, 2, 3].map(index => (
        <div key={index} className='relative bg-black/20 backdrop-blur-md rounded-lg p-4 md:p-4 border border-white/20'>
          <div className='absolute top-2 right-2'>
            <Skeleton className='h-6 w-6 bg-white/20' />
          </div>
          <div className='pr-8'>
            <Skeleton className='h-4 w-full mb-2 bg-white/20' />
            <Skeleton className='h-4 w-full mb-2 bg-white/20' />
            <Skeleton className='h-4 w-3/4 bg-white/20' />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Hero Section */}
      <div className='relative min-h-screen w-full overflow-hidden'>
        {/* Background Image */}
        <div className='absolute inset-0 bg-primary/10'>
          <div className='relative w-full h-full'>
            <BlurImage
              src='https://res.cloudinary.com/dsubfxzdx/image/upload/v1752918941/hero1_tsdnpy.jpg'
              alt='Business tourism in Africa'
              className='object-cover w-full h-full'
            />
          </div>
        </div>

        {/* Overlay */}
        <div className='absolute inset-0 bg-black/40 z-0' />

        {/* Main Content */}
        <div className='relative h-screen pt-32 md:pt-40 lg:pt-48 pb-60'>
          <Container>
            <div className='max-w-3xl'>
              <h1 className='text-white tracking-tight mb-4 md:mb-6 text-[2rem] md:text-[2.7rem] drop-shadow-2xl font-bold leading-tight'>
                Driving Africa's Growth Through
                <br />
                <span className='text-white'>Business Tourism</span>
              </h1>

              <p className='text-sm sm:text-base md:text-lg text-white/95 mb-6 md:mb-8 max-w-sm md:max-w-lg drop-shadow-lg'>
                Event consultation, MICE strategy, and capacity building tailored for Africa's business tourism
                potential.
              </p>

              <Button
                onClick={handleCalendlyClick}
                disabled={isLoadingSettings}
                hideChevron={true}
                className='w-full sm:w-auto text-[1rem]! px-8'
              >
                Schedule a meeting
              </Button>
            </div>
          </Container>
        </div>

        {/* Floating Step Cards */}
        <div className='absolute bottom-4 md:bottom-8 w-full left-1/2 transform -translate-x-1/2'>
          <Container>
            {isLoadingServices ? (
              <StepCardsSkeleton />
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4'>
                {heroStepServices.map((service, index) => (
                  <div
                    key={service.$id}
                    className='relative bg-black/20 backdrop-blur-md rounded-lg p-3 md:p-4 border border-white/20'
                  >
                    <div className='absolute top-2 right-2 text-secondary text-lg md:text-xl font-bold'>
                      {index + 1}
                    </div>
                    <p className='text-white/90 text-sm md:text-base pr-8 leading-relaxed'>
                      {service.homepageHeroStepDescriptionText}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
