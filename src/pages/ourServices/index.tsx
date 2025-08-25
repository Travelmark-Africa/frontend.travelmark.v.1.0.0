import { useGetCompanySettingsQuery } from '@/hooks/useCompanySettings';
import { useGetServicesQuery } from '@/hooks/useServices';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getIconComponent } from '@/constants';
import { Calendar, CheckCircle } from 'lucide-react';

interface SubService {
  subServiceTitle: string;
  subServiceDescription: string;
}

const ServicesPage = () => {
  const { data: companySettingsData, isLoading: isLoadingSettings } = useGetCompanySettingsQuery();
  const { data: servicesData, isLoading: isLoadingServices } = useGetServicesQuery();

  const companySettings = companySettingsData?.data;
  const services = servicesData?.data || [];

  // Filter services that have services page content and sort them
  const servicesPageServices = services
    .filter(service => service.servicesPageFullTitleText?.trim() && service.servicesPageFullDescriptionText?.trim())
    .sort((a, b) => {
      const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
      const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
      return dateA - dateB; // Oldest first for consistent ordering
    });

  const handleCalendlyClick = () => {
    window.open(companySettings?.calendlyLink, '_blank');
  };

  // Parse sub-services JSON
  const parseSubServices = (subServicesJson?: string): SubService[] => {
    if (!subServicesJson) return [];
    try {
      return JSON.parse(subServicesJson) as SubService[];
    } catch {
      return [];
    }
  };

  // Loading skeleton for service sections
  const ServiceSectionSkeleton = () => (
    <div className='py-16'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Image Skeleton */}
          <div>
            <Skeleton className='w-full h-[30rem] rounded-2xl bg-gray-200' />
          </div>

          {/* Content Skeleton */}
          <div className='space-y-6'>
            <div>
              <Skeleton className='h-8 w-3/4 mb-4 bg-gray-200' />
              <Skeleton className='h-4 w-full mb-2 bg-gray-200' />
              <Skeleton className='h-4 w-full mb-2 bg-gray-200' />
              <Skeleton className='h-4 w-full mb-2 bg-gray-200' />
              <Skeleton className='h-4 w-full mb-2 bg-gray-200' />
              <Skeleton className='h-4 w-full mb-2 bg-gray-200' />
              <Skeleton className='h-4 w-2/3 bg-gray-200' />
            </div>

            <div>
              <Skeleton className='h-6 w-1/2 mb-4 bg-gray-200' />
              <div className='space-y-3'>
                {[1, 2, 3].map(i => (
                  <div key={i} className='flex items-start gap-3'>
                    <Skeleton className='w-5 h-5 rounded-full bg-gray-200 mt-1' />
                    <div className='flex-1'>
                      <Skeleton className='h-5 w-3/4 mb-1 bg-gray-200' />
                      <Skeleton className='h-4 w-full mb-1 bg-gray-200' />
                      <Skeleton className='h-4 w-full bg-gray-200' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );

  return (
    <div className='w-full bg-white'>
      {/* Header Section */}
      <div
        className='min-h-[70vh] bg-cover bg-center bg-no-repeat relative flex items-center justify-center py-16 sm:py-24'
        style={{
          backgroundImage: `url("https://res.cloudinary.com/dsubfxzdx/image/upload/v1753733012/servicesImage_xwitvk.avif")`,
        }}
      >
        <div className='absolute inset-0 bg-black/60'></div>
        <Container className='relative z-10'>
          <div className='text-center'>
            <span className='inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-4 border border-white/30'>
              Our Services
            </span>
            <h1 className='text-4xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg'>
              Africa-Ready <span className='text-secondary'>Tourism Solutions</span>
            </h1>
            <p className='text-lg text-white/90 leading-relaxed max-w-3xl mx-auto drop-shadow-md'>
              We help governments, organizations, and businesses build impactful events, sustainable destinations, and
              future-ready ecosystems.
            </p>
          </div>
        </Container>
      </div>

      {/* Service Sections */}
      {isLoadingServices ? (
        // Show loading skeletons
        <>
          <ServiceSectionSkeleton />
          <ServiceSectionSkeleton />
          <ServiceSectionSkeleton />
        </>
      ) : (
        servicesPageServices.map((service, index) => {
          const isEven = index % 2 === 0;
          const subServices = parseSubServices(service.servicesPageSubServicesJson);

          return (
            <div key={service.$id} className='py-16'>
              <Container>
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    isEven ? '' : 'lg:grid-flow-col-dense'
                  }`}
                >
                  {/* Image */}
                  <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className='rounded-2xl overflow-hidden shadow-xl bg-gray-100'>
                      {service.servicesPageBannerImageUrl ? (
                        <img
                          src={service.servicesPageBannerImageUrl}
                          alt={service.servicesPageBannerImageAltText || service.servicesPageFullTitleText}
                          className='w-full h-full object-cover aspect-[4/3]'
                        />
                      ) : (
                        <div className='w-full aspect-[4/3] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                          {(() => {
                            const IconComponent = getIconComponent(service.aboutPageServiceIconIdentifier);
                            return <IconComponent className='w-24 h-24 text-white' />;
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className='space-y-6'>
                      <div>
                        <h2 className='text-2xl font-extrabold text-gray-900 mb-4 leading-tight'>
                          {service.servicesPageFullTitleText}
                        </h2>
                        <p className='text-base text-gray-600 leading-relaxed'>
                          {service.servicesPageFullDescriptionText}
                        </p>
                      </div>

                      {/* Sub-services */}
                      {subServices.length > 0 && (
                        <div>
                          <h3 className='text-lg font-bold text-gray-900 mb-4'>Sub-services include:</h3>
                          <div className='space-y-3'>
                            {subServices.map((sub, i) => (
                              <div key={i} className='flex items-start gap-3 group'>
                                <CheckCircle className='w-5 h-5 text-secondary mt-1 flex-shrink-0' />
                                <div>
                                  <h4 className='font-semibold text-gray-900 mb-1 text-base group-hover:text-primary transition-colors'>
                                    {sub.subServiceTitle}
                                  </h4>
                                  <p className='text-sm text-gray-600 leading-relaxed'>{sub.subServiceDescription}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Container>
            </div>
          );
        })
      )}

      {/* Call to Action Section */}
      {!isLoadingServices && servicesPageServices.length > 0 && (
        <>
          <hr className='mb-8 mx-24 border-[0.5px] border-secondary/30 rounded-e-full' />
          <div className='text-center pb-24'>
            <h2 className='text-2xl font-extrabold text-primary mb-4 leading-tight'>
              Ready to Transform Your Vision Into Reality?
            </h2>
            <p className='text-base text-primary/90 mb-4 max-w-2xl mx-auto leading-relaxed'>
              Let's discuss how our Africa-ready tourism solutions can elevate your next project. Schedule a
              consultation with our experts today.
            </p>
            <Button onClick={handleCalendlyClick} disabled={isLoadingSettings} hideChevron={true} size='sm'>
              <Calendar className='w-5 h-5' />
              Schedule a Call With Us
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ServicesPage;
