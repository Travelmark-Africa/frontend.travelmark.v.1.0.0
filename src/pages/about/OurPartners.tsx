import Container from '@/components/Container';
import { partners } from '@/constants';

const OurPartners = () => {
  const handlePartnerClick = (website: string) => {
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='py-16 sm:py-24 bg-white'>
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

              <p>Together, we’re shaping Africa into a premier hub for meetings, exhibitions, and conferences.</p>
            </div>
          </div>

          {/* Partner Logos Grid */}
          <div className='space-y-8'>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
              {partners.map(partner => (
                <div
                  key={partner.id}
                  onClick={() => handlePartnerClick(partner.website)}
                  className='group bg-gray-50 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-100 flex items-center justify-center h-20'
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className='max-w-full max-h-full object-contain hover:filter hover:grayscale grayscale-0 transition-all duration-200'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OurPartners;
