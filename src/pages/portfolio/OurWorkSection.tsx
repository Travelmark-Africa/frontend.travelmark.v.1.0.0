import { Users, MapPin, Globe, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProjectsQuery } from '@/hooks/useProjectsQuery';
import BlurImage from '@/components/BlurImage';

const OurWorkSection = () => {
  const { data: projectsData, isLoading, isError, error } = useGetProjectsQuery();

  const projects = projectsData?.data || [];

  // Helper function to get alternating styling
  const getProjectStyling = (index: number) => {
    const styles = [
      {
        color: 'bg-gradient-to-br from-orange-50 to-red-100',
        accent: 'text-orange-600',
      },
      {
        color: 'bg-gradient-to-br from-blue-50 to-indigo-100',
        accent: 'text-blue-600',
      },
      {
        color: 'bg-gradient-to-br from-green-50 to-emerald-100',
        accent: 'text-green-600',
      },
    ];

    return styles[index % styles.length];
  };

  if (isLoading) {
    return (
      <section className='py-16 md:py-18 px-4 bg-white'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
            <p className='text-base text-primary/70 mb-4'>Signature Events</p>
            <h2 className='text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug'>
              Our Work in Motion
              <br />
              <span className='text-secondary italic'>Across the Continent</span>
            </h2>
            <p className='text-base text-primary/70 max-w-2xl mx-auto leading-relaxed'>
              Explore how we bring strategy and structure to high-level conferences, summits, and exhibitions that
              elevate Africa's economic and innovation landscape.
            </p>
          </div>

          {/* Loading Projects Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className='bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl overflow-hidden'>
                {/* Image Section */}
                <div className='relative h-48 overflow-hidden'>
                  <Skeleton className='w-full h-full' />
                  {/* Category Badge */}
                  <div className='absolute top-4 left-4'>
                    <Skeleton className='w-20 h-6 rounded-full' />
                  </div>
                  {/* Year Badge */}
                  <div className='absolute top-4 right-4'>
                    <Skeleton className='w-12 h-6 rounded-full' />
                  </div>
                </div>

                {/* Content Section */}
                <div className='p-6 space-y-4'>
                  <div>
                    <Skeleton className='h-6 w-3/4 mb-1' />
                    <Skeleton className='h-4 w-1/2' />
                  </div>

                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-5/6' />
                    <Skeleton className='h-4 w-4/6' />
                  </div>

                  <div className='flex items-center justify-between pt-2 border-t border-white/50'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className='py-16 md:py-18 px-4 bg-white'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
            <p className='text-base text-primary/70 mb-4'>Signature Events</p>
            <h2 className='text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug'>
              Our Work in Motion
              <br />
              <span className='text-secondary italic'>Across the Continent</span>
            </h2>
            <p className='text-base text-primary/70 max-w-2xl mx-auto leading-relaxed'>
              Explore how we bring strategy and structure to high-level conferences, summits, and exhibitions that
              elevate Africa's economic and innovation landscape.
            </p>
          </div>

          {/* Error State */}
          <div className='flex items-center justify-center h-96'>
            <div className='text-center'>
              <AlertCircle className='w-16 h-16 mx-auto text-red-400 mb-4' />
              <p className='text-gray-500 text-lg mb-2'>Unable to load projects</p>
              <p className='text-gray-400 text-sm'>
                {error instanceof Error ? error.message : 'Please try again later'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className='py-16 md:py-18 px-4 bg-white'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
            <p className='text-base text-primary/70 mb-4'>Signature Events</p>
            <h2 className='text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug'>
              Our Work in Motion
              <br />
              <span className='text-secondary italic'>Across the Continent</span>
            </h2>
            <p className='text-base text-primary/70 max-w-2xl mx-auto leading-relaxed'>
              Explore how we bring strategy and structure to high-level conferences, summits, and exhibitions that
              elevate Africa's economic and innovation landscape.
            </p>
          </div>

          {/* Empty State */}
          <div className='flex items-center justify-center h-96'>
            <div className='text-center'>
              <Globe className='w-16 h-16 mx-auto text-gray-400 mb-4' />
              <p className='text-gray-500 text-lg'>No projects available</p>
              <p className='text-gray-400 text-sm'>Check back later for updates on our latest work</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-16 md:py-18 px-4 bg-white'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <p className='text-base text-primary/70 mb-4'>Signature Events</p>
          <h2 className='text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug'>
            Our Work in Motion
            <br />
            <span className='text-secondary italic'>Across the Continent</span>
          </h2>
          <p className='text-base text-primary/70 max-w-2xl mx-auto leading-relaxed'>
            Explore how we bring strategy and structure to high-level conferences, summits, and exhibitions that elevate
            Africa's economic and innovation landscape.
          </p>
        </div>

        {/* Projects Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {projects.map((project, index) => {
            const styling = getProjectStyling(index);

            return (
              <div
                key={project.$id || index}
                className={`${styling.color} rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1`}
              >
                {/* Image Section */}
                <div className='relative h-48 overflow-hidden'>
                  <BlurImage
                    src={project.image}
                    alt={project.title}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

                  {/* Category Badge */}
                  <div className='absolute top-4 left-4'>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styling.accent} bg-white/90 backdrop-blur-sm border border-white/30`}
                    >
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
                  <div>
                    <h3 className='text-lg font-bold text-primary/90 leading-tight mb-1'>{project.title}</h3>
                    {project.subtitle && <p className='text-sm text-primary/70 italic'>{project.subtitle}</p>}
                  </div>

                  <p className='text-primary/80 text-[0.87rem] leading-relaxed'>{project.description}</p>

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
