import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import Register from './features/auth/pages/Register.jsx'
import Login from './features/auth/pages/Login.jsx'
import Home from './features/interview/pages/Home.jsx'
import Protected from './features/auth/components/Protected.jsx'
import Interview from './features/interview/pages/Interview.jsx'
import InterviewReport from './features/interview/pages/InterviewReport.jsx'

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<Protected />}>
        <Route path="/" element={<Home />} />
        <Route path="/interview/new" element={<Interview />} />
        <Route path="/interview/:interviewId" element={<InterviewReport />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
