import Container from '@/components/Container';
import Navbar from '@/components/navbar/Navbar';
import Hero from './Hero';
import Mission from './Mission';
import OurPresence from './OurPresence';
import Team from './Team';
import Footer from './Footer';

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
