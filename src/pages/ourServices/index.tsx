import { conference, norken, tourism, servicesImage } from '@/assets';
import Container from '@/components/Container';
import { Calendar, CheckCircle } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Event Consultation',
    description:
      'We work with institutions, corporates, and development partners to design and execute impactful events, summits, and conferences. From concept to delivery, we ensure every event is purpose-driven, well-managed, and aligns with your organizational goals.',
    subServices: [
      {
        name: 'Event & Conference Concepts',
        detail:
          'We co-create strong themes, formats, agendas, and delivery frameworks tailored to your audience and outcomes.',
      },
      {
        name: 'Stakeholder Engagement',
        detail:
          'We facilitate engagement with relevant institutions, partners, sponsors, speakers, and attendees across sectors.',
      },
      {
        name: 'Sales Agent Services',
        detail:
          'We actively promote your event, drive ticketing and registration, and coordinate outreach to target participants.',
      },
    ],
    image: conference,
    imageAlt: 'Event consultation and conference planning',
  },
  {
    id: 2,
    title: 'MICE Strategy',
    description:
      'Our MICE (Meetings, Incentives, Conferences, and Exhibitions) service supports governments, bureaus, and institutions in positioning destinations for high-value business tourism. We build actionable MICE plans and help deliver standout events.',
    subServices: [
      {
        name: 'MICE Strategy Development',
        detail:
          'We develop national and city-level frameworks that outline how to grow and sustain MICE as an economic driver.',
      },
      {
        name: 'Destination Marketing',
        detail:
          'We promote countries, cities, and venues as competitive MICE hubs through content, campaigns, and partnerships.',
      },
      {
        name: 'Event Creation & Management',
        detail: 'We design, launch, and deliver high-quality events aligned with destination positioning strategies.',
      },
    ],
    image: tourism,
    imageAlt: 'MICE consultation and destination marketing',
  },
  {
    id: 3,
    title: 'Capacity & Sustainability',
    description:
      'We invest in people, partnerships, and practices to strengthen Africa’s business tourism ecosystem. Our focus areas include training, research, partnerships, and promoting responsible, inclusive growth across the sector.',
    subServices: [
      {
        name: 'Capacity Building & Training',
        detail:
          'We deliver structured training for professionals in events, hospitality, tourism, and support sectors.',
      },
      {
        name: 'Business Matchmaking',
        detail: 'We create platforms for African businesses to meet international buyers, partners, and collaborators.',
      },
      {
        name: 'Research & Data Analysis',
        detail:
          'We generate insights and reports to inform policy, investment, and programming decisions in the sector.',
      },
      {
        name: 'Sustainable Tourism Practices',
        detail: 'We support eco-conscious policies, ethical supply chains, and green event management approaches.',
      },
    ],
    image: norken,
    imageAlt: 'Capacity building and sustainability training',
  },
];

const ServicesPage = () => {
  return (
    <div className='w-full bg-white'>
      {/* Header Section */}
      <div
        className='min-h-[70vh] bg-cover bg-center bg-no-repeat relative flex items-center justify-center py-16 sm:py-24'
        style={{ backgroundImage: `url(${servicesImage})` }}
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
      {services.map((service, index) => {
        const isEven = index % 2 === 0;
        return (
          <div key={service.id} className='py-16'>
            <Container>
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  isEven ? '' : 'lg:grid-flow-col-dense'
                }`}
              >
                {/* Image */}
                <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className='rounded-2xl overflow-hidden shadow-xl bg-gray-100'>
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      className='w-full h-full object-cover aspect-[4/3]'
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className='space-y-6'>
                    <div>
                      <h2 className='text-2xl font-extrabold text-gray-900 mb-4 leading-tight'>{service.title}</h2>
                      <p className='text-base text-gray-600 leading-relaxed'>{service.description}</p>
                    </div>

                    <div>
                      <h3 className='text-lg font-bold text-gray-900 mb-4'>Sub-services include:</h3>
                      <div className='space-y-3'>
                        {service.subServices.map((sub, i) => (
                          <div key={i} className='flex items-start gap-3 group'>
                            <CheckCircle className='w-5 h-5 text-secondary mt-1 flex-shrink-0' />
                            <div>
                              <h4 className='font-semibold text-gray-900 mb-1 text-base group-hover:text-primary transition-colors'>
                                {sub.name}
                              </h4>
                              <p className='text-sm text-gray-600 leading-relaxed'>{sub.detail}</p>
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
      <hr className='mb-8 mx-24 border-[0.5px] border-secondary/30 rounded-e-full' />
      <div className='text-center pb-24'>
        <h2 className='text-2xl font-extrabold text-primary mb-4 leading-tight'>
          Ready to Transform Your Vision Into Reality?
        </h2>
        <p className='text-base text-primary/90 mb-4 max-w-2xl mx-auto leading-relaxed'>
          Let's discuss how our Africa-ready tourism solutions can elevate your next project. Schedule a consultation
          with our experts today.
        </p>
        <a
          href='https://calendly.com/travelmarkafrica/30min'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-3 px-6 py-2 bg-secondary text-white rounded-xl text-[1rem] hover:bg-secondary/90 transition-all duration-300 transform hover:scale-[1.01]'
        >
          <Calendar className='w-5 h-5' />
          Schedule a Call With Us
        </a>
      </div>
    </div>
  );
};

export default ServicesPage;
