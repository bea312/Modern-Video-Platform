import { useParams } from 'react-router-dom';
import Feed from './Feed';

const SearchResults = () => {
  const { query } = useParams();
  return <Feed manualQuery={query} key={query} />;
};

export default SearchResults;
