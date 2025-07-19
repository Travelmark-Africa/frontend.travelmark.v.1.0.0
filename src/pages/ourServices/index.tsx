import { conference, norken, tourism } from '@/assets';
import Container from '@/components/Container';

const ServicesPage = () => {
  const services = [
    {
      id: 1,
      title: 'Event Consultation Services',
      description: 'We provide expert guidance in the design and implementation of impactful events and conferences, tailored to the unique objectives of each client.',
      subServices: [
        {
          name: 'Event & Conference Concepts',
          detail: 'Designing high-level concepts, agendas, and formats'
        },
        {
          name: 'Stakeholder Engagement',
          detail: 'Coordinating and managing multi-sector participation'
        },
        {
          name: 'Sales Agent Services',
          detail: 'Promoting events and securing participation through strategic outreach'
        }
      ],
      image: conference,
      imageAlt: 'Event consultation and conference planning'
    },
    {
      id: 2,
      title: 'MICE Consultation Services',
      description: 'We help countries and institutions establish or scale up their MICE (Meetings, Incentives, Conferences, and Exhibitions) capabilities to boost their business tourism profile.',
      subServices: [
        {
          name: 'MICE Strategy Development',
          detail: 'Building national and regional MICE action plans'
        },
        {
          name: 'Destination Marketing',
          detail: 'Positioning countries and cities as competitive MICE destinations'
        },
        {
          name: 'Event Creation & Management',
          detail: 'Planning and hosting international-standard MICE events'
        }
      ],
      image: tourism,
      imageAlt: 'MICE consultation and destination marketing'
    },
    {
      id: 3,
      title: 'Capacity Building & Sustainability Support',
      description: 'We strengthen the ecosystem around business tourism by investing in people, data, and long-term sustainability.',
      subServices: [
        {
          name: 'Capacity Building & Training',
          detail: 'Skill development for professionals in the tourism and events industry'
        },
        {
          name: 'Business Matchmaking & Networking',
          detail: 'Connecting African stakeholders with global partners'
        },
        {
          name: 'Research & Data Analysis',
          detail: 'Generating insights to inform strategic decisions'
        },
        {
          name: 'Sustainable Tourism Practices',
          detail: 'Promoting eco-conscious policies and event standards'
        }
      ],
      image: norken,
      imageAlt: 'Capacity building and sustainability training'
    }
  ];

  return (
    <div className='w-full bg-white'>
      {/* Header Section */}
      <div className='bg-gradient-to-br from-primary/10 to-secondary/10 py-24 px-4'>
        <Container>
          <div className='text-center max-w-4xl mx-auto'>
            <span className='inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6'>
              🛠️ Our Services
            </span>
            <h1 className='text-4xl font-extrabold text-gray-900 mb-6 leading-tight'>
              Comprehensive <span className='text-primary'>Business Tourism</span> Solutions
            </h1>
            <p className='text-base text-gray-600 leading-relaxed max-w-3xl mx-auto'>
              TravelMark Africa offers three core service categories, each designed to support
              the strategic development of Africa's business tourism sector. Here's how we serve
              our partners and clients across the continent.
            </p>
          </div>
        </Container>
      </div>

      {/* Services Sections */}
      {services.map((service, index) => {
        const isEven = index % 2 === 0;

        return (
          <div key={service.id} className='py-24 px-4'>
            <Container>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isEven ? '' : 'lg:grid-flow-col-dense'}`}>

                {/* Image Section */}
                <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className='rounded-3xl overflow-hidden shadow-2xl bg-gray-100'>
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      className='w-full h-full object-cover aspect-[4/3]'
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className='space-y-8'>

                    {/* Service Title & Description */}
                    <div>
                      <h2 className='text-3xl font-extrabold text-gray-900 mb-6 leading-tight'>
                        {service.title}
                      </h2>
                      <p className='text-base text-gray-600 leading-relaxed'>
                        {service.description}
                      </p>
                    </div>

                    {/* Sub-services */}
                    <div>
                      <h3 className='text-lg font-bold text-gray-900 mb-6'>
                        Sub-services include:
                      </h3>
                      <div className='space-y-5'>
                        {service.subServices.map((subService, subIndex) => (
                          <div key={subIndex} className='flex items-start gap-4'>
                            <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                            <div>
                              <h4 className='font-bold text-gray-900 mb-1 text-base'>
                                {subService.name}
                              </h4>
                              <p className='text-sm text-gray-600 leading-relaxed'>
                                {subService.detail}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </Container>
          </div>
        );
      })}
    </div>
  );
};

export default ServicesPage;