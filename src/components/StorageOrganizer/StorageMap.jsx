import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './StorageMap.css'

// Center on Yale / downtown New Haven.
const NEW_HAVEN_CENTER = [41.305, -72.93]
const INITIAL_ZOOM = 12

export default function StorageMap({ units, focusedUnitId, onFocus }) {
  const mapElRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(new Map())

  // Initialize the Leaflet map once.
  useEffect(() => {
    if (!mapElRef.current || mapRef.current) return

    const map = L.map(mapElRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    }).setView(NEW_HAVEN_CENTER, INITIAL_ZOOM)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Sync markers with units + focusedUnitId.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Drop existing markers and rebuild — simplest correct sync.
    markersRef.current.forEach((m) => m.remove())
    markersRef.current.clear()

    units.forEach((unit) => {
      if (!unit.coords) return
      const minPrice = Math.min(...unit.sizes.map((s) => s.price))
      const isFocused = unit.id === focusedUnitId

      const cls = ['storage-pin']
      if (isFocused) cls.push('is-focused')
      if (unit._unavailable) cls.push('is-unavailable')
      const html = `
        <button type="button" class="${cls.join(' ')}" aria-label="${unit.name} from $${minPrice}${unit._unavailable ? ' (not available)' : ''}">
          $${minPrice}+
        </button>
      `

      const icon = L.divIcon({
        className: 'storage-pin-wrap',
        html,
        iconSize: [54, 28],
        iconAnchor: [27, 28],
      })

      const marker = L.marker(unit.coords, { icon, riseOnHover: true })
        .addTo(map)
        .on('click', () => onFocus(isFocused ? null : unit.id))
        .on('mouseover', () => onFocus(unit.id))

      markersRef.current.set(unit.id, marker)
    })
  }, [units, focusedUnitId, onFocus])

  return (
    <div className="storage-map" role="region" aria-label="Map of storage facilities near New Haven, Connecticut">
      <div ref={mapElRef} className="storage-map__leaflet" />
    </div>
  )
}
