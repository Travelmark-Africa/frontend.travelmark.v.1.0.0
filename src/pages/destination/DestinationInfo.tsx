import { Star } from 'lucide-react';

interface DestinationInfoProps {
  destination: Destination;
}

const DestinationInfo: React.FC<DestinationInfoProps> = ({ destination }) => {
  const averageRating =
    destination.reviews.length > 0
      ? destination.reviews.reduce((acc, review) => acc + review.rating, 0) / destination.reviews.length
      : 0;

  return (
    <div className='bg-white rounded-lg mb-6'>
      <h1 className='text-3xl font-bold mb-4'>{destination.name}</h1>
      <p className='text-gray-700'>{destination.description}</p>
      <div className='mt-4 flex items-center'>
        <Star size={18} className='text-orange-500 mr-1' fill='currentColor' />
        <span className='font-medium'>{averageRating.toFixed(1)}</span>
        <span className='text-gray-500 ml-1'>({destination.reviews.length} reviews)</span>
      </div>
    </div>
  );
};

export default DestinationInfo;
