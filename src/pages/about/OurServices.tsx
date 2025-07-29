import { Globe, Users, Award, MapPin } from 'lucide-react';

const OurWorkSection = () => {
  const projects = [
    {
      id: 1,
      title: 'Africa Energy Expo',
      subtitle: 'Powering Partnerships for a Sustainable Future',
      description:
        "Strategic event consulting for Africa's premier energy conference, connecting stakeholders across renewable energy, oil & gas, and sustainable development sectors.",
      category: 'Event Consulting',
      impact: '500+ Delegates',
      location: 'Kigali, Rwanda',
      year: '2024',
      color: 'bg-gradient-to-br from-orange-50 to-red-100',
      accent: 'text-orange-600',
      icon: Globe,
      image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753729758/energy_awxxim.png',
    },
    {
      id: 2,
      title: 'International Health Ministerial Summit',
      subtitle: 'Advancing Healthcare Innovation Across Africa',
      description:
        'High-level convening facilitating ministerial dialogue on health systems strengthening, pandemic preparedness, and regional healthcare collaboration.',
      category: 'Ministerial Summit',
      impact: '45+ Ministers',
      location: 'Kigali, Rwanda',
      year: '2024',
      color: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      accent: 'text-blue-600',
      icon: Users,
      image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753730919/ihms_pxivnk.png',
    },
    {
      id: 3,
      title: 'Agro-Food Rwanda Project',
      subtitle: "Showcasing Africa's Food Security Innovations",
      description:
        'Comprehensive agribusiness development initiative highlighting innovative solutions in agricultural technology, food processing, and supply chain optimization.',
      category: 'Development Initiative',
      impact: '200+ Stakeholders',
      location: 'Multiple Regions',
      year: '2024',
      color: 'bg-gradient-to-br from-green-50 to-emerald-100',
      accent: 'text-green-600',
      icon: Award,
      image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753731827/images_1_byjdeg.png',
    },
  ];


  return (
    <section className='py-16 md:py-18 px-4 bg-white'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <p className='text-base text-primary/70 mb-4'>Featured Projects</p>
          <h2 className='text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug'>
            Event Excellence in Action
            <br />
            <span className='text-secondary italic'>Across Africa</span>
          </h2>
          <p className='text-base text-primary/70 max-w-2xl mx-auto leading-relaxed'>
            Discover how we've successfully delivered impactful conferences, summits, and exhibitions that drive
            meaningful connections and business growth across the continent.
          </p>
        </div>

        {/* Projects Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {projects.map((project) => {
            const IconComponent = project.icon;
            return (
              <div
                key={project.id}
                className={`${project.color} rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1`}
              >
                {/* Image Section */}
                <div className='relative h-48 overflow-hidden'>
                  <img
                    src={project.image}
                    alt={project.title}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

                  {/* Category Badge */}
                  <div className='absolute top-4 left-4'>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${project.accent} bg-white/90 backdrop-blur-sm border border-white/30`}
                    >
                      <IconComponent className='w-3 h-3 mr-1.5' />
                      {project.category}
                    </div>
                  </div>

                  {/* Year Badge */}
                  <div className='absolute top-4 right-4'>
                    <div className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-black/30 backdrop-blur-sm border border-white/20'>
                      {project.year}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className='p-6 space-y-4'>
                  {/* Title */}
                  <div>
                    <h3 className='text-lg font-bold text-primary/90 leading-tight mb-1'>{project.title}</h3>
                    <p className='text-sm text-primary/70 italic'>{project.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className='text-primary/80 text-[0.87rem] leading-relaxed'>{project.description}</p>

                  {/* Impact Metrics */}
                  <div className='flex items-center justify-between pt-2 border-t border-white/50'>
                    <div className='flex items-center space-x-1'>
                      <Users className='w-4 h-4 text-primary/60' />
                      <span className='text-xs font-medium text-primary/70'>{project.impact}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <MapPin className='w-4 h-4 text-primary/60' />
                      <span className='text-xs font-medium text-primary/70'>{project.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurWorkSection;
