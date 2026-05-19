import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a] text-[#111111] dark:text-white text-sm font-bold tracking-wide box-border">
        Загрузка...
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Отрисовывает дочерние роуты
};