import TabBar from './TabBar'
import './AppShell.css'

export default function AppShell({ activeTab, onTabChange, children }) {
  return (
    <div className="shell">
      <header className="shell__header" aria-label="Move Book navigation">
        <TabBar activeTab={activeTab} onTabChange={onTabChange} />
      </header>
      <main className="shell__body" role="main">
        {children}
      </main>
    </div>
  )
}
