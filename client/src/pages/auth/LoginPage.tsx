import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import { useState } from 'react';
import { AuthService } from '../../api/auth.service'; 
import { useAuth } from '../../context/AuthContext';   
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); 
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const response = await AuthService.login(data.email, data.password);
      setUser(response.user); 
      navigate('/dashboard');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || 'Неверный email или пароль');
      } else {
        setServerError('Ошибка подключения к серверу');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 bg-[#fafafa] dark:bg-[#0a0a0a] text-[#111111] dark:text-[#f5f5f5] font-sans transition-colors duration-300 relative box-border">
      
      {/* Кнопка назад */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-[#666666] dark:text-[#999999] hover:opacity-80 text-sm font-medium no-underline transition-opacity"
      >
        <FaArrowLeft className="w-3.5 h-3.5" /> На главную
      </Link>

      {/* Форма логина */}
      <div className="w-full max-w-[400px] bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-8 box-border shadow-md">
        
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold tracking-tight m-0 mb-1.5">С возвращением</h1>
          <p className="text-[#666666] dark:text-[#999999] text-sm m-0">Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Ошибка сервера */}
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-500 p-3 rounded-xl text-sm mb-4 text-center font-medium">
              {serverError}
            </div>
          )}

          {/* Поле: Email */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5 text-[#666666] dark:text-[#999999]">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666] dark:text-[#999999] w-3.5 h-3.5 pointer-events-none" />
              <input 
                type="email" 
                {...register('email')} 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-[#111111] dark:text-[#f5f5f5] text-sm box-border outline-none transition-all focus:border-neutral-400 dark:focus:border-neutral-600"
                placeholder="you@example.com" 
              />
            </div>
            {errors.email && <p className="text-red-600 dark:text-red-500 text-xs mt-1.5 m-0 font-medium">{errors.email.message}</p>}
          </div>

          {/* Поле: Пароль */}
          <div className="mb-3">
            <label className="block text-xs font-semibold mb-1.5 text-[#666666] dark:text-[#999999]">Пароль</label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666] dark:text-[#999999] w-3.5 h-3.5 pointer-events-none" />
              <input 
                type="password" 
                {...register('password')} 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-[#111111] dark:text-[#f5f5f5] text-sm box-border outline-none transition-all focus:border-neutral-400 dark:focus:border-neutral-600"
                placeholder="••••••••" 
              />
            </div>
            {errors.password && <p className="text-red-600 dark:text-red-500 text-xs mt-1.5 m-0 font-medium">{errors.password.message}</p>}
          </div>

          {/* Восстановление пароля */}
          <div className="flex justify-end mb-5">
            <button 
              type="button" 
              className="bg-transparent border-none text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#f5f5f5] text-xs font-medium cursor-pointer p-0 transition-colors"
            >
              Забыли пароль?
            </button>
          </div>

          {/* Кнопка Войти */}
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black border-none rounded-xl text-sm font-bold transition-all box-border cursor-pointer disabled:not-allowed disabled:opacity-60 hover:opacity-90"
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>

          {/* Разделитель */}
          <div className="relative my-5 text-center">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#e5e5e5] dark:bg-[#2a2a2a]" />
            <span className="relative bg-white dark:bg-[#141414] px-2.5 text-xs text-[#666666] dark:text-[#999999]">или</span>
          </div>

          {/* Ссылка на регистрацию */}
          <p className="text-center text-[#666666] dark:text-[#999999] text-sm m-0">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-[#111111] dark:text-[#f5f5f5] no-underline font-semibold hover:underline">Зарегистрироваться</Link>
          </p>
        </form>
      </div>
    </div>
  );
}