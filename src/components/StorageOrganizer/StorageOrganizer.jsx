import { useEffect, useMemo, useRef, useState } from 'react'
import { storageUnits } from '../../data/storageUnits'
import StorageMap from './StorageMap'
import './StorageOrganizer.css'

// Yale (Old Campus, roughly) — the "dorm" reference for distance sort.
const DORM_COORDS = [41.3081, -72.9298]

const SORT_OPTIONS = [
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Star rating' },
  { id: 'distance', label: 'Distance from dorm' },
]

function minPrice(unit) {
  return Math.min(...unit.sizes.map((s) => s.price))
}

// Haversine distance in miles between two [lat, lon] points.
function distanceMi([lat1, lon1], [lat2, lon2]) {
  const R = 3958.8
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function StorageOrganizer() {
  const [query, setQuery] = useState('New Haven, Connecticut')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [focusedUnitId, setFocusedUnitId] = useState(null)
  const [sortBy, setSortBy] = useState('price-asc')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef(null)

  // Close the filter menu when clicking outside.
  useEffect(() => {
    if (!filterOpen) return
    function onDocClick(e) {
      if (!filterRef.current?.contains(e.target)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [filterOpen])

  const sortedUnits = useMemo(() => {
    const withDist = storageUnits.map((u) => ({
      ...u,
      _minPrice: minPrice(u),
      _distance: u.coords ? distanceMi(DORM_COORDS, u.coords) : Infinity,
    }))
    const sorted = [...withDist]
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a._minPrice - b._minPrice)
        break
      case 'price-desc':
        sorted.sort((a, b) => b._minPrice - a._minPrice)
        break
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'distance':
        sorted.sort((a, b) => a._distance - b._distance)
        break
      default:
        break
    }
    return sorted
  }, [sortBy])

  const activeSort = SORT_OPTIONS.find((o) => o.id === sortBy)

  function handleSubmit(e) {
    e.preventDefault()
    // Visual-only at this stage. Real search not wired up.
  }

  // Explicitly open the native calendar picker on label click —
  // some browsers won't auto-trigger it for an opacity-0 input.
  function openDatePicker(e) {
    const input = e.currentTarget.querySelector('input[type="date"]')
    if (input && typeof input.showPicker === 'function') {
      try {
        input.showPicker()
      } catch {
        input.focus()
      }
    } else if (input) {
      input.focus()
    }
  }

  return (
    <section id="panel-storage" role="tabpanel" aria-labelledby="tab-storage" className="storage">
      <form className="storage__search" onSubmit={handleSubmit}>
        <div className="storage__search-input-wrap">
          <svg className="storage__search-icon" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="13.7" y1="13.7" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="storage__search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search location"
          />
        </div>

        <div className="storage__dates">
          <label className="storage__date" onClick={openDatePicker}>
            <span className="storage__date-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="4" width="14" height="13" rx="2" />
                <line x1="3" y1="8" x2="17" y2="8" />
                <line x1="7" y1="2.5" x2="7" y2="5.5" />
                <line x1="13" y1="2.5" x2="13" y2="5.5" />
              </svg>
            </span>
            <span className="storage__date-content">
              <span className="storage__date-label">From</span>
              {fromDate ? (
                <span className="storage__date-value">{fromDate}</span>
              ) : (
                <span className="storage__date-placeholder">Add a date</span>
              )}
              <input
                type="date"
                value={fromDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setFromDate(e.target.value)}
                className="storage__date-native"
                aria-label="From date"
              />
            </span>
          </label>

          <span className="storage__date-divider" aria-hidden="true" />

          <label className="storage__date" onClick={openDatePicker}>
            <span className="storage__date-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="4" width="14" height="13" rx="2" />
                <line x1="3" y1="8" x2="17" y2="8" />
                <line x1="7" y1="2.5" x2="7" y2="5.5" />
                <line x1="13" y1="2.5" x2="13" y2="5.5" />
              </svg>
            </span>
            <span className="storage__date-content">
              <span className="storage__date-label">To</span>
              {toDate ? (
                <span className="storage__date-value">{toDate}</span>
              ) : (
                <span className="storage__date-placeholder">Add a date</span>
              )}
              <input
                type="date"
                value={toDate}
                min={fromDate || new Date().toISOString().slice(0, 10)}
                onChange={(e) => setToDate(e.target.value)}
                className="storage__date-native"
                aria-label="To date"
              />
            </span>
          </label>
        </div>

        <button type="submit" className="storage__update">Update</button>
      </form>

      <div className="storage__layout">
        <div className="storage__results">
          <header className="storage__results-head">
            <h2 className="storage__results-title">Storage Units in New Haven, CT</h2>
            <div className="storage__filter-wrap" ref={filterRef}>
              <button
                type="button"
                className={`storage__filter ${filterOpen ? 'is-open' : ''}`}
                aria-label="Sort results"
                aria-expanded={filterOpen}
                aria-haspopup="menu"
                onClick={() => setFilterOpen((v) => !v)}
              >
                <svg viewBox="0 0 18 14" aria-hidden="true">
                  <line x1="2" y1="3" x2="16" y2="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="2" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="2" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="6" cy="3" r="1.5" fill="var(--color-cream-panel)" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="7" r="1.5" fill="var(--color-cream-panel)" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="7" cy="11" r="1.5" fill="var(--color-cream-panel)" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
              {filterOpen && (
                <div className="storage__filter-menu" role="menu">
                  <p className="storage__filter-menu-title">Sort by</p>
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={sortBy === opt.id}
                      className={`storage__filter-option ${sortBy === opt.id ? 'is-active' : ''}`}
                      onClick={() => {
                        setSortBy(opt.id)
                        setFilterOpen(false)
                      }}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.id && (
                        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                          <polyline
                            points="3,8.5 7,12 13,4.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </header>
          <p className="storage__results-count">
            Showing 1 – {sortedUnits.length} of 80 movers · Sorted by{' '}
            <span className="storage__results-sort">{activeSort?.label.toLowerCase()}</span>
          </p>

          <div className="storage__cards-frame">
          <ul className="storage__cards">
            {sortedUnits.map((unit) => {
              const isFocused = focusedUnitId === unit.id
              return (
                <li
                  key={unit.id}
                  className={`storage-card ${isFocused ? 'is-focused' : ''}`}
                  onMouseEnter={() => setFocusedUnitId(unit.id)}
                  onMouseLeave={() => setFocusedUnitId(null)}
                  onFocus={() => setFocusedUnitId(unit.id)}
                  onBlur={() => setFocusedUnitId(null)}
                  tabIndex={0}
                >
                  <div
                    className="storage-card__image"
                    style={{ '--accent': unit.accent }}
                    aria-hidden="true"
                  >
                    {unit.image && (
                      <img
                        src={unit.image}
                        alt=""
                        className="storage-card__photo"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                  </div>
                  <div className="storage-card__body">
                    <h3 className="storage-card__name">{unit.name}</h3>
                    <p className="storage-card__address">{unit.address}</p>
                    <div className="storage-card__meta">
                      <div className="storage-card__rating">
                        <span className="storage-card__star" aria-hidden="true">★</span>
                        <span>{unit.rating.toFixed(1)}</span>
                      </div>
                      {Number.isFinite(unit._distance) && (
                        <>
                          <span className="storage-card__meta-sep" aria-hidden="true">•</span>
                          <div className="storage-card__distance">
                            {unit._distance.toFixed(1)} mi from dorm
                          </div>
                        </>
                      )}
                    </div>
                    <div className="storage-card__sizes">
                      {unit.sizes.map((size) => (
                        <div key={size.label} className="size-chip">
                          <div className="size-chip__price">${size.price}</div>
                          <div className="size-chip__label">{size.label}</div>
                          <div className="size-chip__dims">{size.dims}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          </div>
        </div>

        <StorageMap units={sortedUnits} focusedUnitId={focusedUnitId} onFocus={setFocusedUnitId} />
      </div>
    </section>
  )
}
