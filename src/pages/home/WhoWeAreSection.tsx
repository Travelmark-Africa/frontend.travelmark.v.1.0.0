import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { serviceCards } from '@/constants';
import { useGetCompanySettingsQuery } from '@/hooks/useCompanySettings';
import { Link } from 'react-router-dom';

const WhoWeAreSection = () => {
  // Fetch company settings for statistics
  const { data: companySettingsData, isLoading: isLoadingSettings } = useGetCompanySettingsQuery();
  const companySettings = companySettingsData?.data;

  // Parse statistics from company settings
  // Assuming statistics is stored as JSON string in the API
  const parseStatistics = (statisticsString: string): Statistic[] => {
    try {
      return JSON.parse(statisticsString) as Statistic[];
    } catch {
      // If not valid JSON, return empty array
      return [];
    }
  };

  const stats = companySettings?.statistics ? parseStatistics(companySettings.statistics) : [];

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
            {companySettings?.description ||
              'TravelMark Africa is a Kigali-based firm driving the future of business tourism across the continent. We work with governments, institutions, and partners to shape strategic events, position destinations for growth, and build sustainable ecosystems.'}
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
          {isLoadingSettings ? (
            // Show skeletons while loading stats
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className='p-6'>
                <Skeleton className='h-10 w-20 mx-auto mb-2 bg-gray-200' />
                <Skeleton className='h-5 w-52 mx-auto bg-gray-200' />
              </div>
            ))
          ) : stats.length > 0 ? (
            // Show dynamic stats from API
            stats.map((stat: Statistic, index: number) => (
              <div key={stat.id || index} className='p-6'>
                <div className='text-4xl font-bold text-secondary mb-2'>{stat.value}</div>
                <div className='text-primary/80'>{stat.key}</div>
              </div>
            ))
          ) : (
            // Fallback message if no stats configured
            <div className='col-span-full text-center py-8'>
              <p className='text-gray-500'>No statistics configured yet</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
