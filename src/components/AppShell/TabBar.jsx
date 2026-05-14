import './TabBar.css'

const TABS = [
  { id: 'method', label: 'Move Method Finder', shortLabel: 'Method Finder' },
  { id: 'storage', label: 'Storage / Shipping Organizer', shortLabel: 'Storage' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="tabbar" role="tablist" aria-label="Move Book sections">
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            className={`tab tab--${tab.id} ${isActive ? 'tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab__label tab__label--long">{tab.label}</span>
            <span className="tab__label tab__label--short" aria-hidden="true">{tab.shortLabel}</span>
          </button>
        )
      })}
    </div>
  )
}
