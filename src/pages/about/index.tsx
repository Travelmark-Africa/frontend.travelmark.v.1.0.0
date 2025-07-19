import { lazy } from 'react';

// Lazy load all components
const WhoWeAre = lazy(() => import('./WhoWeAre'));
const OurServices = lazy(() => import('./OurServices'));
const OurPartners = lazy(() => import('./OurPartners'));
const OurPresence = lazy(() => import('./OurPresence'));
const Team = lazy(() => import('./Team'));

const About = () => {
  return (
    <>
      <WhoWeAre />
      <OurServices />
      <OurPartners />
      <OurPresence />
      <Team />
    </>
  );
};

export default About;
