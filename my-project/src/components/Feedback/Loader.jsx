function SkeletonCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, marginBottom: 10 }} />
      <div style={{ display: 'flex', gap: 10 }}>
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 2 }}>
          <div className="skeleton" style={{ height: 13, borderRadius: 6, width: '100%' }} />
          <div className="skeleton" style={{ height: 13, borderRadius: 6, width: '80%' }} />
          <div className="skeleton" style={{ height: 11, borderRadius: 6, width: '50%' }} />
        </div>
      </div>
    </div>
  )
}

export default function Loader({ count = 12 }) {
  return (
    <div className="video-grid">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}
