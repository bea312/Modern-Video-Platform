import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useDebounce from '../../hooks/useDebounce';
import { fetchFromAPI } from '../../api/fetchFromAPI';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const debouncedValue = useDebounce(query, 400);

  const { data } = useQuery({
    queryKey: ['suggestions', debouncedValue],
    queryFn: () =>
      fetchFromAPI('search', {
        part: 'snippet',
        q: debouncedValue,
        maxResults: 6,
        type: 'video'
      }),
    enabled: Boolean(debouncedValue),
    staleTime: 2 * 60 * 1000
  });

  const suggestions = data?.items ?? [];

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/search/${encodeURIComponent(query.trim())}`);
    setFocused(false);
  };

  const handleSuggestion = (term) => {
    setQuery(term);
    navigate(`/search/${encodeURIComponent(term)}`);
    setFocused(false);
  };

  return (
    <div className="search-wrapper">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-field"
          placeholder="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
      </form>
      {focused && debouncedValue && suggestions.length > 0 && (
        <div className="suggestions-card">
          {suggestions.map((video) => {
            const videoTitle = video.snippet?.title || 'Untitled';
            const videoId = (video.id && video.id.videoId) || video.id;
            return (
              <button
                type="button"
                key={videoId}
                className="suggestion"
                onMouseDown={() => handleSuggestion(videoTitle)}
              >
                <span>{videoTitle}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
