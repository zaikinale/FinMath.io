import { Routes, Route, Navigate } from 'react-router-dom'
import './index.css';
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ErrorPage from './pages/ErrorPage'
import PeriodTransactionsPage from './pages/PeriodTransactionsPage'

// Импортируем созданные компоненты
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Публичные роуты: доступны всем */}
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Защищенные роуты: только для авторизованных */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/transactions" element={<PeriodTransactionsPage />} />
          
          {/* Сюда позже добавим управление категориями */}
          {/* <Route path="/categories" element={<CategoriesPage />} /> */}
        </Route>

        {/* Ошибки и прочее */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App