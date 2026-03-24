export default function ErrorBanner({ message, onRetry }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,0,0,0.08)', border: '1px solid rgba(255,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <svg viewBox="0 0 24 24" width="32" height="32" fill="#ff4444">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f1f1', marginBottom: 8 }}>Something went wrong</h3>
      <p style={{ fontSize: 13, color: '#aaa', maxWidth: 360, lineHeight: 1.6, marginBottom: 24 }}>
        {message || 'Unable to load content. This may be due to API rate limits. Please try again later.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: '#ff0000', color: '#fff', border: 'none', borderRadius: 20, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#cc0000'}
          onMouseLeave={e => e.currentTarget.style.background = '#ff0000'}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Try Again
        </button>
      )}
    </div>
  )
}
