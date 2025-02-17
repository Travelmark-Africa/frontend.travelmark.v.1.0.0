import Home from './Home';
import Explore from './Explore';
import Destination from './Destination';
import TripPlan from './TripPlan';
import About from './About';
import Contact from './Contact';
import Search from './Search';
import NotFound from './NotFound';

// pages
const HomePage: React.FC = () => <Home />;
const ExplorePage: React.FC = () => <Explore />;
const DestinationPage: React.FC = () => <Destination />;
const TripPlanPage: React.FC = () => <TripPlan />;
const AboutPage: React.FC = () => <About />;
const ContactPage: React.FC = () => <Contact />;
const SearchPage: React.FC = () => <Search />;
const NotFoundPage: React.FC = () => <NotFound />;

// export
export { HomePage, ExplorePage, DestinationPage, TripPlanPage, AboutPage, ContactPage, SearchPage, NotFoundPage };
