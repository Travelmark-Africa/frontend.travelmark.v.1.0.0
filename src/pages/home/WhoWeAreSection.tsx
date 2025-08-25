import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCompanySettingsQuery } from '@/hooks/useCompanySettings';
import { useGetServicesQuery } from '@/hooks/useServices';
import { getIconComponent } from '@/constants';
import { Link } from 'react-router-dom';

// Interface for statistics
interface Statistic {
  id?: string;
  key: string;
  value: string;
}

const WhoWeAreSection = () => {
  // Fetch company settings for statistics and description
  const { data: companySettingsData, isLoading: isLoadingSettings } = useGetCompanySettingsQuery();
  const { data: servicesData, isLoading: isLoadingServices } = useGetServicesQuery();

  const companySettings = companySettingsData?.data;
  const services = servicesData?.data || [];

  // Filter and prepare services for homepage cards
  const homepageServiceCards = services
    .filter(service => service.homepageCardTitleText?.trim() && service.homepageCardDescriptionText?.trim())
    .sort((a, b) => {
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 3);

  // Parse statistics from company settings
  const parseStatistics = (statisticsString: string): Statistic[] => {
    try {
      return JSON.parse(statisticsString) as Statistic[];
    } catch {
      return [];
    }
  };

  const stats = companySettings?.statistics ? parseStatistics(companySettings.statistics) : [];

  // Helper function to render service icon
  const renderServiceIcon = (iconName: string) => {
    const IconComponent = getIconComponent(iconName);
    return <IconComponent className='w-16 h-16 text-white' />;
  };

  // Loading skeleton for service cards
  const ServiceCardsSkeleton = () => (
    <div className='grid md:grid-cols-3 gap-8'>
      {[1, 2, 3].map(index => (
        <div key={index} className='group relative h-96'>
          <div className='h-full rounded-2xl overflow-hidden bg-gray-50 relative'>
            <Skeleton className='absolute inset-0 w-full h-full' />
            <div className='absolute bottom-0 left-0 right-0 p-6 z-20'>
              <Skeleton className='h-8 w-3/4 mb-2 ' />
              <Skeleton className='h-4 w-full ' />
              <Skeleton className='h-4 w-2/3 mt-1 ' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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
        {isLoadingServices ? (
          <ServiceCardsSkeleton />
        ) : (
          homepageServiceCards.length > 0 && (
            <div className='grid md:grid-cols-3 gap-8'>
              {homepageServiceCards.map(service => (
                <div key={service.$id} className='group relative h-96'>
                  <div className='h-full rounded-2xl overflow-hidden bg-gray-200 relative'>
                    {/* Service Image or Icon Background */}
                    {service.homepageCardThumbnailImageUrl ? (
                      <img
                        src={service.homepageCardThumbnailImageUrl}
                        alt={service.homepageCardThumbnailImageAltText || service.homepageCardTitleText}
                        className='absolute inset-0 object-cover w-full h-full'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                        {renderServiceIcon(service.aboutPageServiceIconIdentifier)}
                      </div>
                    )}

                    {/* Overlay */}
                    <div className='absolute inset-0 bg-black/60 group-hover:opacity-60 transition-opacity duration-300 z-10' />

                    {/* Content */}
                    <div className='absolute bottom-0 left-0 right-0 p-6 text-white z-20'>
                      <h3 className='text-2xl font-bold mb-2'>{service.homepageCardTitleText}</h3>
                      <p className='text-white/90 text-sm leading-relaxed'>{service.homepageCardDescriptionText}</p>
                    </div>

                    {/* Category Badge */}
                    <div className='absolute top-4 left-4 z-20'>
                      <span className='px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full border border-white/30'>
                        {service.aboutPageServiceCategoryText}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Mobile CTA */}
        <div className='mt-8 text-center md:hidden'>
          <Link to='about-us'>
            <Button variant='default' className='w-full'>
              Learn More
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className='mt-16 grid md:grid-cols-3 gap-8 text-center'>
          {isLoadingSettings
            ? // Show skeletons while loading stats
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className='p-6'>
                  <Skeleton className='h-10 w-20 mx-auto mb-2 bg-gray-200' />
                  <Skeleton className='h-5 w-52 mx-auto bg-gray-200' />
                </div>
              ))
            : stats.length > 0 &&
              // Show dynamic stats from API
              stats.map((stat: Statistic, index: number) => (
                <div key={stat.id || index} className='p-6'>
                  <div className='text-4xl font-bold text-secondary mb-2'>{stat.value}</div>
                  <div className='text-primary/80'>{stat.key}</div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
