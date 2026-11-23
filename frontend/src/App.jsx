import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import Register from './features/auth/pages/Register.jsx'
import Login from './features/auth/pages/Login.jsx'
import Home from './features/interview/pages/Home.jsx'
import Protected from './features/auth/components/Protected.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Protected><Home /></Protected>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
