import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchFromAPI } from '../../api/fetchFromAPI'
import useDebounce from '../../hooks/useDebounce'

export default function SearchBar() {
  const [term, setTerm]           = useState('')
  const [open, setOpen]           = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const navigate    = useNavigate()
  const wrapRef     = useRef(null)
  const inputRef    = useRef(null)
  const debounced   = useDebounce(term, 420)

  const { data } = useQuery({
    queryKey: ['suggestions', debounced],
    queryFn:  () => fetchFromAPI(`search?query=${encodeURIComponent(debounced)}&type=video`),
    enabled:  debounced.trim().length > 2,
    staleTime: 1000 * 60 * 2,
  })

  const suggestions = data?.data?.slice(0, 7) || []

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false); setActiveIdx(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setActiveIdx(-1) }, [suggestions.length])

  const go = (q) => {
    if (!q?.trim()) return
    navigate(`/search/${encodeURIComponent(q.trim())}`)
    setTerm(q.trim()); setOpen(false); setActiveIdx(-1)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    go(activeIdx >= 0 ? suggestions[activeIdx]?.title : term)
  }

  const onKey = (e) => {
    if (!open || !suggestions.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)) }
    if (e.key === 'Escape')    { setOpen(false); setActiveIdx(-1) }
  }

  return (
    <div ref={wrapRef} className="search-wrap">
      <form onSubmit={onSubmit} className="search-form">
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          value={term}
          placeholder="Search"
          autoComplete="off"
          onChange={e => { setTerm(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
        />
        {term && (
          <button type="button" className="search-clear"
            onClick={() => { setTerm(''); setOpen(false); inputRef.current?.focus() }}
            aria-label="Clear">
            ✕
          </button>
        )}
        <button type="submit" className="search-btn" aria-label="Search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#aaa">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((item, i) => (
            <button
              key={item.videoId || i}
              className={`suggestion-item${i === activeIdx ? ' highlighted' : ''}`}
              onClick={() => go(item.title)}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#717171" style={{ flexShrink: 0 }}>
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
