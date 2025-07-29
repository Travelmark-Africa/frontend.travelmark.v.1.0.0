import BlurImage from '@/components/BlurImage';
import { Button } from '@/components/ui/button';
import Container from '@/components/Container';

const HeroSection = () => {
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
            <div className='max-w-2xl'>
              <h1 className='text-white tracking-tight mb-4 md:mb-6 text-3xl md:text-4xl drop-shadow-2xl font-bold leading-tight'>
                Driving Africa’s Growth Through
                <br />
                <span className='text-white'>Business Tourism</span>
              </h1>

              <p className='text-sm sm:text-base md:text-lg text-white/95 mb-6 md:mb-8 max-w-sm md:max-w-lg drop-shadow-lg'>
                Event consultation, MICE strategy, and capacity building tailored for Africa’s business tourism
                potential.
              </p>

              <Button hideChevron={true} className='w-full sm:w-auto'>
                <a
                  href='https://calendly.com/travelmarkafrica/30min?month=2025-07'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-4 py-2'
                >
                  Schedule a meeting
                </a>
              </Button>
            </div>
          </Container>
        </div>

        {/* Floating Step Cards */}
        <div className='absolute bottom-4 md:bottom-8 w-full left-1/2 transform -translate-x-1/2'>
          <Container>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6'>
              {/* Step 01 - Event Consultation */}
              <div className='bg-black/20 backdrop-blur-md rounded-lg p-4 md:p-6 border border-white/20'>
                <div className='text-secondary text-xl md:text-2xl font-bold mb-2 md:mb-3'>01</div>
                {/* <h3 className='text-white font-semibold text-base md:text-lg mb-2'>Event Consultation</h3> */}
                <p className='text-white/90 text-xs md:text-sm'>
                  From concept to execution, we help design and deliver strategic, impactful events.
                </p>
              </div>

              {/* Step 02 - MICE Strategy */}
              <div className='bg-black/20 backdrop-blur-md rounded-lg p-4 md:p-6 border border-white/20'>
                <div className='text-secondary text-xl md:text-2xl font-bold mb-2 md:mb-3'>02</div>
                {/* <h3 className='text-white font-semibold text-base md:text-lg mb-2'>MICE Strategy</h3> */}
                <p className='text-white/90 text-xs md:text-sm'>
                  We craft MICE plans, market destinations, and manage major business events across Africa.
                </p>
              </div>

              {/* Step 03 - Capacity Building */}
              <div className='bg-black/20 backdrop-blur-md rounded-lg p-4 md:p-6 border border-white/20'>
                <div className='text-secondary text-xl md:text-2xl font-bold mb-2 md:mb-3'>03</div>
                {/* <h3 className='text-white font-semibold text-base md:text-lg mb-2'>Capacity Building</h3> */}
                <p className='text-white/90 text-xs md:text-sm'>
                  We empower local talent, foster global partnerships, and promote sustainable tourism.
                </p>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
