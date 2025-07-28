import { Button } from '@/components/ui/button';
import { Calendar, Award, Star, Users } from 'lucide-react';

const WhyChooseUs = () => {
  const handleGetStarted = () => {
    const ctaSection = document.getElementById('cta-section');
    if (ctaSection) {
      ctaSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

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
            {/* First Row - Two columns */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Deep Regional Expertise */}
              <div className='flex flex-col'>
                <div className='w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4'>
                  <Award className='w-6 h-6 text-secondary' />
                </div>
                <h3 className='text-lg font-bold text-primary mb-3'>Deep Regional Expertise</h3>
                <p className='text-primary/70 leading-relaxed text-[1rem]'>
                  With teams across Africa, we bring localized knowledge, cultural fluency, and regional market insights
                  into every project we deliver.
                </p>
              </div>

              {/* Tailored Strategies */}
              <div className='flex flex-col'>
                <div className='w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4'>
                  <Calendar className='w-6 h-6 text-secondary' />
                </div>
                <h3 className='text-lg font-bold text-primary mb-3'>Tailored Strategies</h3>
                <p className='text-primary/70 leading-relaxed text-[1rem]'>
                  No one-size-fits-all. Every country, institution, or event gets a custom roadmap based on its unique
                  goals, audience, and strengths.
                </p>
              </div>
            </div>

            {/* Separator Line */}
            <div className='border-t border-secondary/40'></div>

            {/* Second Row - Two columns */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Reliable Local Networks */}
              <div className='flex flex-col'>
                <div className='w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4'>
                  <Users className='w-6 h-6 text-secondary' />
                </div>
                <h3 className='text-lg font-bold text-primary mb-3'>Reliable Local Networks</h3>
                <p className='text-primary/70 leading-relaxed text-[1rem]'>
                  We work with vetted vendors, suppliers, and facilitators in every region—ensuring quality delivery
                  with zero guesswork or delays.
                </p>
              </div>

              {/* End-to-End Support */}
              <div className='flex flex-col'>
                <div className='w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4'>
                  <Star className='w-6 h-6 text-secondary' />
                </div>
                <h3 className='text-lg font-bold text-primary mb-3'>End-to-End Execution</h3>
                <p className='text-primary/70 leading-relaxed text-[1rem]'>
                  From strategy and planning to on-site coordination and post-event review—we stay with you every step
                  of the journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
