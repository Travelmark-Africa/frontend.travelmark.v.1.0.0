import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const OurPresence = () => {
  const regions = [
    {
      name: 'East Africa',
      address: 'Kenya, Tanzania, Uganda, Rwanda, Burundi',
      number: 1,
    },
    {
      name: 'Southern Africa',
      address: 'South Africa, Botswana, Zimbabwe, Zambia, Namibia',
      number: 2,
    },
    {
      name: 'West Africa',
      address: 'Nigeria, Ghana, Senegal, Ivory Coast, Gambia',
      number: 3,
    },
  ];

  return (
    <div className='w-full bg-white py-16 px-4'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-center text-3xl font-bold mb-16'>OUR PRESENCE</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
          {regions.map(region => (
            <div key={region.name} className='flex flex-col items-center text-center'>
              <div className='mb-4 w-16 h-16 flex items-center justify-center bg-[#F4A261] rounded-full text-white text-2xl font-bold glow'>
                {region.number}
              </div>
              <h4 className='text-xl font-bold mb-2'>{region.name}</h4>
              <p className='text-gray-600 text-sm px-4'>{region.address}</p>
            </div>
          ))}
        </div>

        <div className='bg-primary rounded-3xl'>
          <div className='text-center max-w-3xl mx-auto py-10'>
            <h2 className='text-secondary text-3xl font-bold mb-6'>Discover Africa's Treasures WITH US</h2>

            <p className='text-white mb-8 px-4'>
              Ready for an unforgettable African adventure? From wildlife safaris to cultural experiences, your perfect
              journey awaits. Click below to discover our handcrafted tours across the continent.
            </p>

            <Link to='/explore' className='inline-block'>
              <Button className='bg-secondary text-white px-8 py-6 rounded-full hover:bg-secondary/90 transition-colors'>
                Explore Here
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurPresence;
