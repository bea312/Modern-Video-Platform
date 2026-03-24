import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchFromAPI } from '../../api/fetchFromAPI'
import VideoPlayer from '../Media/VideoPlayer'
import ErrorBanner from '../Feedback/ErrorBanner'
import SubscribeButton from '../UI/SubscribeButton'
import { formatRelativeDate, shortenNumber } from '../../utils/formatTime'
import { useAuth } from '../../contexts/AuthContext'

function RelatedRow({ rv }) {
  const thumb = Array.isArray(rv.thumbnail) ? rv.thumbnail[0]?.url : rv.thumbnail
  return (
    <Link to={`/video/${rv.videoId}`} className="related-row">
      <div className="related-thumb">
        <img src={thumb} alt={rv.title} loading="lazy"
          onError={e => { e.target.src = 'https://placehold.co/160x90/1a1a1a/555?text=...' }} />
        {rv.length && (
          <span style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.9)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 4px', borderRadius: 3 }}>
            {rv.length}
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f1f1', lineHeight: 1.35, marginBottom: 4, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
          {rv.title}
        </p>
        <p style={{ fontSize: 11.5, color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{rv.channelTitle}</p>
        {rv.viewCount && <p style={{ fontSize: 11.5, color: '#717171' }}>{shortenNumber(rv.viewCount)} views</p>}
      </div>
    </Link>
  )
}

function RelatedSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, padding: 6 }}>
          <div className="skeleton" style={{ width: 160, aspectRatio: '16/9', borderRadius: 8, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, paddingTop: 4 }}>
            <div className="skeleton" style={{ height: 12, borderRadius: 5, width: '100%' }} />
            <div className="skeleton" style={{ height: 12, borderRadius: 5, width: '75%' }} />
            <div className="skeleton" style={{ height: 10, borderRadius: 5, width: '50%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function VideoCardDetails() {
  const { id } = useParams()
  const { user, isSubscribed } = useAuth()
  const [liked, setLiked]     = useState(false)
  const [showDesc, setShowDesc] = useState(false)

  const { data: videoData, isLoading, isError, error } = useQuery({
    queryKey: ['videoDetails', id],
    queryFn: () => fetchFromAPI(`video?id=${id}`),
    enabled: Boolean(id),
  })

  const raw   = videoData?.data
  const video = Array.isArray(raw) ? raw[0] : raw

  const { data: relatedData, isLoading: relatedLoading } = useQuery({
    queryKey: ['related', id, video?.channelTitle],
    queryFn: () => fetchFromAPI(`search?query=${encodeURIComponent(video?.channelTitle || video?.title || 'popular')}&type=video`),
    enabled: Boolean(video?.channelTitle || video?.title),
    staleTime: 1000 * 60 * 5,
  })

  const related = relatedData?.data?.filter(v => v.videoId !== id).slice(0, 15) || []

  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 320, gap: 16 }}>
      <div className="spinner" />
      <p style={{ color: '#717171', fontSize: 13 }}>Loading video…</p>
    </div>
  )

  if (isError) return <ErrorBanner message={error?.message} />

  const subscribed = isSubscribed(video?.channelId)

  return (
    <div
      className="video-details-layout"
      style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 16px 40px', maxWidth: 1600, margin: '0 auto' }}
    >
      {/* ── LEFT: Player + Info ── */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Player */}
        <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', boxShadow: '0 4px 32px rgba(0,0,0,0.6)' }}>
          <VideoPlayer videoId={id} />
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f1f1', lineHeight: 1.35, margin: '16px 0 12px' }}>
          {video?.title}
        </h1>

        {/* Channel row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingBottom: 16, borderBottom: '1px solid #2a2a2a' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
            <Link
              to={`/channel/${video?.channelId}`}
              style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#e53e3e,#ed8936)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff', textDecoration: 'none', flexShrink: 0 }}
            >
              {(video?.channelTitle || '?')[0].toUpperCase()}
            </Link>
            <div style={{ minWidth: 0 }}>
              <Link
                to={`/channel/${video?.channelId}`}
                style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#f1f1f1', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {video?.channelTitle}
              </Link>
              {subscribed && <span style={{ fontSize: 11, color: '#717171' }}>Subscribed</span>}
            </div>
            <SubscribeButton channelId={video?.channelId} channelTitle={video?.channelTitle} size="md" />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Like/Dislike */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#272727', borderRadius: 20, overflow: 'hidden', border: '1px solid #3a3a3a' }}>
              <button
                className={`action-pill${liked ? ' liked' : ''}`}
                style={{ borderRadius: 0, border: 'none', borderRight: '1px solid #3a3a3a' }}
                onClick={() => setLiked(p => !p)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                </svg>
                {video?.likeCount
                  ? shortenNumber(liked ? Number(video.likeCount) + 1 : video.likeCount)
                  : liked ? '1' : 'Like'}
              </button>
              <button className="action-pill" style={{ borderRadius: 0, border: 'none' }} aria-label="Dislike">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                </svg>
              </button>
            </div>

            <button className="action-pill">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
              Share
            </button>

            <button className="action-pill">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              Save
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="desc-box" onClick={() => setShowDesc(p => !p)}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
            {video?.viewCount && (
              <span style={{ fontSize: 13.5, fontWeight: 600, color: '#f1f1f1' }}>
                {shortenNumber(video.viewCount)} views
              </span>
            )}
            {video?.publishedDate && (
              <span style={{ fontSize: 13.5, color: '#aaa' }}>
                {formatRelativeDate(video.publishedDate)}
              </span>
            )}
          </div>
          {video?.description && (
            <>
              <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6, whiteSpace: 'pre-line', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: showDesc ? 'unset' : 3, overflow: 'hidden' }}>
                {video.description}
              </p>
              <span style={{ display: 'inline-block', marginTop: 8, fontSize: 13, fontWeight: 600, color: '#f1f1f1' }}>
                {showDesc ? 'Show less' : 'Show more'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT: Related ── */}
      <div className="related-sidebar">
        <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f1f1', marginBottom: 12, paddingLeft: 4 }}>Up Next</p>
        {relatedLoading ? (
          <RelatedSkeleton />
        ) : related.length > 0 ? (
          <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 12, padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {related.map(rv => <RelatedRow key={rv.videoId} rv={rv} />)}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: '#717171', paddingLeft: 4 }}>No related videos found.</p>
        )}
      </div>
    </div>
  )
}
