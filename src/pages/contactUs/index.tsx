import { lazy } from 'react';

const Navbar = lazy(() => import('@/components/navbar/Navbar'));
const Footer = lazy(() => import('@/components/Footer'));

const Hero = lazy(() => import('./Hero'));
const FAQs = lazy(() => import('./FAQs'));

const ContactUs = () => {
  return (
    <>
      <Navbar bgColor='bg-secondary/1 backdrop-blur-md' />
      <Hero />
      <FAQs />
      <Footer />
    </>
  );
};

export default ContactUs;
