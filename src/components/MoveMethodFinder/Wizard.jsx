import { useState } from 'react'
import { questions } from '../../data/questions'
import './Wizard.css'

export default function Wizard({ onComplete }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  const total = questions.length
  const q = questions[index]
  const isLast = index === total - 1
  const progress = total > 1 ? (index / (total - 1)) * 100 : 0

  const current = answers[q.id]
  const hasAnswer = q.optional
    ? true
    : q.type === 'single'
    ? Boolean(current)
    : q.type === 'multi'
    ? Array.isArray(current) && current.length > 0
    : Boolean(current && String(current).trim())

  function setSingle(value) {
    setAnswers((prev) => {
      // Clicking the already-selected option deselects it.
      if (prev[q.id] === value) {
        const next = { ...prev }
        delete next[q.id]
        return next
      }
      return { ...prev, [q.id]: value }
    })
  }

  function toggleMulti(value) {
    setAnswers((prev) => {
      const list = Array.isArray(prev[q.id]) ? prev[q.id] : []
      const next = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
      return { ...prev, [q.id]: next }
    })
  }

  function setText(value) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }))
  }

  function handleNext() {
    if (!hasAnswer) return
    if (isLast) {
      onComplete(answers)
    } else {
      setIndex((i) => i + 1)
    }
  }

  function handleSkip() {
    if (isLast) {
      onComplete({ ...answers, [q.id]: '' })
    } else {
      setIndex((i) => i + 1)
    }
  }

  function handleBack() {
    if (index === 0) {
      // On Q1, clear the selection so no answer is highlighted.
      setAnswers((prev) => {
        const next = { ...prev }
        delete next[q.id]
        return next
      })
    } else {
      setIndex((i) => i - 1)
    }
  }

  return (
    <div className="wizard" aria-live="polite">
      <div className="wizard__progress-row">
        <button
          type="button"
          className="wizard__back-arrow"
          onClick={handleBack}
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="wizard__progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="wizard__progress-track">
            <div
              className="wizard__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="wizard__progress-label" aria-hidden="true">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <div className="wizard__question" key={q.id}>
        <p className="wizard__counter">QUESTION {index + 1}</p>
        <h2 className="wizard__title">{q.text}</h2>

        <div className="wizard__choices-area">
          {q.type === 'text' ? (
            <div className="wizard__text-wrap">
              <textarea
                className="wizard__textarea"
                placeholder={q.placeholder || ''}
                value={current || ''}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                aria-label={q.text}
              />
            </div>
          ) : (
            <div className={`wizard__options wizard__options--${q.type}`}>
              {q.options.map((opt) => {
                const isSelected = q.type === 'single'
                  ? current === opt.value
                  : Array.isArray(current) && current.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`option ${isSelected ? 'option--selected' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() =>
                      q.type === 'single' ? setSingle(opt.value) : toggleMulti(opt.value)
                    }
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {hasAnswer && (
          <div className="wizard__actions">
            {q.optional && !(current && String(current).trim()) && (
              <button
                type="button"
                className="wizard__skip"
                onClick={handleSkip}
              >
                Skip
              </button>
            )}
            <button
              type="button"
              className="wizard__next"
              onClick={handleNext}
            >
              {isLast ? 'See My List' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
