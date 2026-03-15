import { Link } from 'react-router-dom';
import { shortenNumber } from '../../utils/formatTime';

const ChannelCard = ({ channel }) => {
  if (!channel) return null;
  const snippet = channel.snippet || {};
  const stats = channel.statistics || {};

  return (
    <article className="channel-card">
      <Link to={`/channel/${channel.id}`} className="channel-avatar">
        <img src={snippet?.thumbnails?.high?.url} alt={snippet?.title} loading="lazy" />
      </Link>
      <div className="channel-details">
        <Link to={`/channel/${channel.id}`} className="channel-name">
          {snippet?.title}
        </Link>
        <p className="channel-subs">
          {stats.subscriberCount ? `${shortenNumber(stats.subscriberCount)} subscribers` : 'Subscriber count private'}
        </p>
      </div>
    </article>
  );
};

export default ChannelCard;
