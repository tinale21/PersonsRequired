import { useState } from 'react'
import { storageUnits } from '../../data/storageUnits'
import StorageMap from './StorageMap'
import './StorageOrganizer.css'

export default function StorageOrganizer() {
  const [query, setQuery] = useState('New Haven, Connecticut')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [focusedUnitId, setFocusedUnitId] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    // Visual-only at this stage. Real search not wired up.
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
          <label className="storage__date">
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
                onChange={(e) => setFromDate(e.target.value)}
                className="storage__date-native"
                aria-label="From date"
              />
            </span>
          </label>

          <span className="storage__date-divider" aria-hidden="true" />

          <label className="storage__date">
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
            <button type="button" className="storage__filter" aria-label="Filter results">
              <svg viewBox="0 0 18 14" aria-hidden="true">
                <line x1="2" y1="3" x2="16" y2="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="2" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="2" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="6" cy="3" r="1.5" fill="var(--color-cream-panel)" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="7" r="1.5" fill="var(--color-cream-panel)" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="7" cy="11" r="1.5" fill="var(--color-cream-panel)" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </header>
          <p className="storage__results-count">Showing 1 – {storageUnits.length} of 80 movers</p>

          <ul className="storage__cards">
            {storageUnits.map((unit) => {
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
                    <svg viewBox="0 0 80 60" className="storage-card__icon">
                      <rect x="6" y="20" width="68" height="36" fill="rgba(255,255,255,0.15)" rx="2" />
                      <rect x="14" y="28" width="14" height="10" fill="rgba(255,255,255,0.6)" />
                      <rect x="32" y="28" width="14" height="10" fill="rgba(255,255,255,0.6)" />
                      <rect x="50" y="28" width="14" height="10" fill="rgba(255,255,255,0.6)" />
                      <rect x="14" y="42" width="14" height="10" fill="rgba(255,255,255,0.6)" />
                      <rect x="32" y="42" width="14" height="10" fill="rgba(255,255,255,0.6)" />
                      <rect x="50" y="42" width="14" height="10" fill="rgba(255,255,255,0.6)" />
                      <polygon points="6,20 40,8 74,20" fill="rgba(0,0,0,0.15)" />
                    </svg>
                  </div>
                  <div className="storage-card__body">
                    <h3 className="storage-card__name">{unit.name}</h3>
                    <p className="storage-card__address">{unit.address}</p>
                    <div className="storage-card__rating">
                      <span className="storage-card__star" aria-hidden="true">★</span>
                      <span>{unit.rating.toFixed(1)}</span>
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

        <StorageMap units={storageUnits} focusedUnitId={focusedUnitId} onFocus={setFocusedUnitId} />
      </div>
    </section>
  )
}
