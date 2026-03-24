import React, { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'
import FeedFixed from './components/Views/FeedFixed'
import VideoCardDetails from './components/Views/VideoCardDetails'
import ChannelDetails from './pages/ChannelDetails'
import SearchResults from './pages/SearchResults'

const BOTTOM_NAV = [
  {
    label: 'Home', category: 'All',
    icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  },
  {
    label: 'Trending', category: 'Entertainment',
    icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>,
  },
  {
    label: 'Explore', category: null,
    icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>,
  },
  {
    label: 'Music', category: 'Music',
    icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
  },
  {
    label: 'Gaming', category: 'Gaming',
    icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5S19.33 12 18.5 12z"/></svg>,
  },
]

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const selectCategory = (cat) => {
    setSelectedCategory(cat)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#f1f1f1', overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <Navbar onMenuClick={() => setSidebarOpen(p => !p)} />

      {/* ── Mobile sidebar backdrop ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 49 }}
        />
      )}

      {/* ── Sidebar ── */}
      <Sidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={selectCategory}
        isOpen={sidebarOpen}
      />

      {/* ── Main content: offset by sidebar on desktop ── */}
      <main className="content-area page-content">
        <Routes>
          <Route path="/" element={
            <FeedFixed selectedCategory={selectedCategory} setSelectedCategory={selectCategory} />
          } />
          <Route path="/video/:id"          element={<VideoCardDetails />} />
          <Route path="/channel/:id"        element={<ChannelDetails />} />
          <Route path="/search/:searchTerm" element={<SearchResults />} />
        </Routes>
      </main>

      {/* ── Mobile bottom nav (hidden on lg+ via CSS) ── */}
      <nav className="mobile-nav lg-hidden">
        {BOTTOM_NAV.map(item => {
          const active = isHome && selectedCategory === item.category
          return (
            <button
              key={item.label}
              className={`mobile-nav-item${active ? ' active' : ''}`}
              onClick={() => {
                if (item.category === null) {
                  setSidebarOpen(p => !p)
                } else {
                  navigate('/')
                  selectCategory(item.category)
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
