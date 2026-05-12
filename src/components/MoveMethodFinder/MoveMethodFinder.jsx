import { useMemo } from 'react'
import Wizard from './Wizard'
import PackingList from './PackingList'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { generateTasks } from '../../data/listGenerator'
import './MoveMethodFinder.css'

const STORAGE_KEY_ANSWERS = 'movebook:answers'
const STORAGE_KEY_TASKS = 'movebook:tasks'

export default function MoveMethodFinder() {
  const [answers, setAnswers] = useLocalStorage(STORAGE_KEY_ANSWERS, null)
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY_TASKS, [])

  const hasList = answers !== null && tasks.length > 0

  function handleQuizComplete(finalAnswers) {
    const fresh = generateTasks(finalAnswers)
    setAnswers(finalAnswers)
    setTasks(fresh)
  }

  function handleResetQuiz() {
    setAnswers(null)
    setTasks([])
  }

  return (
    <section id="panel-method" role="tabpanel" aria-labelledby="tab-method" className="method">
      {hasList ? (
        <PackingList
          tasks={tasks}
          onChange={setTasks}
          onResetQuiz={handleResetQuiz}
        />
      ) : (
        <Wizard onComplete={handleQuizComplete} />
      )}
    </section>
  )
}
