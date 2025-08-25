import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetServicesQuery } from '@/hooks/useServices';
import { getIconComponent } from '@/constants';
import { Link } from 'react-router-dom';

const OurServices = () => {
  const { data: servicesData, isLoading: isLoadingServices } = useGetServicesQuery();
  const services = servicesData?.data || [];

  // Filter services that have about page content and sort them
  const aboutPageServices = services
    .filter(
      service => service.aboutPageServiceFullTitleText?.trim() && service.aboutPageServiceFullDescriptionText?.trim()
    )
    .sort((a, b) => {
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateA - dateB; // Oldest first for consistent ordering
    });

  // Color schemes for services (cycling through different gradients)
  const colorSchemes = [
    {
      background: 'bg-gradient-to-br from-blue-100 to-blue-50',
      accent: 'text-blue-700',
      badge: 'bg-blue-50 text-blue-700',
    },
    {
      background: 'bg-gradient-to-br from-green-100 to-green-50',
      accent: 'text-green-700',
      badge: 'bg-green-50 text-green-700',
    },
    {
      background: 'bg-gradient-to-br from-purple-100 to-purple-50',
      accent: 'text-purple-700',
      badge: 'bg-purple-50 text-purple-700',
    },
    {
      background: 'bg-gradient-to-br from-orange-100 to-orange-50',
      accent: 'text-orange-700',
      badge: 'bg-orange-50 text-orange-700',
    },
    {
      background: 'bg-gradient-to-br from-pink-100 to-pink-50',
      accent: 'text-pink-700',
      badge: 'bg-pink-50 text-pink-700',
    },
    {
      background: 'bg-gradient-to-br from-indigo-100 to-indigo-50',
      accent: 'text-indigo-700',
      badge: 'bg-indigo-50 text-indigo-700',
    },
  ];

  // Loading skeleton for services
  const ServicesSkeleton = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[1, 2, 3].map(index => (
        <div key={index} className='bg-gray-100 rounded-2xl p-6 h-full flex flex-col'>
          <div className='mb-4'>
            <Skeleton className='h-6 w-24 rounded-full bg-gray-200' />
          </div>
          <Skeleton className='h-6 w-3/4 mb-3 bg-gray-200' />
          <div className='space-y-2 flex-grow'>
            <Skeleton className='h-4 w-full bg-gray-200' />
            <Skeleton className='h-4 w-full bg-gray-200' />
            <Skeleton className='h-4 w-2/3 bg-gray-200' />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className='py-16 md:py-18 px-4 bg-white'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-2xl md:text-4xl font-extrabold text-primary mb-4'>Our Services</h2>
          <p className='text-lg text-primary/80 max-w-2xl mx-auto'>
            TravelMark Africa offers comprehensive service solutions, each designed to support the strategic development
            of Africa's business tourism sector.
          </p>
        </div>

        {/* Services Grid */}
        {isLoadingServices ? (
          <ServicesSkeleton />
        ) : (
          aboutPageServices.length > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {aboutPageServices.map((service, index) => {
                const IconComponent = getIconComponent(service.aboutPageServiceIconIdentifier);
                const colorScheme = colorSchemes[index % colorSchemes.length];

                return (
                  <div key={service.$id} className={`${colorScheme.background} rounded-2xl p-6 h-full flex flex-col`}>
                    {/* Category badge */}
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorScheme.badge} mb-4 w-fit`}
                    >
                      <IconComponent className='w-3 h-3 mr-1' />
                      {service.aboutPageServiceCategoryText}
                    </div>

                    {/* Title */}
                    <h3 className='text-lg font-bold text-primary/90 mb-3 leading-tight'>
                      {service.aboutPageServiceFullTitleText}
                    </h3>

                    {/* Description */}
                    <p className='text-primary/80 text-sm leading-relaxed flex-grow'>
                      {service.aboutPageServiceFullDescriptionText}
                    </p>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Explore More Button */}
        {!isLoadingServices && aboutPageServices.length > 0 && (
          <div className='text-center mt-12'>
            <Link to='/our-services'>
              <Button size='lg'>Explore More About Our Services</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OurServices;
