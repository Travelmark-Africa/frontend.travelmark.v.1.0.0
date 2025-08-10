import { lazy } from 'react';

const Hero = lazy(() => import('./Hero'));
const FAQs = lazy(() => import('./FAQs'));

const ContactUs = () => {
  return (
    <main>
      <Hero />
      <FAQs />
    </main>
  );
};

export default ContactUs;
