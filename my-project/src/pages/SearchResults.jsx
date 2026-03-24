import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchFromAPI } from '../api/fetchFromAPI'
import ChannelCard from '../components/Media/ChannelCard'
import Loader from '../components/Feedback/Loader'
import ErrorBanner from '../components/Feedback/ErrorBanner'
import { shortenNumber, formatRelativeDate } from '../utils/formatTime'

function VideoRow({ video }) {
  const thumbnail =
    (Array.isArray(video.thumbnail) ? video.thumbnail[0]?.url : video.thumbnail?.url || video.thumbnail) ||
    'https://placehold.co/480x270/1a1a1a/555?text=No+Preview'

  return (
    <Link to={`/video/${video.videoId}`}
      style={{ display: 'flex', gap: 16, padding: '10px 8px', borderRadius: 12, textDecoration: 'none', transition: 'background 0.12s' }}
      onMouseEnter={e => e.currentTarget.style.background = '#161616'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', flexShrink: 0, width: 200, borderRadius: 10, overflow: 'hidden', background: '#1a1a1a' }}>
        <div style={{ aspectRatio: '16/9', position: 'relative' }}>
          <img src={thumbnail} alt={video.title} loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = 'https://placehold.co/480x270/1a1a1a/555?text=No+Preview' }} />
        </div>
        {video.length && (
          <span style={{ position: 'absolute', bottom: 5, right: 5, background: 'rgba(0,0,0,0.9)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 5px', borderRadius: 4 }}>
            {video.length}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f1f1', lineHeight: 1.4, marginBottom: 6, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
          {video.title}
        </h3>
        <p style={{ fontSize: 12.5, color: '#717171', marginBottom: 8 }}>
          {video.viewCount ? `${shortenNumber(video.viewCount)} views` : ''}
          {video.viewCount && video.publishedDate ? ' • ' : ''}
          {video.publishedDate ? formatRelativeDate(video.publishedDate) : ''}
        </p>
        {video.channelTitle && (
          <Link to={`/channel/${video.channelId}`}
            onClick={e => e.stopPropagation()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#e53e3e,#ed8936)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {(video.channelTitle[0] || '?').toUpperCase()}
            </div>
            <span style={{ fontSize: 12.5, color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {video.channelTitle}
            </span>
          </Link>
        )}
        {video.description && (
          <p style={{ fontSize: 12.5, color: '#717171', lineHeight: 1.5, marginTop: 8, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
            {video.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export default function SearchResults() {
  const { searchTerm } = useParams()
  const decoded = decodeURIComponent(searchTerm || '')

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['search', decoded],
    queryFn: () => fetchFromAPI(`search?query=${encodeURIComponent(decoded)}`),
    enabled: Boolean(decoded),
    staleTime: 1000 * 60 * 5,
  })

  const results  = data?.data || []
  const channels = results.filter(item => item.type === 'channel' || (!item.videoId && item.channelId))
  const videos   = results.filter(item => item.videoId)

  if (isLoading) return <div style={{ padding: '24px 20px' }}><Loader count={8} /></div>
  if (isError)   return <ErrorBanner message={error?.message} onRetry={refetch} />

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px 48px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #2a2a2a' }}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#717171">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f1f1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Results for <span style={{ color: '#aaa' }}>"{decoded}"</span>
        </h2>
        {results.length > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#717171', flexShrink: 0 }}>
            {results.length} results
          </span>
        )}
      </div>

      {/* Empty */}
      {results.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <svg viewBox="0 0 24 24" width="30" height="30" fill="#444">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <p style={{ fontWeight: 600, color: '#f1f1f1', marginBottom: 6 }}>No results found</p>
          <p style={{ fontSize: 13, color: '#717171' }}>Try different keywords</p>
        </div>
      )}

      {/* Channels */}
      {channels.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Channels</p>
          <div className="channel-grid">
            {channels.map(ch => <ChannelCard key={ch.channelId || ch.id} channel={ch} />)}
          </div>
          <div style={{ height: 1, background: '#2a2a2a', margin: '28px 0' }} />
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section>
          {channels.length > 0 && (
            <p style={{ fontSize: 11, fontWeight: 600, color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Videos</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {videos.map(v => <VideoRow key={v.videoId} video={v} />)}
          </div>
        </section>
      )}
    </div>
  )
}
