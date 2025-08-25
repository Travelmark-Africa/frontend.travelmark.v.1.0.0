import { Mail, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import Container from '@/components/Container';
import { logo2 } from '@/assets';
import { Link, useLocation } from 'react-router-dom';
import { hideFooterOrNavbarRoutes } from '@/constants';
import { useCreateSubscriptionMutation } from '@/hooks/useSubscriptions';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { handleError } from '@/lib/utils';

// Type definition for icon props
interface IconProps {
  className?: string;
}

// Custom SVG Icons
const InstagramIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
  </svg>
);

const TwitterIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

const LinkedInIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
  </svg>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  // Check if current route should hide footer
  const shouldHideFooter = hideFooterOrNavbarRoutes.some(route => location.pathname.includes(route));

  // Newsletter subscription form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormData>();
  const createSubscriptionMutation = useCreateSubscriptionMutation();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about-us' },
    { name: 'Services', href: '/our-services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact-us' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com/travelmarkafrica' },
    { name: 'Twitter', icon: TwitterIcon, href: 'https://twitter.com/travelmarkafrica' },
    { name: 'LinkedIn', icon: LinkedInIcon, href: 'https://linkedin.com/company/travelmarkafrica' },
  ];

  // Handle newsletter subscription
  const onSubscribe = async (data: SubscriptionFormData) => {
    try {
      const result = await createSubscriptionMutation.mutateAsync(data);
      if (result?.ok) {
        toast.success(result.message);
        reset(); // Clear the form
      } else {
        toast.error(result.message || 'Failed to subscribe');
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Don't render footer if on restricted routes
  if (shouldHideFooter) {
    return null;
  }

  return (
    <footer className='bg-gray-900 text-white'>
      <Container>
        <div className='py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8'>
            {/* Company Info */}
            <div className='lg:col-span-4 space-y-4'>
              <Link to='/' className='flex items-center'>
                <img src={logo2} alt='TravelMark Africa' className='h-16 w-auto' />
              </Link>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Your trusted partner for high-impact events, destination marketing, and MICE consultancy across Africa.
              </p>

              {/* Social Links */}
              <div className='space-y-3'>
                <h3 className='text-sm font-medium text-gray-300 uppercase tracking-wide'>Follow Us</h3>
                <div className='flex space-x-3'>
                  {socialLinks.map(social => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-gray-400 hover:text-secondary transition-colors p-2 rounded-lg hover:bg-gray-800'
                        aria-label={social.name}
                      >
                        <IconComponent className='h-4 w-4' />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className='lg:col-span-2 space-y-4'>
              <h3 className='text-sm font-medium text-gray-300 uppercase tracking-wide'>Quick Links</h3>
              <ul className='space-y-3'>
                {quickLinks.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className='text-gray-400 hover:text-white transition-colors text-sm'>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className='lg:col-span-3 space-y-4'>
              <h3 className='text-sm font-medium text-gray-300 uppercase tracking-wide'>Contact Info</h3>
              <div className='space-y-3'>
                <div className='flex items-center text-gray-400'>
                  <Phone className='h-4 w-4 mr-3 text-secondary flex-shrink-0' />
                  <a href='tel:+250788357850' className='hover:text-white transition-colors text-sm'>
                    +250 788 357 850
                  </a>
                </div>
                <div className='flex items-center text-gray-400'>
                  <Mail className='h-4 w-4 mr-3 text-secondary flex-shrink-0' />
                  <a href='mailto:info@travelmark.africa' className='hover:text-white transition-colors text-sm'>
                    info@travelmark.africa
                  </a>
                </div>
                <div className='flex items-start text-gray-400'>
                  <MapPin className='h-4 w-4 mr-3 text-secondary flex-shrink-0 mt-0.5' />
                  <span className='text-sm'>
                    Kigali, Rwanda
                    <br />
                    <span className='text-xs'>Serving All of Africa</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className='lg:col-span-3 space-y-4'>
              <h3 className='text-sm font-medium text-gray-300 uppercase tracking-wide'>Stay Updated</h3>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Get updates on Africa's top MICE and business events.
              </p>
              <form onSubmit={handleSubmit(onSubscribe)} className='space-y-3'>
                <div className='relative'>
                  <input
                    type='email'
                    placeholder='Enter your email'
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    disabled={createSubscriptionMutation.isPending}
                    className='w-full pl-4 pr-12 py-3 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                  />
                  <button
                    type='submit'
                    disabled={createSubscriptionMutation.isPending}
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-secondary hover:bg-secondary/90 text-primary rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {createSubscriptionMutation.isPending ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <ArrowRight className='h-4 w-4' />
                    )}
                  </button>
                </div>
                {errors.email && <p className='text-red-400 text-xs mt-1'>{errors.email.message}</p>}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className='border-t border-gray-800 py-6'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500'>
            <p>&copy; {currentYear} TravelMark Africa. All rights reserved.</p>
            <div className='flex items-center space-x-6'>
              <a href='/faq' className='hover:text-gray-400 transition-colors'>
                FAQ
              </a>
              <span className='text-gray-700'>|</span>
              <Link to='/auth/login' className='hover:text-gray-400 transition-colors'>
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
