import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { LevelPage } from './pages/LevelPage'
import { LevelExam } from './pages/LevelExam'
import { LevelComplete } from './pages/LevelComplete'
import { ExamReport } from './pages/ExamReport'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/level/:id" element={<LevelPage />} />
        <Route path="/level/:id/exam" element={<LevelExam />} />
        <Route path="/level/:id/complete" element={<LevelComplete />} />
        <Route path="/level/:id/exam/report" element={<ExamReport />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
