import React from 'react'
import categories from '../../constants/categories'

const PRIMARY = [
  { label: 'Home',          category: 'All',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
  { label: 'Trending',      category: 'Entertainment',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg> },
  { label: 'Subscriptions', category: 'Music',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg> },
  { label: 'Library',       category: 'Podcasts',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg> },
]

export default function Sidebar({ selectedCategory, setSelectedCategory, isOpen }) {
  return (
    <aside className={`sidebar${isOpen ? ' open' : ''} scrollbar-none`}>
      <nav style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Primary items */}
        <div style={{ padding: '0 8px', marginBottom: 4 }}>
          {PRIMARY.map(({ label, category, icon }) => {
            const active = selectedCategory === category
            return (
              <button
                key={label}
                className={`sidebar-item${active ? ' active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <span style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icon}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="divider" />

        {/* Explore label */}
        <div style={{ padding: '6px 20px 4px', fontSize: 11, fontWeight: 600, color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Explore
        </div>

        {/* Category items */}
        <div style={{ padding: '0 8px', flex: 1, overflowY: 'auto' }} className="scrollbar-none">
          {categories.filter(c => c.name !== 'All').map(({ name, icon }) => {
            const active = selectedCategory === name
            return (
              <button
                key={name}
                className={`sidebar-item${active ? ' active' : ''}`}
                onClick={() => setSelectedCategory(name)}
              >
                <span style={{ width: 20, textAlign: 'center', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>
                  {icon}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #2a2a2a', marginTop: 8, flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: '#555' }}>© 2026 VideoTube</p>
        </div>
      </nav>
    </aside>
  )
}
