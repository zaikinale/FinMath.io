import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaSave, FaCheck, FaArrowLeft, FaEye, FaEyeSlash, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../api/auth.service';

const profileSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Некорректный email'),
});

const keySchema = z.object({
  apiKey: z.string().min(10, 'Ключ слишком короткий'),
});

type ProfileInput = z.infer<typeof profileSchema>;
type KeyInput = z.infer<typeof keySchema>;

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'profile' | 'key'>('idle');

  const { register: regProfile, handleSubmit: subProfile, formState: { errors: errProfile, isSubmitting: subProfileLoading } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { 
      name: user?.name || 'Алексей',
      email: user?.email || '' 
    }
  });

  const { register: regKey, handleSubmit: subKey, formState: { errors: errKey, isSubmitting: subKeyLoading } } = useForm<KeyInput>({
    resolver: zodResolver(keySchema),
    defaultValues: { apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx' }
  });

  const onProfileSave = async (data: ProfileInput) => {
    setSaveStatus('profile');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const onKeySave = async (data: KeyInput) => {
    setSaveStatus('key');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      navigate('/login');
    } catch (e) {
      console.error('Logout failed', e);
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 font-sans px-4 py-8 flex flex-col items-center justify-start transition-colors duration-300">
      
      {/* Верхний бар */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <button 
          type="button"
          onClick={() => navigate(-1)} 
          className="bg-transparent border-none text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer flex items-center gap-2 text-sm py-1 transition-colors"
        >
          <FaArrowLeft className="w-3.5 h-3.5" /> Назад
        </button>
        
        <button 
          type="button"
          onClick={handleLogout} 
          className="bg-transparent border-none text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-xl transition-all"
        >
          <FaSignOutAlt /> Выйти
        </button>
      </div>

      {/* Карточка настроек */}
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight m-0">Настройки</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2">Персонализация вашего аккаунта</p>
        </div>

        {/* Форма: Личные данные */}
        <form onSubmit={subProfile(onProfileSave)} className="mb-6">
          <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2 m-0">
            Личные данные
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-semibold mb-1.5 text-neutral-500 dark:text-neutral-400">Имя</label>
              <input 
                type="text" 
                {...regProfile('name')} 
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-950 dark:text-neutral-50 text-sm outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all block box-border" 
                placeholder="Ваше имя" 
              />
              {errProfile.name && <p className="text-red-500 text-xs mt-1.5 m-0">{errProfile.name.message}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold mb-1.5 text-neutral-500 dark:text-neutral-400">Email</label>
              <input 
                type="email" 
                {...regProfile('email')} 
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-950 dark:text-neutral-50 text-sm outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all block box-border" 
                placeholder="you@example.com" 
              />
              {errProfile.email && <p className="text-red-500 text-xs mt-1.5 m-0">{errProfile.email.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={subProfileLoading} 
              className="w-full py-3 mt-2 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 border-none rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {subProfileLoading ? 'Сохранение...' : <><FaSave className="w-3.5 h-3.5" /> Обновить профиль</>}
            </button>
          </div>
        </form>

        <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-6" />

        {/* Форма: AI Ключ */}
        <form onSubmit={subKey(onKeySave)}>
          <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2 m-0">
            AI Интеграция
          </h3>

          <div className="relative mb-4">
            <label className="block text-xs font-semibold mb-1.5 text-neutral-500 dark:text-neutral-400">API-ключ</label>
            <div className="relative">
              <input 
                type={showKey ? 'text' : 'password'} 
                {...regKey('apiKey')} 
                className="w-full pl-4 pr-12 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-950 dark:text-neutral-50 text-sm outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all block box-border" 
                placeholder="sk-..." 
              />
              <button 
                type="button" 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer p-1 transition-colors flex items-center"
              >
                {showKey ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            {errKey.apiKey && <p className="text-red-500 text-xs mt-1.5 m-0">{errKey.apiKey.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={subKeyLoading} 
            className="w-full py-3 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 border-none rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {subKeyLoading ? 'Проверка...' : 'Сохранить API-ключ'}
          </button>
        </form>

        {/* Статус сохранения */}
        {saveStatus !== 'idle' && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-xs font-semibold flex items-center justify-center gap-2 animate-fade-in">
            <FaCheck /> {saveStatus === 'profile' ? 'Профиль успешно обновлен' : 'API-ключ успешно сохранен'}
          </div>
        )}
      </div>

      <p className="mt-8 text-neutral-400 dark:text-neutral-500 text-xs text-center opacity-80">
        Все изменения вступают в силу мгновенно.
      </p>
    </div>
  );
}