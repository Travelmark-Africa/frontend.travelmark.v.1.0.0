import { Button } from '@/components/ui/button';
import { serviceCards, stats } from '@/constants';
import { Link } from 'react-router-dom';

const WhoWeAreSection = () => {
  return (
    <section className='py-16 px-6 bg-white'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-3xl md:text-4xl font-extrabold text-primary'>Who We Are</h2>
          <Link to='about-us' className='hidden md:block'>
            <Button variant='outline' className='transition-all duration-500'>
              Learn More
            </Button>
          </Link>
        </div>

        {/* Description */}
        <div className='mb-12 max-w-4xl'>
          <p className='text-lg text-primary/90 leading-relaxed'>
            TravelMark Africa is a Kigali-based firm driving the future of business tourism across the continent. We
            work with governments, institutions, and partners to shape strategic events, position destinations for
            growth, and build sustainable ecosystems.
          </p>
        </div>

        {/* Service Cards */}
        <div className='grid md:grid-cols-3 gap-8'>
          {serviceCards.map(card => (
            <div key={card.id} className='group relative h-96'>
              <div className='h-full rounded-2xl overflow-hidden bg-gray-200 relative'>
                <img src={card.image} alt={card.alt} className='absolute inset-0 object-cover w-full h-full' />
                <div className='absolute inset-0 bg-black/60 group-hover:opacity-60 transition-opacity duration-300 z-10' />
                <div className='absolute bottom-0 left-0 right-0 p-6 text-white z-20'>
                  <h3 className='text-2xl font-bold mb-2'>{card.title}</h3>
                  <p className='text-white/90 text-sm'>{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div>
          <div className='mt-8 text-center md:hidden'>
            <Link to='about-us'>
              <Button variant='default' className='w-full'>
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className='mt-6 grid md:grid-cols-3 gap-8 text-center'>
          {stats.map(stat => (
            <div key={stat.id} className='p-6'>
              <div className='text-4xl font-bold text-secondary mb-2'>{stat.value}</div>
              <div className='text-primary/80'>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
