import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaUser, FaEnvelope, FaPhone, FaKey, FaSave, FaCheck, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

// Валидация профиля
const profileSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Некорректный email'),
  phone: z.string().optional().refine(val => !val || /^\+?\d{10,15}$/.test(val), 'Неверный формат телефона'),
});

// Валидация API-ключа
const keySchema = z.object({
  apiKey: z.string().min(10, 'Ключ слишком короткий'),
});

type ProfileInput = z.infer<typeof profileSchema>;
type KeyInput = z.infer<typeof keySchema>;

export default function ProfilePage() {
  const navigate = useNavigate();
  
  // Тема
  const [isDark, setIsDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Цвета (единая палитра)
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
    error: '#dc2626'
  };

  // Состояния UI
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'profile' | 'key'>('idle');

  // Форма профиля
  const { register: regProfile, handleSubmit: subProfile, formState: { errors: errProfile, isSubmitting: subProfileLoading }, reset: resetProfile } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: 'Александр', email: 'alex@example.com', phone: '+79001234567' }
  });

  // Форма API-ключа
  const { register: regKey, handleSubmit: subKey, formState: { errors: errKey, isSubmitting: subKeyLoading } } = useForm<KeyInput>({
    resolver: zodResolver(keySchema),
    defaultValues: { apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx' }
  });

  // Хендлеры
  const onProfileSave = async (data: ProfileInput) => {
    console.log('Сохранение профиля:', data);
    setSaveStatus('profile');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const onKeySave = async (data: KeyInput) => {
    console.log('Сохранение ключа:', data.apiKey.replace(/./g, '•').slice(0, 8) + '...');
    setSaveStatus('key');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  // Общие стили
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.7rem 0.85rem', background: c.inputBg,
    border: `1px solid ${c.border}`, borderRadius: '10px', color: c.text,
    fontSize: '0.95rem', boxSizing: 'border-box', transition: 'border-color 0.2s',
    fontFamily: 'inherit'
  };

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem', background: c.accent, color: c.accentText,
    border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 500,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    transition: 'opacity 0.2s'
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem 1rem', transition: 'background 0.3s, color 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Назад */}
      <div style={{ width: '100%', maxWidth: '460px', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: c.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', padding: 0 }}>
          <FaArrowLeft style={{ width: '14px', height: '14px' }} /> Назад
        </button>
      </div>

      {/* Карточка */}
      <div style={{ width: '100%', maxWidth: '460px', background: c.card, border: `1px solid ${c.border}`, borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
        
        {/* Заголовок */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Настройки профиля</h1>
          <p style={{ color: c.muted, fontSize: '0.9rem', margin: '0.4rem 0 0' }}>Управление данными и интеграциями</p>
        </div>

        {/* Секция: Личные данные */}
        <form onSubmit={subProfile(onProfileSave)} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FaUser style={{ width: '12px', height: '12px' }} /> Личные данные
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.35rem', color: c.muted }}>Имя</label>
              <input type="text" {...regProfile('name')} style={inputStyle} placeholder="Ваше имя" />
              {errProfile.name && <p style={{ color: c.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>{errProfile.name.message}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.35rem', color: c.muted }}>Email</label>
              <input type="email" {...regProfile('email')} style={inputStyle} placeholder="you@example.com" />
              {errProfile.email && <p style={{ color: c.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>{errProfile.email.message}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.35rem', color: c.muted }}>Телефон</label>
              <input type="tel" {...regProfile('phone')} style={inputStyle} placeholder="+79001234567" />
              {errProfile.phone && <p style={{ color: c.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>{errProfile.phone.message}</p>}
            </div>

            <button type="submit" disabled={subProfileLoading} style={{ ...btnStyle, opacity: subProfileLoading ? 0.6 : 1, marginTop: '0.5rem' }}>
              {subProfileLoading ? 'Сохранение...' : <><FaSave style={{ width: '13px', height: '13px' }} /> Сохранить изменения</>}
            </button>
          </div>
        </form>

        {/* Разделитель */}
        <div style={{ height: '1px', background: c.border, margin: '1.5rem 0' }} />

        {/* Секция: AI Интеграция */}
        <form onSubmit={subKey(onKeySave)}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FaKey style={{ width: '12px', height: '12px' }} /> API-ключ нейросети
          </h3>

          <div style={{ position: 'relative', marginBottom: '0.9rem' }}>
            <input 
              type={showKey ? 'text' : 'password'} 
              {...regKey('apiKey')} 
              style={{ ...inputStyle, paddingRight: '2.8rem' }} 
              placeholder="sk-..." 
            />
            <button 
              type="button" 
              onClick={() => setShowKey(!showKey)}
              style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: c.muted, cursor: 'pointer', padding: '0.2rem' }}
            >
              {showKey ? <FaEyeSlash style={{ width: '14px', height: '14px' }} /> : <FaEye style={{ width: '14px', height: '14px' }} />}
            </button>
            {errKey.apiKey && <p style={{ color: c.error, fontSize: '0.75rem', marginTop: '0.25rem' }}>{errKey.apiKey.message}</p>}
          </div>

          <p style={{ fontSize: '0.78rem', color: c.muted, marginBottom: '0.9rem', lineHeight: 1.5 }}>
            Ключ хранится локально в зашифрованном виде. Используется для генерации финансовой аналитики.
          </p>

          <button type="submit" disabled={subKeyLoading} style={{ ...btnStyle, opacity: subKeyLoading ? 0.6 : 1 }}>
            {subKeyLoading ? 'Проверка...' : <><FaSave style={{ width: '13px', height: '13px' }} /> Подключить агент</>}
          </button>
        </form>

        {/* Статус сохранения */}
        {saveStatus !== 'idle' && (
          <div style={{ marginTop: '1.2rem', padding: '0.6rem', background: `${c.success}15`, border: `1px solid ${c.success}40`, borderRadius: '8px', color: c.success, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', animation: 'fadeIn 0.2s ease' }}>
            <FaCheck style={{ width: '12px', height: '12px' }} />
            {saveStatus === 'profile' ? 'Данные обновлены' : 'Ключ успешно подключён'}
          </div>
        )}
      </div>

      {/* Футер */}
      <p style={{ marginTop: '2rem', color: c.muted, fontSize: '0.75rem', textAlign: 'center' }}>
        © {new Date().getFullYear()} FinTrack. Локальное хранение данных.
      </p>
    </div>
  );
}