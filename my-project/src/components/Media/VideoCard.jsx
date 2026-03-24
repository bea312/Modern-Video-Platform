import { useNavigate } from 'react-router-dom'
import { formatRelativeDate, shortenNumber } from '../../utils/formatTime'

export default function VideoCard({ video }) {
  const navigate = useNavigate()
  if (!video) return null

  // ── Resolve videoId across all known API shapes ──
  const videoId =
    video.videoId ||
    video.id?.videoId ||
    video.id ||
    null

  if (!videoId) return null

  // ── Resolve thumbnail ──
  const thumbnail =
    (Array.isArray(video.thumbnail)
      ? video.thumbnail.find(t => t?.url)?.url
      : video.thumbnail?.url || (typeof video.thumbnail === 'string' ? video.thumbnail : null)) ||
    (Array.isArray(video.thumbnails)
      ? video.thumbnails.find(t => t?.url)?.url
      : video.thumbnails?.high?.url || video.thumbnails?.medium?.url || video.thumbnails?.default?.url) ||
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  // ── Resolve other fields ──
  const channelId    = video.channelId || video.snippet?.channelId || null
  const channelTitle = video.channelTitle || video.snippet?.channelTitle || video.author || 'Unknown channel'
  const title        = video.title || video.snippet?.title || 'Untitled'
  const viewCount    = video.viewCount || video.statistics?.viewCount || null
  const publishedDate = video.publishedDate || video.snippet?.publishedAt || null
  const duration     = video.length || video.lengthText || null
  const isLive       = video.isLive || video.snippet?.liveBroadcastContent === 'live' || false

  return (
    <article
      className="video-card"
      onClick={() => navigate(`/video/${videoId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate(`/video/${videoId}`)
        }
      }}
      aria-label={`Play ${title}`}
    >
      {/* ── Thumbnail ── */}
      <div className="thumb-wrap">
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          onError={e => {
            // Fallback chain: hqdefault → mqdefault → placeholder
            if (!e.target.dataset.fallback) {
              e.target.dataset.fallback = '1'
              e.target.src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
            } else {
              e.target.src = 'https://placehold.co/480x270/1a1a1a/555?text=No+Preview'
            }
          }}
        />

        {/* Hover play overlay */}
        <div className="play-overlay">
          <div className="play-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        {duration && (
          <span className="duration">{duration}</span>
        )}

        {/* Live badge */}
        {isLive && (
          <span className="badge-live">LIVE</span>
        )}
      </div>

      {/* ── Info row ── */}
      <div className="info-row">
        {/* Channel avatar */}
        <div style={{ flexShrink: 0 }}>
          <button
            type="button"
            className="channel-avatar"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              if (channelId) navigate(`/channel/${channelId}`)
            }}
            style={{ border: 'none', cursor: channelId ? 'pointer' : 'default' }}
            aria-label={`Go to ${channelTitle}`}
          >
            {(channelTitle[0] || '?').toUpperCase()}
          </button>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="video-title">{title}</h3>

          <button
            type="button"
            className="channel-name"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              if (channelId) navigate(`/channel/${channelId}`)
            }}
            style={{
              background: 'none', border: 'none',
              cursor: channelId ? 'pointer' : 'default',
              padding: 0, textAlign: 'left',
              width: '100%', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {channelTitle}
          </button>

          <span className="meta">
            {viewCount ? `${shortenNumber(viewCount)} views` : ''}
            {viewCount && publishedDate ? ' • ' : ''}
            {publishedDate ? formatRelativeDate(publishedDate) : ''}
          </span>
        </div>
      </div>
    </article>
  )
}
