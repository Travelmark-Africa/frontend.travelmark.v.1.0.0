import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const OurServices = () => {
  const services = [
    {
      id: 1,
      title: 'Event Consultation Services',
      description: 'Expert guidance in designing and implementing impactful events and conferences tailored to your unique objectives and strategic goals.',
      category: 'Event Planning',
      color: 'bg-gradient-to-br from-red-50 to-red-100',
      accent: 'text-red-600',
      icon: Calendar
    },
    {
      id: 2,
      title: 'MICE Consultation Services',
      description: 'Helping countries and institutions establish or scale up their MICE capabilities to boost business tourism profile and economic development.',
      category: 'MICE Development',
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      accent: 'text-blue-600',
      icon: MapPin
    },
    {
      id: 3,
      title: 'Capacity Building & Sustainability Support',
      description: 'Strengthening the business tourism ecosystem through professional development, training programs and sustainable tourism practices.',
      category: 'Capacity Building',
      color: 'bg-gradient-to-br from-green-50 to-green-100',
      accent: 'text-green-600',
      icon: Users
    }
  ];

  return (
    <div className='py-16 md:py-18 px-4 bg-secondary/5'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-2xl md:text-4xl font-extrabold text-primary mb-4'>Our Services</h2>
          <p className='text-lg text-primary/80 max-w-2xl mx-auto'>
            TravelMark Africa offers three core service categories, each designed to support the strategic
            development of Africa's business tourism sector.
          </p>
        </div>

        {/* Services Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {services.map(service => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`${service.color} rounded-2xl p-6 h-full flex flex-col`}
              >
                {/* Unique category badge */}
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${service.accent} bg-white/80 mb-4 w-fit`}
                >
                  <IconComponent className='w-3 h-3 mr-1' />
                  {service.category}
                </div>

                {/* Title */}
                <h3 className='text-lg font-bold text-primary/90 mb-3 leading-tight'>
                  {service.title}
                </h3>

                {/* Description */}
                <p className='text-primary/80 text-sm leading-relaxed flex-grow'>
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Simple Explore More Button */}
        <div className='text-center mt-12'>
          <Link to="/our-services">
            <Button size="lg">
              Explore More About Our Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurServices;