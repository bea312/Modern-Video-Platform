import { Link } from 'react-router-dom'
import { shortenNumber } from '../../utils/formatTime'

export default function ChannelCard({ channel }) {
  if (!channel) return null

  const channelId = channel.channelId || channel.id
  const title = channel.title || channel.snippet?.title || channel.channelTitle
  const avatar =
    (Array.isArray(channel.avatar) ? channel.avatar[0]?.url : null) ||
    channel.snippet?.thumbnails?.high?.url ||
    (Array.isArray(channel.thumbnail) ? channel.thumbnail[0]?.url : null)
  const subscriberCount = channel.subscriberCount || channel.statistics?.subscriberCount
  const description = channel.description || channel.snippet?.description

  if (!channelId) return null

  return (
    <Link to={`/channel/${channelId}`} className="channel-card animate-fade-up">
      {avatar ? (
        <img src={avatar} alt={title} loading="lazy"
          style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', marginBottom: 12, border: '3px solid #2a2a2a', transition: 'border-color 0.15s' }}
          onError={e => { e.target.style.display = 'none' }}
          onMouseEnter={e => e.target.style.borderColor = '#e53e3e'}
          onMouseLeave={e => e.target.style.borderColor = '#2a2a2a'}
        />
      ) : (
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#e53e3e,#ed8936)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 12, border: '3px solid #2a2a2a' }}>
          {(title || '?')[0].toUpperCase()}
        </div>
      )}

      <p style={{ fontWeight: 600, fontSize: 13.5, color: '#f1f1f1', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>
        {title}
      </p>
      <p style={{ fontSize: 12, color: '#aaa', marginBottom: description ? 8 : 12 }}>
        {subscriberCount ? `${shortenNumber(subscriberCount)} subscribers` : 'Channel'}
      </p>
      {description && (
        <p style={{ fontSize: 11.5, color: '#717171', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textAlign: 'center' }}>
          {description}
        </p>
      )}
      <span style={{ marginTop: 'auto', padding: '6px 16px', background: '#f1f1f1', color: '#0f0f0f', borderRadius: 16, fontSize: 12.5, fontWeight: 600, transition: 'background 0.15s, color 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e53e3e'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#f1f1f1'; e.currentTarget.style.color = '#0f0f0f' }}>
        View Channel
      </span>
    </Link>
  )
}
