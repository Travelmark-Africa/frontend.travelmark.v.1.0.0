'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Logo = () => {
  const router = useRouter();

  return (
    <Image
      onClick={() => router.push('/')}
      className='hidden md:block cursor-pointer w-[120px] h-auto'
      src='/images/logo2.png'
      width={120}
      height={0}
      alt='Logo'
      priority
    />
  );
};

export default Logo;
