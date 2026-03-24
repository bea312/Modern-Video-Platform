import { useRef, useState, useEffect } from 'react'

const VideoPlayer = ({ videoId }) => {
  const containerRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    const t = setTimeout(() => setLoaded(true), 800)
    return () => clearTimeout(t)
  }, [videoId])

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
  }

  if (!videoId) return null

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black group"
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* Loading shimmer */}
      {!loaded && (
        <div className="absolute inset-0 skeleton flex items-center justify-center z-10">
          <div className="w-12 h-12 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
        </div>
      )}

      <iframe
        key={videoId}
        title={`YouTube video ${videoId}`}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=red`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full border-0"
      />

      {/* Custom fullscreen button */}
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute bottom-3 right-3 z-20 p-2 bg-black/70 rounded-lg text-white opacity-0 group-hover:opacity-100 hover:bg-black/90 transition-all"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default VideoPlayer
