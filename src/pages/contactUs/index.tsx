import { lazy } from 'react';

const Navbar = lazy(() => import('@/components/navbar/Navbar'));
const Hero = lazy(() => import('./Hero'));
const Footer = lazy(() => import('@/components/Footer'));

const ContactUs = () => {
  return (
    <>
      <Navbar bgColor='bg-secondary/1 backdrop-blur-md' border='none'/>
      <Hero />
      <Footer />
    </>
  );
};

export default ContactUs;