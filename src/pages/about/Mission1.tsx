import { Card, CardContent } from '@/components/ui/card';
import { Compass, Users, Mountain, Hotel, Leaf } from 'lucide-react';

const Mission = () => {
  const services = [
    {
      icon: <Compass className='w-6 h-6 text-amber-600' />,
      title: 'Wildlife Safaris',
      description: 'Encounter the Big Five in iconic parks like Kruger, Maasai Mara, and Chobe.',
    },
    {
      icon: <Users className='w-6 h-6 text-amber-600' />,
      title: 'Cultural Tours',
      description: "Immerse yourself in the rich traditions and history of Africa's diverse communities.",
    },
    {
      icon: <Mountain className='w-6 h-6 text-amber-600' />,
      title: 'Adventure Travel',
      description: 'Trek through rainforests, climb mountains, or explore deserts.',
    },
    {
      icon: <Hotel className='w-6 h-6 text-amber-600' />,
      title: 'Luxury Getaways',
      description: 'Stay in world-class lodges and resorts tailored to your comfort.',
    },
    {
      icon: <Leaf className='w-6 h-6 text-amber-600' />,
      title: 'Sustainable Tourism',
      description: 'Travel responsibly and support local communities.',
    },
  ];

  return (
    <div className='w-full bg-white'>
      <div className='container mx-auto px-4 py-16'>
        {/* Hero Section */}
        <div className='max-w-4xl mx-auto text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900'>
            Unforgettable Tours Across the African Continent
          </h1>
          <p className='text-lg text-gray-600 leading-relaxed'>
            Embark on a journey across Africa with Travelmark, where every tour is a story waiting to be told. From the
            vast savannas of the Serengeti to the majestic dunes of the Sahara, our expert guides will take you on an
            authentic African adventure.
          </p>
        </div>

        {/* Image Section */}
        <div className='relative w-full h-96 mb-16'>
          <img
            src='/api/placeholder/1200/400'
            alt='African landscape'
            className='w-full h-full object-cover rounded-xl shadow-lg'
          />
        </div>

        {/* Services Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {services.map((service, index) => (
            <Card key={index} className='border border-gray-100 hover:shadow-lg transition-shadow duration-300'>
              <CardContent className='p-6'>
                <div className='flex flex-col space-y-4'>
                  <div className='bg-amber-50 w-12 h-12 rounded-lg flex items-center justify-center'>
                    {service.icon}
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900'>{service.title}</h3>
                  <p className='text-gray-600'>{service.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className='text-center mt-16'>
          <p className='text-lg text-gray-600 mb-8'>
            Whether it's gorilla trekking in Uganda, exploring the vibrant cultures of West Africa, or relaxing on the
            pristine beaches of Zanzibar, we craft personalized itineraries to ensure your trip is unforgettable.
          </p>
          <button className='bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-300'>
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mission;
