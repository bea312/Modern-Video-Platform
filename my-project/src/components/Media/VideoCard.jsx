import { Link } from 'react-router-dom';
import { formatRelativeDate } from '../../utils/formatTime';

const extractVideoId = (video) => {
  if (!video) return '';
  if (typeof video.id === 'string') return video.id;
  if (video.id?.videoId) return video.id.videoId;
  if (video.id?.playlistId) return video.id.playlistId;
  return video?.contentDetails?.videoId || '';
};

const VideoCard = ({ video }) => {
  const snippet = video.snippet || {};
  const videoId = extractVideoId(video);
  const thumbnail = snippet?.thumbnails?.maxres?.url || snippet?.thumbnails?.high?.url || '';

  if (!videoId) return null;

  return (
    <article className="video-card">
      <Link to={`/video/${videoId}`} className="video-thumbnail">
        {thumbnail ? (
          <img src={thumbnail} alt={snippet.title} loading="lazy" />
        ) : (
          <div className="thumbnail-placeholder" aria-hidden />
        )}
      </Link>
      <div className="video-card-body">
        <Link to={`/video/${videoId}`} className="video-title">
          {snippet.title}
        </Link>
        <div className="video-meta">
          <Link to={`/channel/${snippet.channelId}`} className="video-channel">
            {snippet.channelTitle}
          </Link>
          <span>{formatRelativeDate(snippet.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
};

export default VideoCard;
