import { logo1 } from '@/assets';
import Container from '../Container';
import Search from './Search';
import UserMenu from './UserMenu';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <div className='fixed w-full bg-white/40 z-10 backdrop-blur-md'>
      <div className='py-2 sm:py-3 md:py-4 border-b-[1px]'>
        <Container>
          <div className='flex flex-row items-center justify-between gap-2 md:gap-3'>
            <Link to='/'>
              <img className='cursor-pointer w-[90px] sm:w-[110px] md:w-[120px] h-auto' src={logo1} alt='Logo' />
            </Link>
            <div className='flex-1 mx-2 md:mx-4 max-w-[350px] md:max-w-[400px] lg:max-w-[500px]'>
              <Search />
            </div>
            <UserMenu />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
