'use client';

import { IconType } from 'react-icons';

import { SafeUser } from '@/types';

import Avatar from '../Avatar';
import ListingCategory from './DestinationCategory';

interface DestinationInfoProps {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category:
    | {
        icon: IconType;
        label: string;
        description: string;
      }
    | undefined;
}

const DestinationInfo: React.FC<DestinationInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
}) => {
  return (
    <div className='col-span-4 flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <div
          className='
            text-xl 
            font-semibold 
            flex 
            flex-row 
            items-center
            gap-2
          '
        >
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.name} />
        </div>
        <div
          className='
            flex 
            flex-row 
            items-center 
            gap-4 
            font-light
            text-neutral-500
          '
        >
          <div>{guestCount} guests</div>
          <div>{roomCount} rooms</div>
          <div>{bathroomCount} bathrooms</div>
        </div>
      </div>
      <hr />
      {category && <ListingCategory icon={category.icon} label={category?.label} description={category?.description} />}
      <hr />
      <div
        className='
      text-lg font-light text-neutral-500'
      >
        {description}
      </div>
      <hr />
    </div>
  );
};

export default DestinationInfo;
