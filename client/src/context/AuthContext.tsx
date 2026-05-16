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
      setIsLoading(true);
      // Запрашиваем сессии (браузер сам прикрепит httpOnly куку)
      const data = await AuthService.getSessions(); 
      
      // Смотрим, что вернул бэк. Если это массив сессий и он не пустой:
      if (data && (Array.isArray(data) ? data.length > 0 : true)) {
        // Если бэк в ответе сессии присылает и данные юзера (например data[0].user или прямо внутри сессии),
        // пишем их сюда. Если там только сессия, пока вытаскиваем id/email из доступного или ставим заглушку:
        const userData = Array.isArray(data) ? (data[0].user || data[0]) : data;
        
        setUser({
          id: userData.userId || userData.id,
          email: userData.email || "user@finmath.ru" // адаптируй под реальный ответ бэка
        });
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Ошибка проверки авторизации через куки:", e);
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