import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../api/auth.service.js';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // Можно вызвать роут получения данных юзера или сессий
      const data = await AuthService.getSessions(); 
      // Если запрос прошел успешно, значит кука валидна
      // Здесь логика зависит от того, что возвращает твой бекенд
      // Допустим, мы просто проверяем наличие сессии
      if (data) {
        // Здесь можно сделать запрос /api/auth/me если добавишь такой роут
        // Пока просто затычка, если сессии есть
        setIsLoading(false);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuth: !!user, isLoading, checkAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};