import { lazy } from 'react';

// Lazy load all components
const Navbar = lazy(() => import('@/components/navbar/Navbar'));
const Container = lazy(() => import('@/components/Container'));
const Hero = lazy(() => import('./Hero'));
const Mission = lazy(() => import('./Mission'));
const OurPresence = lazy(() => import('./OurPresence'));
const Team = lazy(() => import('./Team'));
const Footer = lazy(() => import('../../components/Footer'));

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