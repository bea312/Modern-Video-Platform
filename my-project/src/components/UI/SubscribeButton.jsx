import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function SubscribeButton({ channelId, channelTitle, size = 'md', className = '' }) {
  const { isSubscribed, toggleSubscription } = useAuth()
  const [hovering, setHovering] = useState(false)
  const subscribed = isSubscribed(channelId)

  if (!channelId) return null

  const padding = size === 'lg' ? '10px 22px' : size === 'sm' ? '6px 14px' : '8px 18px'
  const fontSize = size === 'sm' ? 12.5 : 13.5

  return (
    <button
      type="button"
      className={`btn-subscribe ${subscribed ? 'subscribed' : 'unsubscribed'} ${className}`}
      style={{ padding, fontSize }}
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggleSubscription(channelId, channelTitle) }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-pressed={subscribed}
    >
      {subscribed ? (
        <>
          {hovering ? (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          )}
          {hovering ? 'Unsubscribe' : 'Subscribed'}
        </>
      ) : 'Subscribe'}
    </button>
  )
}
