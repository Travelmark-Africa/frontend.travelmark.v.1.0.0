import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle } from 'lucide-react';

const CallToAction = () => {
  const handleCalendlyClick = () => {
    window.open('https://calendly.com/travelmarkafrica/30min', '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/250788357850', '_blank');
  };

  return (
    <section className='py-16 px-6 bg-white min-h-[60vh] flex items-center justify-center' id='cta-section'>
      <div className='max-w-3xl mx-auto text-center'>
        {/* Tagline */}
        <p className='text-base text-primary/70 mb-4'>Strategy. Events. Growth.</p>

        {/* Main Heading */}
        <h1 className='text-3xl md:text-4xl font-bold text-primary mb-8 leading-snug'>
          Unlock Your Country’s <br />
          Business Potential <span className='text-secondary italic'>with Us</span>
        </h1>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <Button onClick={handleCalendlyClick} size='sm' className='text-[0.85rem]!'>
            <Calendar size={20} />
            Book a Strategy Call
          </Button>

          <Button
            hideChevron
            size='sm'
            onClick={handleWhatsAppClick}
            className='border-1! border-green-300! hover:border-green-400! bg-green-100! hover:bg-green-200! text-green-800! hover:text-green-900! transition-colors! duration-500 text-[0.87rem]!'
          >
            <MessageCircle size={20} />
            Chat with Our Team
          </Button>
        </div>

        {/* Subtitle */}
        <p className='text-primary/70 mt-6 text-base'>
          Let’s build strong strategies, impactful events, and skilled ecosystems across Africa.
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
