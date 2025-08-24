import Container from '@/components/Container';
import { aboutImage1, aboutImage2, aboutImage3 } from '@/assets';

const WhoWeAre = () => {
  return (
    <>
      {/* Who We Are Section with Background Image */}
      <div className='relative w-full min-h-[80vh] overflow-hidden'>
        {/* Background Image */}
        <img
          src='https://res.cloudinary.com/dsubfxzdx/image/upload/v1753733012/missionImage_ev7k8q.jpg'
          alt='African business tourism landscape'
          className='absolute inset-0 w-full h-full object-cover'
        />

        {/* Top Gradient Overlay for Navbar Visibility */}
        <div className='absolute top-0 left-0 right-0 h-25 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10'></div>

        {/* Who We Are Content */}
        <div className='absolute top-20 left-0 right-0 p-8 z-20'>
          <Container>
            <div className='flex justify-end'>
              <div className='max-w-xl'>
                <div className='backdrop-blur-2xl rounded-2xl p-8'>
                  <h2 className='text-3xl font-bold text-white mb-5 leading-tight'>Who We Are</h2>

                  <p className='text-white/90 text-base leading-relaxed'>
                    TravelMark Africa is a Kigali-based firm driving Africa's growth in business tourism. We specialize
                    in event consultation, MICE strategy, and capacity development to help African countries unlock
                    their global potential.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* About Hero Section */}
      <section className='flex items-center pt-16 lg:pt-18 pb-8 lg:pb-12 bg-secondary/5'>
        <div className='w-full'>
          {/* Hero Content */}
          <Container>
            <div className='text-center space-y-2 mb-8'>
              <h1 className='text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight'>
                You can always <span className='text-primary font-primary'>trust us</span>
                <br />
                with your special moments
              </h1>

              <p className='text-[0.9rem] text-gray-600 max-w-xl mx-auto leading-relaxed'>
                We transform ideas into impactful business events through strategic consultation, MICE planning, and
                execution.
              </p>
            </div>
          </Container>

          {/* Image Grid */}
          <div className='px-4 sm:px-6 lg:px-8 xl:px-12'>
            <div className='max-w-7xl mx-auto'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-[900px] lg:h-[450px]'>
                {/* Left Image - Conference Venue */}
                <div className='relative group h-full'>
                  <div className='h-full rounded-2xl overflow-hidden bg-gray-200 relative'>
                    <img
                      src={aboutImage1}
                      alt='BK Arena - Conference venue supported by TravelMark Africa'
                      className='absolute inset-0 object-cover w-full h-full'
                    />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'></div>
                    <div className='absolute bottom-3 left-3 z-20'>
                      <div className='bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1'>
                        <h3 className='text-white font-semibold text-[0.8rem] pb-1'>
                          MICE Consultation & Event Management
                        </h3>
                        <p className='text-white/80 text-xs'>
                          We develop strategies and manage global-scale business events.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Images */}
                <div className='flex flex-col gap-3 lg:gap-4 h-full'>
                  {/* Top Right - Exhibition Setup */}
                  <div className='relative group flex-1'>
                    <div className='h-full rounded-2xl overflow-hidden bg-gray-200 relative'>
                      <img
                        src={aboutImage2}
                        alt='Exhibition booth setup at an industry event'
                        className='absolute inset-0 object-cover w-full h-full'
                      />
                      <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'></div>
                      <div className='absolute bottom-2 left-2 z-20'>
                        <div className='bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1'>
                          <h3 className='text-white font-semibold text-[0.8rem] pb-1'>
                            Destination Marketing & Branding
                          </h3>
                          <p className='text-white/80 text-xs'>
                            We promote countries as leading business tourism destinations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Right - Team Engagement */}
                  <div className='relative group flex-1'>
                    <div className='h-full rounded-2xl overflow-hidden bg-gray-200 relative'>
                      <img
                        src={aboutImage3}
                        alt='Participants and team engagement at an outdoor session'
                        className='absolute inset-0 object-cover w-full h-full'
                      />
                      <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'></div>
                      <div className='absolute bottom-2 left-2 z-20'>
                        <div className='bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1'>
                          <h3 className='text-white font-semibold text-[0.8rem] pb-1'>
                            Capacity Building & Engagement
                          </h3>
                          <p className='text-white/80 text-xs'>
                            We train, connect, and empower professionals across Africa.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhoWeAre;
