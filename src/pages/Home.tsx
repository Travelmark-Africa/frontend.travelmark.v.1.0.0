import { hero1, logo2 } from '@/assets';
import BlurImage from '@/components/BlurImage';
import { Button } from '@/components/ui/button';
import { Mail, Twitter, Instagram, PlaneTakeoff, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='relative min-h-screen w-full overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 bg-primary/10'>
        <div className='relative w-full h-full'>
          <BlurImage src={hero1} alt='Beautiful destination hero image' className='object-cover w-full h-full' />
        </div>
      </div>

      {/* Overlay */}
      <div className='absolute inset-0 bg-foreground/40 z-0' />

      {/* Logo */}
      <div className='absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 z-50'>
        <div className='relative h-16 sm:h-24 md:h-28 w-[250px] sm:w-[280px]'>
          <img src={logo2} alt='Travelmark logo' className='object-contain w-full h-full' />
        </div>
      </div>

      {/* Main Content */}
      <div className='relative h-screen flex flex-col items-center justify-center container px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-primary-foreground tracking-tight mb-6 text-3xl sm:text-5xl md:text-6xl drop-shadow-lg font-heading'>
            Unforgettable travel experiences <br className='hidden sm:block' /> with a positive impact
          </h1>

          {/* Button Container - Modified for mobile */}
          <div className='flex flex-row justify-center gap-2 sm:gap-4'>
            <Button
              asChild
              className='bg-secondary hover:bg-secondary/80 transition-all duration-500 text-sm sm:text-base  whitespace-nowrap text-white'
            >
              <Link to='/explore'>
                <Globe className='mr-1 h-4 w-4 sm:h-5 sm:w-5' />
                Explore
              </Link>
            </Button>
            <Button
              asChild
              className='bg-secondary hover:bg-secondary/80 transition-all duration-500 text-sm sm:text-base  whitespace-nowrap text-white'
            >
              <Link to='/design-your-trip'>
                <PlaneTakeoff className='mr-1 h-4 w-4 sm:h-5 sm:w-5' />
                Design Your Trip
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Section with Social Links and About Us */}
      <div className='absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4'>
        {/* Social Links */}
        <div className='flex gap-2 sm:gap-4'>
          {[Mail, Twitter, Instagram].map((Icon, index) => (
            <Button
              key={index}
              variant='ghost'
              size='icon'
              className='rounded-full bg-background/10 hover:bg-secondary/80 text-primary-foreground hover:text-white w-8 h-8 sm:w-12 sm:h-12 transition-all duration-500'
            >
              <Icon className='h-3 w-3 sm:h-5 sm:w-5' />
            </Button>
          ))}
        </div>

        <div className='flex gap-3'>
          {/* About Us Link */}
          <Link
            className='text-primary-foreground hover:text-secondary text-sm sm:text-base  transition-all duration-500'
            to='/about-us'
          >
            About Us
          </Link>
          {/* Contact Us Link */}
          <span className='text-white'>|</span>
          <Link
            className='text-primary-foreground hover:text-secondary text-sm sm:text-base  transition-all duration-500'
            to='/contact-us'
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
