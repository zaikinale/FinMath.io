import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaUser, FaEnvelope, FaKey, FaSave, FaCheck, FaArrowLeft, FaEye, FaEyeSlash, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Путь к твоему контексту
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
  const { user, setUser } = useAuth(); // Достаем данные юзера и функцию очистки
  
  const [isDark, setIsDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'profile' | 'key'>('idle');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const c = {
    bg: isDark ? '#0a0a0a' : '#fafafa',
    card: isDark ? '#141414' : '#ffffff',
    text: isDark ? '#f5f5f5' : '#111111',
    muted: isDark ? '#999999' : '#666666',
    border: isDark ? '#2a2a2a' : '#e5e5e5',
    accent: isDark ? '#ffffff' : '#000000',
    accentText: isDark ? '#0a0a0a' : '#ffffff',
    inputBg: isDark ? '#1a1a1a' : '#ffffff',
    success: '#16a34a',
    error: '#dc2626',
    danger: '#ef4444'
  };

  const { register: regProfile, handleSubmit: subProfile, formState: { errors: errProfile, isSubmitting: subProfileLoading } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { 
      name: user?.name || 'Алексей', // Используем данные из контекста
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
      await AuthService.logout(); // Запрос на бек для очистки кук
      setUser(null); // Очищаем стейт
      navigate('/login');
    } catch (e) {
      console.error('Logout failed', e);
      setUser(null); // Всё равно выходим в случае ошибки
      navigate('/login');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 0.85rem', background: c.inputBg,
    border: `1px solid ${c.border}`, borderRadius: '10px', color: c.text,
    fontSize: '0.95rem', boxSizing: 'border-box', transition: 'all 0.2s',
    outline: 'none'
  };

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '0.8rem', background: c.accent, color: c.accentText,
    border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
    transition: 'opacity 0.2s'
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem 1rem', transition: 'background 0.3s, color 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '460px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: c.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', padding: 0 }}>
          <FaArrowLeft style={{ width: '14px', height: '14px' }} /> Назад
        </button>
        
        {/* Кнопка выхода */}
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: c.danger, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 500, padding: '0.4rem 0.8rem', borderRadius: '8px', transition: 'background 0.2s' }}>
          <FaSignOutAlt /> Выйти
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '460px', background: c.card, border: `1px solid ${c.border}`, borderRadius: '20px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Настройки</h1>
          <p style={{ color: c.muted, fontSize: '0.95rem', margin: '0.5rem 0 0' }}>Персонализация вашего аккаунта</p>
        </div>

        {/* Профиль */}
        <form onSubmit={subProfile(onProfileSave)} style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Личные данные
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.45rem', color: c.muted }}>Имя</label>
              <input type="text" {...regProfile('name')} style={inputStyle} placeholder="Ваше имя" />
              {errProfile.name && <p style={{ color: c.error, fontSize: '0.75rem', marginTop: '0.3rem' }}>{errProfile.name.message}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.45rem', color: c.muted }}>Email</label>
              <input type="email" {...regProfile('email')} style={inputStyle} placeholder="you@example.com" />
              {errProfile.email && <p style={{ color: c.error, fontSize: '0.75rem', marginTop: '0.3rem' }}>{errProfile.email.message}</p>}
            </div>

            <button type="submit" disabled={subProfileLoading} style={{ ...btnStyle, opacity: subProfileLoading ? 0.6 : 1 }}>
              {subProfileLoading ? 'Сохранение...' : <><FaSave style={{ width: '13px', height: '13px' }} /> Обновить профиль</>}
            </button>
          </div>
        </form>

        <div style={{ height: '1px', background: c.border, margin: '2rem 0' }} />

        {/* API Ключ */}
        <form onSubmit={subKey(onKeySave)}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            AI Интеграция
          </h3>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input 
              type={showKey ? 'text' : 'password'} 
              {...regKey('apiKey')} 
              style={{ ...inputStyle, paddingRight: '3rem' }} 
              placeholder="sk-..." 
            />
            <button 
              type="button" 
              onClick={() => setShowKey(!showKey)}
              style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: c.muted, cursor: 'pointer' }}
            >
              {showKey ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errKey.apiKey && <p style={{ color: c.error, fontSize: '0.75rem', marginTop: '0.3rem' }}>{errKey.apiKey.message}</p>}
          </div>

          <button type="submit" disabled={subKeyLoading} style={{ ...btnStyle, opacity: subKeyLoading ? 0.6 : 1 }}>
            {subKeyLoading ? 'Проверка...' : 'Сохранить API-ключ'}
          </button>
        </form>

        {saveStatus !== 'idle' && (
          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: `${c.success}10`, border: `1px solid ${c.success}30`, borderRadius: '12px', color: c.success, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <FaCheck /> {saveStatus === 'profile' ? 'Профиль обновлен' : 'Ключ сохранен'}
          </div>
        )}
      </div>

      <p style={{ marginTop: '2.5rem', color: c.muted, fontSize: '0.8rem', textAlign: 'center', opacity: 0.7 }}>
        Все изменения вступают в силу мгновенно.
      </p>
    </div>
  );
}