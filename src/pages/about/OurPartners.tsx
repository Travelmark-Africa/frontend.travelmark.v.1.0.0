import { Skeleton } from '@/components/ui/skeleton';
import { useGetPartnersQuery } from '@/hooks/usePartners';
import Container from '@/components/Container';
import { Globe } from 'lucide-react';

const OurPartners = () => {
  const { data: partnersData, isLoading, isError, error } = useGetPartnersQuery();

  const partners = partnersData?.data || [];

  const handlePartnerClick = (website: string) => {
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='py-16 sm:py-24 bg-secondary/10'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start'>
          {/* Left Content */}
          <div className='space-y-6'>
            <div>
              <span className='inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-normal rounded border border-blue-200'>
                Trusted Partnerships
              </span>
              <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight mt-4'>
                Our <span className='text-primary'>Partners</span>
              </h2>
            </div>

            <div className='space-y-4 text-gray-600 leading-relaxed'>
              <p className='text-lg'>
                We collaborate with leading institutions across Africa and globally to deliver world-class business
                tourism experiences.
              </p>

              <p>
                Through these partnerships, we promote African destinations, build capacity, and ensure impactful MICE
                strategies across the continent.
              </p>

              <p>Together, we're shaping Africa into a premier hub for meetings, exhibitions, and conferences.</p>
            </div>
          </div>

          {/* Partner Logos Grid */}
          <div className='space-y-8'>
            {isLoading ? (
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className='bg-transparent rounded-xl p-4 flex items-center justify-center h-20'>
                    <Skeleton className='h-18 w-36 rounded' />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className='flex items-center justify-center h-40'>
                <div className='text-center'>
                  <Globe className='w-16 h-16 mx-auto text-red-400 mb-4' />
                  <p className='text-gray-500'>{error instanceof Error ? error.message : 'Unable to load partners'}</p>
                </div>
              </div>
            ) : partners.length > 0 ? (
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                {partners.map((partner, index) => (
                  <div
                    key={partner.$id || index}
                    onClick={() => handlePartnerClick(partner.website)}
                    className='group bg-transparent rounded-xl p-2 cursor-pointer transition-all duration-200 flex items-center justify-center h-20'
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className='max-w-full max-h-full object-contain hover:filter hover:grayscale grayscale-0 transition-all duration-200'
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex items-center justify-center h-40'>
                <div className='text-center'>
                  <Globe className='w-16 h-16 mx-auto text-gray-400 mb-4' />
                  <p className='text-gray-500'>No partners available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OurPartners;
