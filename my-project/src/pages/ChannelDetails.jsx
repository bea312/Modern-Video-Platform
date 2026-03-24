import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchFromAPI } from '../api/fetchFromAPI'
import VideoCard from '../components/Media/VideoCard'
import Loader from '../components/Feedback/Loader'
import ErrorBanner from '../components/Feedback/ErrorBanner'
import SubscribeButton from '../components/UI/SubscribeButton'
import { shortenNumber } from '../utils/formatTime'

const TABS = ['Videos', 'About']

export default function ChannelDetails() {
  const { id } = useParams()
  const [tab, setTab] = useState('Videos')

  const { data: channelData, isLoading, isError, error } = useQuery({
    queryKey: ['channel', id],
    queryFn: () => fetchFromAPI(`channel?id=${id}`),
    enabled: Boolean(id),
  })

  const { data: videosData, isLoading: videosLoading } = useQuery({
    queryKey: ['channelVideos', id],
    queryFn: () => fetchFromAPI(`channelVideos?channelId=${id}`),
    enabled: Boolean(id),
  })

  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 320, gap: 16 }}>
      <div className="spinner" />
      <p style={{ color: '#717171', fontSize: 13 }}>Loading channel…</p>
    </div>
  )

  if (isError) return <ErrorBanner message={error?.message} />

  const channel = channelData?.data || channelData
  const videos  = videosData?.data || []
  const avatar  = Array.isArray(channel?.avatar) ? channel.avatar[0]?.url : channel?.avatar
  const banner  = Array.isArray(channel?.banner)  ? channel.banner[0]?.url  : channel?.banner

  return (
    <div style={{ minHeight: '100vh' }} className="animate-fade-up">

      {/* Banner */}
      <div style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden', background: '#1a1a1a' }}>
        {banner ? (
          <img src={banner} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #7a0000 0%, #1a0505 50%, #0f0f0f 100%)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f0f0f 0%, transparent 60%)', pointerEvents: 'none' }} />
      </div>

      {/* Channel header */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16, marginTop: -40, paddingBottom: 20, borderBottom: '1px solid #2a2a2a' }}>

          {/* Avatar */}
          <div style={{ flexShrink: 0, borderRadius: '50%', border: '4px solid #0f0f0f', boxShadow: '0 4px 20px rgba(0,0,0,0.6)', zIndex: 1 }}>
            {avatar ? (
              <img src={avatar} alt={channel?.title}
                style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.style.display = 'none' }} />
            ) : (
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg,#e53e3e,#ed8936)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: '#fff' }}>
                {(channel?.title || '?')[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f1f1', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60vw' }}>
                {channel?.title}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', fontSize: 13, color: '#aaa' }}>
                {channel?.channelHandle && <span style={{ color: '#717171' }}>@{channel.channelHandle}</span>}
                {channel?.subscriberCount && <span style={{ color: '#ccc', fontWeight: 500 }}>{shortenNumber(channel.subscriberCount)} subscribers</span>}
                {channel?.videoCount && <span>{shortenNumber(channel.videoCount)} videos</span>}
              </div>
            </div>
            <SubscribeButton channelId={id} channelTitle={channel?.title} size="lg" />
          </div>
        </div>

        {/* Tabs */}
        <nav className="tab-nav">
          {TABS.map(t => (
            <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div style={{ padding: '24px 20px 40px' }}>
        {tab === 'Videos' && (
          videosLoading ? <Loader count={8} /> :
          videos.length > 0 ? (
            <div className="video-grid">
              {videos.map(v => <VideoCard key={v.videoId} video={v} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#717171' }}>
              <svg viewBox="0 0 24 24" width="48" height="48" fill="#333" style={{ marginBottom: 12 }}>
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
              <p style={{ fontWeight: 600, color: '#aaa' }}>No videos uploaded yet</p>
            </div>
          )
        )}

        {tab === 'About' && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Subscribers', value: channel?.subscriberCount },
                { label: 'Videos',      value: channel?.videoCount },
                { label: 'Total Views', value: channel?.viewCount },
              ].filter(s => s.value).map(stat => (
                <div key={stat.label} className="stat-card">
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#f1f1f1', marginBottom: 4 }}>{shortenNumber(stat.value)}</p>
                  <p style={{ fontSize: 12, color: '#717171' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {channel?.description ? (
              <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Description</p>
                <p style={{ fontSize: 13.5, color: '#ccc', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{channel.description}</p>
              </div>
            ) : (
              <p style={{ color: '#717171', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>No description available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
