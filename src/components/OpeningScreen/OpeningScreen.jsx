import { useEffect, useState } from 'react'
import './OpeningScreen.css'

const BASE = import.meta.env.BASE_URL

// Reveal sequence — each step fires its own animation
const STEPS = [
  'skyline',
  'title',
  'route',
  'subtitle',
  'tickets',
  'seal',
  'bulldog',
  'airplane',
  'start',
]
const STEP_MS = 420

export default function OpeningScreen({ onStart }) {
  const [step, setStep] = useState(-1)

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStep(i), 80 + i * STEP_MS)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const has = (name) => step >= STEPS.indexOf(name)
  const ready = has('start')

  return (
    <div className="opening" role="presentation">
      {/* Base layer: skyline + atmosphere overlay */}
      <div className={`opening__sky ${has('skyline') ? 'is-in' : ''}`}>
        <img
          src={`${BASE}opening/skyline.jpg`}
          alt="Yale University skyline at dusk"
          className="opening__sky-img"
          draggable={false}
        />
        <div className="opening__sky-veil" aria-hidden="true" />
      </div>

      {/* Constrained layout — keeps elements clustered around the title on wide screens */}
      <div className="opening__layout">
        <img
          src={`${BASE}opening/airplane.png`}
          alt=""
          aria-hidden="true"
          className={`opening__airplane ${has('airplane') ? 'is-in' : ''}`}
          draggable={false}
        />
        <img
          src={`${BASE}opening/seal.png`}
          alt=""
          aria-hidden="true"
          className={`opening__seal ${has('seal') ? 'is-in' : ''}`}
          draggable={false}
        />
        <img
          src={`${BASE}opening/bulldog.png`}
          alt=""
          aria-hidden="true"
          className={`opening__bulldog ${has('bulldog') ? 'is-in' : ''}`}
          draggable={false}
        />
        <img
          src={`${BASE}opening/tickets.png`}
          alt=""
          aria-hidden="true"
          className={`opening__tickets ${has('tickets') ? 'is-in' : ''}`}
          draggable={false}
        />

        <div className="opening__center">
          <h1 className={`opening__title ${has('title') ? 'is-in' : ''}`}>
            <span className="opening__title-main">
              <span className="opening__title-the">The</span>
              <span className="opening__title-line">MOVE</span>
              <span className="opening__title-line">BOOK</span>
            </span>
          </h1>

          <p className={`opening__route ${has('route') ? 'is-in' : ''}`}>
            Atlanta <span className="opening__arrow" aria-hidden="true">→</span> New Haven
          </p>

          <p className={`opening__subtitle ${has('subtitle') ? 'is-in' : ''}`}>
            Your Out-Of-State
            <br />
            College Move Planner
          </p>

          <div className={`opening__cta ${ready ? 'is-in' : ''}`}>
            <button
              type="button"
              className="opening__start"
              onClick={onStart}
              aria-label="Start The Move Book"
              disabled={!ready}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
