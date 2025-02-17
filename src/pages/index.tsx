import Home from './Home';
import Search from './Search';
import NotFound from './NotFound';

// pages
const HomePage: React.FC = () => <Home />;
const SearchPage: React.FC = () => <Search />;
const NotFoundPage: React.FC = () => <NotFound />;

// export
export {
  HomePage,
  SearchPage,
  NotFoundPage,
};
