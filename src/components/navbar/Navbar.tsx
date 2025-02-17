import { logo } from '@/assets';
import Container from '../Container';
import Search from './Search';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  return (
    <div className='fixed w-full bg-white z-10'>
      <div
        className='
          py-4 
          border-b-[1px]
        '
      >
        <Container>
          <div
            className='
            flex 
            flex-row 
            items-center 
            justify-between
            gap-3
            md:gap-0
          '
          >
            <img
              onClick={() => { }}
              className='hidden md:block cursor-pointer w-[120px] h-auto'
              src={logo}
              width={120}
              height={0}
              alt='Logo'
            />
            <Search />
            <UserMenu />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
