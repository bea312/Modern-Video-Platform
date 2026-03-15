import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../api/fetchFromAPI';
import Sidebar from '../components/Layout/Sidebar';
import CategoryPills from '../components/UI/CategoryPills';
import VideoCard from '../components/Media/VideoCard';
import Loader from '../components/Feedback/Loader';
import ErrorBanner from '../components/Feedback/ErrorBanner';
import categories from '../constants/categories';

const Feed = ({ manualQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);

  const queryTerm = manualQuery || selectedCategory;

  const queryKey = useMemo(
    () => (manualQuery ? ['feed', 'search', manualQuery] : ['feed', 'category', selectedCategory]),
    [manualQuery, selectedCategory]
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      if (manualQuery) {
        return fetchFromAPI('search', {
          part: 'snippet',
          q: manualQuery,
          maxResults: 20,
          regionCode: 'US',
          type: 'video'
        });
      }

      if (selectedCategory === 'All') {
        return fetchFromAPI('videos', {
          part: 'snippet',
          chart: 'mostPopular',
          regionCode: 'US',
          maxResults: 20
        });
      }

      return fetchFromAPI('search', {
        part: 'snippet',
        q: selectedCategory,
        maxResults: 20,
        regionCode: 'US',
        type: 'video'
      });
    },
    keepPreviousData: true,
    staleTime: 4 * 60 * 1000
  });

  const items = data?.items || [];

  return (
    <div className="page-content">
      <Sidebar selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      <div className="feed-panel">
        <CategoryPills activeCategory={selectedCategory} onChange={setSelectedCategory} />
        <section className="section-header">
          <div>
            <h1>{manualQuery ? `Search results for "${manualQuery}"` : selectedCategory}</h1>
         
          </div>
        </section>
        {isLoading && <Loader />}
        {isError && <ErrorBanner message={(error && error.message) || 'Unable to load videos.'} />}
        {!isLoading && !isError && (
          <div className="grid">
            {items.map((item) => (
              <VideoCard key={(item.id?.videoId || item.id)} video={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
