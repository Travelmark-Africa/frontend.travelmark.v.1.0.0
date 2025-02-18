import { logo1 } from '@/assets';
import Container from '../Container';
import Search from './Search';
import UserMenu from './UserMenu';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <div className='fixed w-full bg-white/40 z-10 backdrop-blur-md'>
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
            <Link to="/">
              <img
                onClick={() => { }}
                className='hidden md:block cursor-pointer w-[120px] h-auto'
                src={logo1}
                width={120}
                height={0}
                alt='Logo'
              />
            </Link>
            <Search />
            <UserMenu />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
