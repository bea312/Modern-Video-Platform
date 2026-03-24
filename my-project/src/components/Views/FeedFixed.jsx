import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchFromAPI } from '../../api/fetchFromAPI'
import VideoCard from '../Media/VideoCard'
import Loader from '../Feedback/Loader'
import ErrorBanner from '../Feedback/ErrorBanner'
import CategoryPills from '../UI/CategoryPills'

export default function FeedFixed({ selectedCategory, setSelectedCategory }) {
  const [extraVideos, setExtraVideos]     = useState([])
  const [nextPageToken, setNextPageToken] = useState(null)
  const [loadingMore, setLoadingMore]     = useState(false)

  // Reset extra pages whenever category changes
  useEffect(() => {
    setExtraVideos([])
    setNextPageToken(null)
  }, [selectedCategory])

  // Always use search — trending returns empty for this API key
  const searchTerm = selectedCategory === 'All' ? 'trending' : selectedCategory
  const endpoint   = `search?query=${encodeURIComponent(searchTerm)}&type=video`

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['feed', selectedCategory],
    queryFn:  () => fetchFromAPI(endpoint),
    staleTime: 1000 * 60 * 5,
  })

  // Sync nextPageToken from primary query
  useEffect(() => {
    if (data?.nextPage) setNextPageToken(data.nextPage)
  }, [data])

  // Normalise response shape
  const baseVideos = data?.data || data?.videos || data?.items || []
  const allVideos  = [...baseVideos, ...extraVideos]

  const loadMore = async () => {
    if (!nextPageToken || loadingMore) return
    setLoadingMore(true)
    try {
      const more = await fetchFromAPI(
        `search?query=${encodeURIComponent(searchTerm)}&type=video&nextPage=${encodeURIComponent(nextPageToken)}`
      )
      const newVideos = more?.data || more?.videos || more?.items || []
      setExtraVideos(prev => {
        const seen = new Set([...baseVideos, ...prev].map(v => v.videoId))
        return [...prev, ...newVideos.filter(v => !seen.has(v.videoId))]
      })
      setNextPageToken(more?.nextPage || null)
    } catch (e) {
      console.error('Load more failed:', e)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>

      <CategoryPills activeCategory={selectedCategory} onChange={setSelectedCategory} />

      <div style={{ padding: '20px 16px 48px' }}>

        {isLoading && <Loader count={12} />}

        {isError && (
          <ErrorBanner
            message={
              error?.response?.status === 429
                ? 'API rate limit reached. Please wait a moment and try again.'
                : error?.message
            }
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (
          <>
            {allVideos.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 16px', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="#444">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                </div>
                <p style={{ fontWeight: 600, fontSize: 16, color: '#f1f1f1', marginBottom: 6 }}>No videos found</p>
                <p style={{ fontSize: 13, color: '#717171' }}>Try a different category</p>
              </div>
            ) : (
              <>
                <div className="video-grid">
                  {allVideos.map((video, i) => (
                    <VideoCard key={video.videoId || i} video={video} />
                  ))}
                </div>

                {nextPageToken && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '12px 32px',
                        background: '#272727',
                        color: '#f1f1f1',
                        border: '1px solid #383838',
                        borderRadius: 24,
                        fontSize: 14, fontWeight: 600,
                        cursor: loadingMore ? 'not-allowed' : 'pointer',
                        opacity: loadingMore ? 0.6 : 1,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (!loadingMore) e.currentTarget.style.background = '#383838' }}
                      onMouseLeave={e => { if (!loadingMore) e.currentTarget.style.background = '#272727' }}
                    >
                      {loadingMore ? (
                        <>
                          <div style={{ width: 16, height: 16, border: '2px solid #555', borderTopColor: '#f1f1f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                          Loading…
                        </>
                      ) : (
                        'Load more videos'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
