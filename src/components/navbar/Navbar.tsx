import { Link, useLocation } from 'react-router-dom';
import { logo1 } from '@/assets';
import Container from '../Container';
import Search from './Search';
import UserMenu from './UserMenu';

interface NavbarProps {
  bgColor?: string;
  border?: string;
}

const Navbar: React.FC<NavbarProps> = ({ bgColor = 'bg-white/40 backdrop-blur-md', border = 'border-b-[1px]' }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Check if current path is about-us or contact-us
  const isAboutOrContact = pathname === '/about-us' || pathname === '/contact-us';

  return (
    <div className={`fixed w-full z-50 ${bgColor}`}>
      <div className={`py-2 sm:py-3 md:py-4 ${border}`}>
        <Container>
          <div className='flex flex-row items-center justify-between gap-2 md:gap-3'>
            <Link to='/'>
              <img className='cursor-pointer w-[90px] sm:w-[110px] md:w-[120px] h-auto' src={logo1} alt='Logo' />
            </Link>

            {/* Only show nav links on about-us or contact-us pages */}
            {isAboutOrContact && (
              <div className='flex space-x-4 md:space-x-6'>
                <Link
                  to='/about-us'
                  className={`font-medium transition-all duration-300 ease-in-out ${
                    pathname === '/about-us'
                      ? 'text-secondary underline underline-offset-4 scale-105'
                      : 'text-gray-700 hover:text-secondary hover:scale-105'
                  }`}
                >
                  About Us
                </Link>
                <Link
                  to='/contact-us'
                  className={`font-medium transition-all duration-300 ease-in-out ${
                    pathname === '/contact-us'
                      ? 'text-secondary underline underline-offset-4 scale-105'
                      : 'text-gray-700 hover:text-secondary hover:scale-105'
                  }`}
                >
                  Contact Us
                </Link>
              </div>
            )}

            {/* Search bar visible on all pages except about-us and contact-us */}
            <div
              className={`flex-1 mx-2 md:mx-4 max-w-[350px] md:max-w-[400px] lg:max-w-[500px] transition-opacity duration-500 ease-in-out ${
                isAboutOrContact ? 'opacity-0 hidden' : 'opacity-100'
              }`}
            >
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
