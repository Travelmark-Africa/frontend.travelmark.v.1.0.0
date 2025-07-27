import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logo1, logo2 } from '@/assets';
import { Link, useLocation } from 'react-router-dom';
import Container from '@/components/Container';

const Navbar = ({ backgroundColor = 'bg-transparent', isFixed = true, className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOutOfHero, setIsOutOfHero] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Use React Router's useLocation hook instead of manual path tracking
  const location = useLocation();
  const currentPath = location.pathname;

  const homeStylePages = ['/', '/about-us', '/our-services'];

  const standardPages = ['/portfolio', '/contact-us',];

  const isHomeStylePage = homeStylePages.includes(currentPath);
  const isStandardPage = standardPages.includes(currentPath) || !isHomeStylePage;

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    // Only update if there's a meaningful scroll difference
    if (Math.abs(currentScrollY - lastScrollY) < 5) return;

    // Check if we're out of the hero section (100vh) - only for home-style pages
    if (isHomeStylePage) {
      setIsOutOfHero(currentScrollY > heroHeight);
    }

    // Simple hide/show logic: hide on any scroll down, show only when at top
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // Scrolling down - hide navbar
      setIsHidden(true);
    } else if (currentScrollY <= 10) {
      // At the very top - show navbar
      setIsHidden(false);
    }
    // Note: Removed the "show on scroll up" behavior

    setLastScrollY(currentScrollY);
  }, [lastScrollY, isHomeStylePage]);

  // Reset scroll-related states when route changes
  useEffect(() => {
    setIsOutOfHero(false);
    setIsHidden(false);
    setLastScrollY(0);
    setIsMobileMenuOpen(false); // Close mobile menu on route change
  }, [currentPath]);

  useEffect(() => {
    let ticking = false;

    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [handleScroll]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Our Services', path: '/our-services' },
    { label: 'Portfolio', path: '/portfolio' },
  ];

  const getBgColor = () => {
    if (isStandardPage) {
      // Standard pages always have white background
      return 'bg-transparent backdrop-blur-md';
    }

    // Home-style pages have scroll-based background
    if (backgroundColor === 'transparent') {
      return isOutOfHero ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent backdrop-blur-md';
    }
    return backgroundColor;
  };

  const getTextColor = () => {
    if (isStandardPage) {
      // Standard pages always have primary text
      return 'text-primary';
    }

    // Home-style pages have scroll-based text color
    return isOutOfHero ? 'text-primary' : 'text-white';
  };

  const getHoverTextColor = () => {
    return 'hover:text-secondary';
  };

  const getCurrentLogo = () => {
    if (isStandardPage) {
      // Standard pages always use logo1 (primary logo)
      return logo1;
    }

    // Home-style pages use scroll-based logo
    return isOutOfHero ? logo1 : logo2;
  };

  const isActiveRoute = (path: string) => {
    return currentPath === path;
  };

  return (
    <nav
      className={`
        ${isFixed ? 'fixed' : 'relative'} 
        top-0 left-0 right-0 z-50 
        transition-all duration-300 ease-in-out
        ${getBgColor()}
        ${isHidden ? '-translate-y-full' : 'translate-y-0'}
        ${className}
      `}
    >
      <Container>
        <div className='flex items-center justify-between h-16 lg:h-20'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link to='/' className='flex items-center'>
              <img
                src={getCurrentLogo()}
                alt='Travelmark Logo'
                className='h-12 lg:h-16 w-auto transition-all duration-300'
                loading='eager'
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center space-x-8'>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`${isActiveRoute(item.path) ? 'text-secondary' : getTextColor()
                  } ${getHoverTextColor()} font-medium transition-all duration-300 relative group ${isActiveRoute(item.path) ? 'font-semibold' : ''
                  }`}
              >
                {item.label}
                <span
                  className='absolute bottom-0 left-0 h-0.5 bg-secondary transition-all duration-300 w-0 group-hover:w-full '
                ></span>
              </Link>
            ))}
          </div>

          {/* Contact Us Button - Desktop */}
          <div className='hidden lg:block'>
            <Link to='/contact-us'>
              <Button size='sm' className='!text-[0.875rem]'>
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className='lg:hidden'>
            <Button

              variant='ghost'
              hideChevron
              size='icon'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${getTextColor()} ${getHoverTextColor()} hover:bg-transparent transition-colors duration-300 p-2`}
              aria-label='Toggle menu'
            >
              {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </Button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Menu */}
      <div
        className={`
          lg:hidden absolute top-full left-0 right-0 
          bg-white backdrop-blur-md shadow-sm
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}
        `}
      >
        <Container>
          <div className='py-6 space-y-4'>
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  block w-full text-left text-primary hover:text-secondary 
                  font-medium py-3 px-4 rounded-lg hover:bg-secondary/10
                  transition-all duration-300
                  ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                  ${isActiveRoute(item.path) ? 'font-semibold bg-secondary/10 text-secondary' : ''}
                `}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Contact Button */}
            <div className='pt-4 border-t border-gray-200'>
              <Button
                asChild
                className={`
                  w-full bg-secondary hover:bg-secondary/90 text-primary 
                  font-semibold px-6 py-3 rounded-lg transition-all duration-300
                  ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${navItems.length * 50}ms` : '0ms',
                }}
              >
                <a
                  href='https://wa.me/250788357850'
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </nav>
  );
};

export default Navbar;