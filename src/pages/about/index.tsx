import { lazy } from 'react';
import Container from '@/components/Container';
import Navbar from '@/components/navbar/Navbar';
import Hero from './Hero';

// Lazy load components
const Mission = lazy(() => import('./Mission'));
const OurPresence = lazy(() => import('./OurPresence'));
const Team = lazy(() => import('./Team'));
const Footer = lazy(() => import('./Footer'));

const About = () => {
  return (
    <>
      <Navbar />
      <Container>
        <div>
          <Hero />
        </div>
      </Container>
      <Mission />
      <OurPresence />
      <Container>
        <Team />
      </Container>
      <Footer />
    </>
  );
};

export default About;
