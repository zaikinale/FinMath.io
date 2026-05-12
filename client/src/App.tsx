import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ErrorPage from './pages/ErrorPage'
import PeriodTransactionsPage from './pages/PeriodTransactionsPage'

function App() {
  
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/transactions" element={<PeriodTransactionsPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

// добавить управление категориями и транзакциями и темой переключение!

export default App
