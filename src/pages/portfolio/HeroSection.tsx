import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import { useGetCompanySettingsQuery } from '@/hooks/useCompanySettings';

import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const { data: companySettingsData, isLoading: isLoadingSettings } = useGetCompanySettingsQuery();
  const companySettings = companySettingsData?.data;

  const handleCalendlyClick = () => {
    window.open(companySettings?.calendlyLink, '_blank');
  };

  return (
    <section className='min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-secondary/10 flex items-center justify-center px-4 py-16'>
      <div className='max-w-4xl mx-auto text-center space-y-8'>
        {/* Badge */}
        <div className='flex justify-center'>
          <div className='inline-flex items-center px-3 py-1 text-xs font-medium bg-primary/10 text-primary/70 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors duration-200'>
            <Award className='w-3 h-3 mr-1.5' />
            Our Track Record in Action
          </div>
        </div>

        {/* Heading */}
        <div className='space-y-6'>
          <h1 className='text-3xl md:text-4xl font-bold text-primary leading-snug'>
            Highlights from Our
            <span className='block text-secondary italic'>Conferences, Summits & Exhibitions</span>
          </h1>

          <p className='text-base text-primary/70 max-w-3xl mx-auto leading-relaxed'>
            Explore a selection of the impactful events we’ve delivered across Africa — from sector-shaping expos to
            high-level ministerial summits. This portfolio reflects our expertise in MICE strategy, execution, and
            stakeholder engagement.
          </p>
        </div>

        {/* Stats Snapshot */}
        <div className='text-sm text-primary/50'>
          <p>20,000+ delegates engaged • 5 regions covered • 3 major sectors impacted</p>
        </div>

        {/* CTA Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-4'>
          <Link to='/about-us'>
            <Button hideChevron size='sm' className='text-[0.85rem]'>
              Who We Are
            </Button>
          </Link>

          <Button
            size='sm'
            disabled={isLoadingSettings}
            onClick={handleCalendlyClick}
            className='border-1! border-secondary/30! hover:border-secondary/40! bg-secondary/10! hover:bg-secondary/20! text-secondary! hover:text-secondary transition-colors duration-500 text-[0.87rem]'
          >
            Start a Project with Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
