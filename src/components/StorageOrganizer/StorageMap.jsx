import './StorageMap.css'

export default function StorageMap({ units, focusedUnitId, onFocus }) {
  return (
    <div className="storage-map" role="img" aria-label="Map of storage facilities near New Haven, Connecticut">
      <div className="storage-map__canvas">
        {/* Abstract map layers */}
        <div className="storage-map__land" aria-hidden="true" />
        <div className="storage-map__water" aria-hidden="true" />
        <div className="storage-map__roads" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="22" x2="100" y2="34" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="0" y1="48" x2="100" y2="44" stroke="rgba(255,255,255,0.7)" strokeWidth="0.9" strokeLinecap="round" />
            <line x1="0" y1="72" x2="100" y2="62" stroke="rgba(255,255,255,0.7)" strokeWidth="0.9" strokeLinecap="round" />
            <line x1="22" y1="0" x2="14" y2="100" stroke="rgba(255,255,255,0.7)" strokeWidth="0.9" strokeLinecap="round" />
            <line x1="58" y1="0" x2="48" y2="100" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="84" y1="0" x2="80" y2="100" stroke="rgba(255,255,255,0.7)" strokeWidth="0.9" strokeLinecap="round" />
            <path d="M 30 25 Q 50 35, 75 28" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 20 60 Q 40 55, 65 70" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
        </div>
        <div className="storage-map__park storage-map__park--1" aria-hidden="true" />
        <div className="storage-map__park storage-map__park--2" aria-hidden="true" />
        <div className="storage-map__city-label" aria-hidden="true">New Haven</div>
        <div className="storage-map__bay-label" aria-hidden="true">Long Island Sound</div>

        {/* Pins */}
        {units.map((unit) => {
          const isFocused = focusedUnitId === unit.id
          const minPrice = Math.min(...unit.sizes.map((s) => s.price))
          return (
            <button
              key={unit.id}
              type="button"
              className={`storage-pin ${isFocused ? 'is-focused' : ''}`}
              style={{ left: unit.pin.left, top: unit.pin.top }}
              onClick={() => onFocus(isFocused ? null : unit.id)}
              onMouseEnter={() => onFocus(unit.id)}
              aria-label={`${unit.name} from $${minPrice}`}
            >
              ${minPrice}+
            </button>
          )
        })}

        {/* Hover/active tooltip */}
        {focusedUnitId && (() => {
          const unit = units.find((u) => u.id === focusedUnitId)
          if (!unit) return null
          const minPrice = Math.min(...unit.sizes.map((s) => s.price))
          return (
            <div
              className="storage-tooltip"
              style={{ left: unit.pin.left, top: unit.pin.top }}
              role="dialog"
              aria-label={`${unit.name} details`}
            >
              <div className="storage-tooltip__image" style={{ '--accent': unit.accent }} aria-hidden="true">
                <svg viewBox="0 0 80 60">
                  <rect x="6" y="20" width="68" height="36" fill="rgba(255,255,255,0.18)" rx="2" />
                  <rect x="14" y="28" width="14" height="10" fill="rgba(255,255,255,0.6)" />
                  <rect x="32" y="28" width="14" height="10" fill="rgba(255,255,255,0.6)" />
                  <rect x="50" y="28" width="14" height="10" fill="rgba(255,255,255,0.6)" />
                  <polygon points="6,20 40,8 74,20" fill="rgba(0,0,0,0.18)" />
                </svg>
              </div>
              <div className="storage-tooltip__body">
                <div className="storage-tooltip__top">
                  <span className="storage-tooltip__rating">
                    <span className="storage-tooltip__star" aria-hidden="true">★</span>
                    {unit.rating.toFixed(1)}
                  </span>
                  <span className="storage-tooltip__price">From ${minPrice}</span>
                </div>
                <p className="storage-tooltip__name">{unit.name}</p>
                <p className="storage-tooltip__address">{unit.address}</p>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
