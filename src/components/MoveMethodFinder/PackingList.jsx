import { useMemo, useState } from 'react'
import { makeCustomTask } from '../../data/listGenerator'
import './PackingList.css'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

export default function PackingList({ tasks, onChange, onResetQuiz }) {
  const [filter, setFilter] = useState('all')
  const [draft, setDraft] = useState('')

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.checked)
    if (filter === 'completed') return tasks.filter((t) => t.checked)
    return tasks
  }, [tasks, filter])

  const grouped = useMemo(() => {
    const map = new Map()
    visibleTasks.forEach((t) => {
      const key = t.categoryName
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(t)
    })
    return Array.from(map.entries()).map(([name, items]) => ({ name, items }))
  }, [visibleTasks])

  const tasksLeft = tasks.filter((t) => !t.checked).length

  function toggle(id) {
    onChange(tasks.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t)))
  }

  function remove(id) {
    onChange(tasks.filter((t) => t.id !== id))
  }

  function handleAdd(e) {
    e.preventDefault()
    const label = draft.trim()
    if (!label) return
    onChange([...tasks, makeCustomTask(label)])
    setDraft('')
  }

  return (
    <div className="plist">
      <form className="plist__add" onSubmit={handleAdd}>
        <input
          type="text"
          className="plist__input"
          placeholder="Type your item here..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Add a new item"
        />
        <button type="submit" className="plist__add-btn" disabled={!draft.trim()}>
          <span aria-hidden="true">+</span> Add
        </button>
      </form>

      <div className="plist__meta">
        <div className="plist__filters" role="tablist" aria-label="Filter packing list">
          {FILTERS.map((f, i) => (
            <span key={f.id} className="plist__filter-wrap">
              {i > 0 && <span className="plist__filter-sep" aria-hidden="true">|</span>}
              <button
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                className={`plist__filter ${filter === f.id ? 'is-active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            </span>
          ))}
        </div>

        <div className="plist__counter" aria-live="polite">
          {tasksLeft} {tasksLeft === 1 ? 'task' : 'tasks'} left
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="plist__empty">
          {filter === 'completed'
            ? 'Nothing checked off yet.'
            : filter === 'active'
            ? 'Everything is checked off. Nicely done.'
            : 'Your list is empty. Add an item above, or '}
          {filter === 'all' && (
            <button type="button" className="plist__link" onClick={onResetQuiz}>
              redo the quiz
            </button>
          )}
          {filter === 'all' && '.'}
        </div>
      ) : (
        <div className="plist__grid">
          {grouped.map((group) => (
            <section key={group.name} className="plist__group" aria-label={group.name}>
              <h3 className="plist__group-title">{group.name}</h3>
              <ul className="plist__items">
                {group.items.map((t) => (
                  <li key={t.id} className={`plist__row ${t.checked ? 'is-checked' : ''}`}>
                    <button
                      type="button"
                      className="plist__check"
                      role="checkbox"
                      aria-checked={t.checked}
                      aria-label={`${t.checked ? 'Uncheck' : 'Check off'} ${t.label}`}
                      onClick={() => toggle(t.id)}
                    >
                      <span className="plist__check-box">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <polyline
                            points="3,8.5 7,12 13,4.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="plist__label">{t.label}</span>
                    </button>
                    <button
                      type="button"
                      className="plist__delete"
                      aria-label={`Delete ${t.label}`}
                      onClick={() => remove(t.id)}
                    >
                      <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
                        <path d="M2 4h12M5 4V2.5A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V4M3 4l1 12.5A1.5 1.5 0 0 0 5.5 18h5A1.5 1.5 0 0 0 12 16.5L13 4M6.5 8v6M9.5 8v6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <div className="plist__redo">
        <button type="button" className="plist__link" onClick={onResetQuiz}>
          Redo the Move Method Finder
        </button>
      </div>
    </div>
  )
}
