import { missionImage } from '@/assets';
import BlurImage from '@/components/BlurImage';
import Container from '@/components/Container';
import { Card, CardContent } from '@/components/ui/card';

const MissionSection = () => {
  return (
    <div className='w-full bg-secondary/20 py-16'>
      <Container>
        <Card className='border-none shadow-none bg-transparent'>
          <CardContent className='p-0'>
            <div className='flex flex-col lg:flex-row items-center gap-12'>
              {/* Image Section - Now on the left */}
              <div className='lg:w-1/2 relative'>
                <div className='relative transform rotate-2 transition-transform duration-300'>
                  <BlurImage
                    src={missionImage}
                    alt='African safari landscape'
                    className='rounded-lg w-full  object-cover shadow-lg'
                  />
                </div>
              </div>

              {/* Text Content - Now on the right */}
              <div className='lg:w-1/2 space-y-6'>
                <h2 className='text-4xl lg:text-5xl font-bold'>
                  Our <span className='text-secondary'>Mission</span>
                </h2>
                <p className=' text-lg leading-relaxed'>
                  At Travelmark Africa, we're dedicated to crafting unforgettable journeys across the African continent.
                  Our mission is to showcase Africa's diverse landscapes, wildlife, and cultures through personalized
                  experiences that inspire, educate, and create lasting memories. We strive to deliver exceptional
                  adventures while promoting sustainable tourism and supporting local communities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default MissionSection;
