import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../Search/SearchBar'
import { useAuth } from '../../contexts/AuthContext'

/* ── Sign-in modal ── */
function SignInModal({ onClose, onSignIn }) {
  const [name, setName] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const esc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  const submit = (e) => {
    e.preventDefault()
    onSignIn(name.trim() || 'Guest')
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#212121', border: '1px solid #383838', borderRadius: 16, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ background: '#ff0000', borderRadius: 6, padding: '4px 6px' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>
            <span style={{ color: '#f1f1f1' }}>Video</span><span style={{ color: '#ff0000' }}>Tube</span>
          </span>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f1f1', marginBottom: 6 }}>Sign in</h2>
        <p style={{ fontSize: 13, color: '#aaa', marginBottom: 24 }}>Enter your name to continue</p>

        <form onSubmit={submit}>
          <input
            ref={inputRef}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name (e.g. Alex)"
            style={{
              width: '100%', padding: '12px 16px', background: '#161616',
              border: '1.5px solid #383838', borderRadius: 10, color: '#f1f1f1',
              fontSize: 14, outline: 'none', marginBottom: 16, boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = '#3ea6ff'}
            onBlur={e => e.target.style.borderColor = '#383838'}
          />
          <button
            type="submit"
            style={{
              width: '100%', padding: '12px', background: '#ff0000', color: '#fff',
              border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14,
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#cc0000'}
            onMouseLeave={e => e.currentTarget.style.background = '#ff0000'}
          >
            Sign In
          </button>
        </form>

        <button
          onClick={onClose}
          style={{ width: '100%', marginTop: 10, padding: '10px', background: 'transparent', color: '#aaa', border: '1px solid #383838', borderRadius: 10, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = '#f1f1f1' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#aaa' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function Navbar({ onMenuClick }) {
  const { user, login, logout, subscriptionCount, subscriptions } = useAuth()
  const [menu, setMenu]         = useState(null)
  const [showSignIn, setShowSignIn] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenu(null) }
    const esc   = (e) => { if (e.key === 'Escape') setMenu(null) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [])

  const toggle = (k) => setMenu(p => p === k ? null : k)

  const handleSignOut = () => {
    logout()
    setMenu(null)
  }

  const initial = user?.name ? user.name[0].toUpperCase() : null

  // Subscribed channels list for notifications panel
  const subList = Object.values(subscriptions || {}).slice(0, 5)

  return (
    <>
      <header ref={ref} className="navbar">

        {/* Hamburger */}
        <button className="icon-btn" onClick={onMenuClick} aria-label="Toggle sidebar">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', flexShrink: 0, marginRight: 4 }}>
          <div style={{ background: '#ff0000', borderRadius: 6, padding: '4px 6px', display: 'flex' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <span className="sm-show" style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>
            <span style={{ color: '#f1f1f1' }}>Video</span><span style={{ color: '#ff0000' }}>Tube</span>
          </span>
        </Link>

        {/* Search */}
        <SearchBar />

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto', flexShrink: 0 }}>

          {/* Notifications — only when signed in */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button className="icon-btn" onClick={() => toggle('notif')} aria-label="Notifications" style={{ position: 'relative' }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                {subscriptionCount > 0 && (
                  <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, padding: '0 3px', background: '#ff0000', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    {subscriptionCount > 99 ? '99+' : subscriptionCount}
                  </span>
                )}
              </button>

              {menu === 'notif' && (
                <div className="dropdown" style={{ minWidth: 300, right: 0 }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2a', fontWeight: 600, fontSize: 14, color: '#f1f1f1' }}>
                    Subscriptions
                  </div>
                  {subList.length > 0 ? subList.map((sub, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #1a1a1a' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#e53e3e,#ed8936)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                        {(sub.title || '?')[0].toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, color: '#f1f1f1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.title}</span>
                    </div>
                  )) : (
                    <div style={{ padding: '16px', fontSize: 13, color: '#717171', textAlign: 'center' }}>
                      No subscriptions yet
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sign In button — when logged out */}
          {!user && (
            <button
              onClick={() => setShowSignIn(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'transparent', border: '1px solid #3ea6ff', borderRadius: 20, color: '#3ea6ff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(62,166,255,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              <span className="sm-show">Sign in</span>
            </button>
          )}

          {/* Avatar + account menu — when logged in */}
          {user && (
            <div style={{ position: 'relative', marginLeft: 4 }}>
              <button
                onClick={() => toggle('account')}
                aria-label="Account menu"
                title={user.name}
                style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#e53e3e,#ed8936)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', transition: 'box-shadow 0.15s', flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 2px #e53e3e'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {initial}
              </button>

              {menu === 'account' && (
                <div className="dropdown" style={{ minWidth: 220, right: 0 }}>
                  {/* User info header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #2a2a2a' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#e53e3e,#ed8936)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#fff', flexShrink: 0 }}>
                      {initial}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f1f1', marginBottom: 2 }}>{user.name}</p>
                      <p style={{ fontSize: 11.5, color: '#717171' }}>Manage account</p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: 4 }}>
                    <button className="dropdown-item" onClick={() => { navigate('/'); setMenu(null) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ color: '#aaa' }}>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                      Your channel
                    </button>

                    <button className="dropdown-item" onClick={() => setMenu(null)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ color: '#aaa' }}>
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                      </svg>
                      Settings
                    </button>

                    <div style={{ height: 1, background: '#2a2a2a', margin: '4px 0' }} />

                    <button
                      className="dropdown-item"
                      onClick={handleSignOut}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ff6b6b' }}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Sign-in modal */}
      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onSignIn={(name) => login(name)}
        />
      )}
    </>
  )
}
