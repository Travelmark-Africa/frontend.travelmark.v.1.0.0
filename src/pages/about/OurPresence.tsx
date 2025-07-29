import Container from '@/components/Container';

const OurPresence = () => {
  const regions = [
    { name: 'North Africa', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { name: 'West Africa', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'East Africa', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Central Africa', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { name: 'Southern Africa', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <div className='w-full bg-secondary/5 py-20 px-4'>
      <Container>
        <div className='text-center max-w-4xl mx-auto'>
          {/* Title */}
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
            Our <span className='text-primary'>Presence</span>
          </h2>

          {/* Subtitle */}
          <h3 className='text-xl font-semibold text-gray-700 mb-8'>Headquartered in Kigali, Rwanda</h3>

          {/* Paragraph */}
          <p className='text-gray-600 text-lg leading-relaxed mb-16 max-w-3xl mx-auto'>
            TravelMark Africa has a presence across multiple regions including West Africa, Central Africa, North
            Africa, and Southern Africa.
          </p>

          {/* Region Badges */}
          <div className='flex flex-wrap justify-center gap-4'>
            {regions.map(region => (
              <div key={region.name} className={`${region.color} px-5 py-2 rounded-xl border font-medium`}>
                {region.name}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OurPresence;
