import { useState } from 'react'
import OpeningScreen from './components/OpeningScreen/OpeningScreen'
import AppShell from './components/AppShell/AppShell'
import MoveMethodFinder from './components/MoveMethodFinder/MoveMethodFinder'
import StorageOrganizer from './components/StorageOrganizer/StorageOrganizer'
import './App.css'

export default function App() {
  const [stage, setStage] = useState('opening') // 'opening' | 'app'
  const [activeTab, setActiveTab] = useState('method')

  if (stage === 'opening') {
    return <OpeningScreen onStart={() => setStage('app')} />
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'method' ? <MoveMethodFinder /> : <StorageOrganizer />}
    </AppShell>
  )
}
