import { useEffect, useState } from 'react'
import './OpeningScreen.css'

const BASE = import.meta.env.BASE_URL

const frames = [
  { src: `${BASE}opening/01-skyline.jpg`, alt: 'Yale skyline at dusk' },
  { src: `${BASE}opening/02-title.jpg`, alt: 'The Move Book title appears' },
  { src: `${BASE}opening/03-route.jpg`, alt: 'Atlanta to New Haven route appears' },
  { src: `${BASE}opening/04-subtitle.jpg`, alt: 'Your out-of-state college move planner subtitle appears' },
  { src: `${BASE}opening/05-tickets.jpg`, alt: 'ATL and NHV vintage tickets appear' },
  { src: `${BASE}opening/06-newchapter.jpg`, alt: 'New Chapter seal appears' },
  { src: `${BASE}opening/07-bulldog.jpg`, alt: 'Yale bulldog shield appears' },
  { src: `${BASE}opening/08-airplane.jpg`, alt: 'Gold airplane appears' },
]

const STAGGER_MS = 380
const FADE_MS = 600
const START_REVEAL_MS = frames.length * STAGGER_MS + 200

export default function OpeningScreen({ onStart }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), START_REVEAL_MS)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="opening" role="presentation">
      <div className="opening__stage">
        {frames.map((frame, i) => (
          <img
            key={frame.src}
            src={frame.src}
            alt={i === 0 ? frame.alt : ''}
            aria-hidden={i > 0}
            className="opening__frame"
            style={{
              animationDelay: `${i * STAGGER_MS}ms`,
              animationDuration: `${FADE_MS}ms`,
            }}
            draggable={false}
          />
        ))}
      </div>

      <div className={`opening__cta ${revealed ? 'is-visible' : ''}`}>
        <button
          type="button"
          className="opening__start"
          onClick={onStart}
          aria-label="Start The Move Book"
          disabled={!revealed}
        >
          Start
        </button>
      </div>
    </div>
  )
}
