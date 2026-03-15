import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../api/fetchFromAPI';
import VideoPlayer from '../components/Media/VideoPlayer';
import VideoCard from '../components/Media/VideoCard';
import Loader from '../components/Feedback/Loader';
import ErrorBanner from '../components/Feedback/ErrorBanner';
import { formatRelativeDate, shortenNumber } from '../utils/formatTime';

const VideoDetails = () => {
  const { id } = useParams();

  const {
    data: meta,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['videoDetails', id],
    queryFn: () =>
      fetchFromAPI('videos', {
        part: 'snippet,statistics,contentDetails',
        id
      }),
    enabled: Boolean(id)
  });

  const video = meta?.items?.[0];
  const snippet = video?.snippet || {};
  const stats = video?.statistics || {};

  const {
    data: relatedData,
    isLoading: isRelating,
    isError: relatedError
  } = useQuery({
    queryKey: ['related', id],
    queryFn: () =>
      fetchFromAPI('search', {
        part: 'snippet',
        relatedToVideoId: id,
        type: 'video',
        maxResults: 12
      }),
    enabled: Boolean(id)
  });

  const relatedItems = relatedData?.items || [];

  if (isLoading) return <Loader />;
  if (isError) return <ErrorBanner message={error?.message} />;

  return (
    <div className="page-content video-details-layout">
      <div className="video-main">
        <VideoPlayer videoId={id} />
        <div className="video-detail-card">
          <h1>{snippet.title}</h1>
          <div className="video-stats">
            <span>{shortenNumber(stats.viewCount)} views</span>
            <span>{formatRelativeDate(snippet.publishedAt)}</span>
          </div>
          <div className="channel-entry">
            <Link to={`/channel/${snippet.channelId}`} className="channel-link">
              <span>{snippet.channelTitle}</span>
            </Link>
            <p>{snippet.description}</p>
          </div>
        </div>
      </div>
      <aside className="related-videos">
        <h2>Related</h2>
        {isRelating && <Loader />}
        {relatedError && <ErrorBanner message="Could not load related videos." />}
        <div className="related-list">
          {relatedItems.map((item) => (
            <VideoCard key={item.id?.videoId || item.id} video={item} />
          ))}
        </div>
      </aside>
    </div>
  );
};

export default VideoDetails;
