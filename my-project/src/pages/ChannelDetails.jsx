import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../api/fetchFromAPI';
import ChannelCard from '../components/Media/ChannelCard';
import VideoCard from '../components/Media/VideoCard';
import Loader from '../components/Feedback/Loader';
import ErrorBanner from '../components/Feedback/ErrorBanner';
import { useAuth } from '../contexts/AuthContext';

const ChannelDetails = () => {
  const { id } = useParams();

  const {
    data: channelData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['channel', id],
    queryFn: () =>
      fetchFromAPI('channels', {
        part: 'snippet,statistics,brandingSettings,contentDetails',
        id
      }),
    enabled: Boolean(id)
  });

  const playlistId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  const {
    data: uploadsData,
    isLoading: loadingUploads,
    isError: uploadError
  } = useQuery({
    queryKey: ['channelUploads', playlistId],
    queryFn: () =>
      fetchFromAPI('playlistItems', {
        part: 'snippet,contentDetails',
        playlistId,
        maxResults: 24
      }),
    enabled: Boolean(playlistId)
  });

  const channel = channelData?.items?.[0];
  const { isSubscribed, toggleSubscription } = useAuth();
  const channelId = channel?.id;
  const subscribed = isSubscribed(channelId);
  const handleSubscribe = () => {
    if (!channelId) return;
    toggleSubscription(channelId, channel?.snippet?.title);
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorBanner message={error?.message} />;

  return (
    <div className="page-content channel-layout">
      <header
        className="channel-banner"
        style={{
          backgroundImage: channel?.brandingSettings?.image?.bannerExternalUrl
            ? `linear-gradient(90deg, rgba(3, 3, 3, .95), rgba(3, 3, 3, 0.4)), url(${channel?.brandingSettings?.image?.bannerExternalUrl})`
            : 'linear-gradient(90deg, rgba(3, 3, 3, .95), rgba(3, 3, 3, 0.4))'
        }}
      >
        <ChannelCard channel={channel} />
        <div className="channel-actions">
          <button
            type="button"
            className={`subscribe-btn ${subscribed ? 'subscribed' : ''}`}
            onClick={handleSubscribe}
          >
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
          <span className="subscribe-hint">
            {subscribed
              ? 'New uploads will appear in your home feed.'
              : 'Click to stay updated on new drops.'}
          </span>
        </div>
      </header>
      <section className="channel-section">
        <h2>Latest uploads</h2>
        {loadingUploads && <Loader />}
        {uploadError && <ErrorBanner message="Unable to load uploads." />}
        <div className="grid">
          {uploadsData?.items?.map((item) => (
            <VideoCard key={item.id || item.contentDetails?.videoId} video={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ChannelDetails;
