import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    console.log('Login:', data);
    navigate('/dashboard');
  };

  const c = {
    bg: isDark ? '#0a0a0a' : '#fafafa',
    card: isDark ? '#141414' : '#ffffff',
    text: isDark ? '#f5f5f5' : '#111111',
    muted: isDark ? '#999999' : '#666666',
    border: isDark ? '#2a2a2a' : '#e5e5e5',
    accent: isDark ? '#ffffff' : '#000000',
    accentText: isDark ? '#0a0a0a' : '#ffffff',
    inputBg: isDark ? '#1a1a1a' : '#ffffff',
    error: '#dc2626'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.3rem', background: c.inputBg,
    border: `1px solid ${c.border}`, borderRadius: '10px', color: c.text,
    fontSize: '0.95rem', boxSizing: 'border-box', transition: 'border-color 0.2s'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: c.bg, color: c.text, fontFamily: 'system-ui, -apple-system, sans-serif', transition: 'background 0.3s, color 0.3s' }}>
      <Link to="/" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: c.muted, textDecoration: 'none', fontSize: '0.875rem' }}>
        <FaArrowLeft style={{ width: '14px', height: '14px' }} /> На главную
      </Link>

      <div style={{ width: '100%', maxWidth: '400px', background: c.card, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>С возвращением</h1>
          <p style={{ color: c.muted, fontSize: '0.9rem' }}>Войдите в свой аккаунт</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: c.muted }}>Email</label>
            <div style={{ position: 'relative' }}>
              <FaEnvelope style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: c.muted, width: '15px', height: '15px', pointerEvents: 'none' }} />
              <input type="email" {...register('email')} style={inputStyle} placeholder="you@example.com" />
            </div>
            {errors.email && <p style={{ color: c.error, fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: c.muted }}>Пароль</label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: c.muted, width: '15px', height: '15px', pointerEvents: 'none' }} />
              <input type="password" {...register('password')} style={inputStyle} placeholder="••••••••" />
            </div>
            {errors.password && <p style={{ color: c.error, fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.password.message}</p>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0.5rem 0 1.2rem' }}>
            <button type="button" style={{ background: 'none', border: 'none', color: c.muted, fontSize: '0.82rem', cursor: 'pointer', padding: 0 }}>Забыли пароль?</button>
          </div>

          <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '0.8rem', background: c.accent, color: c.accentText, border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 500, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.5 : 1, transition: 'opacity 0.2s' }}>
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>

          <div style={{ position: 'relative', margin: '1.3rem 0', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: c.border }} />
            <span style={{ position: 'relative', background: c.card, padding: '0 0.6rem', color: c.muted, fontSize: '0.82rem' }}>или</span>
          </div>

          <p style={{ textAlign: 'center', color: c.muted, fontSize: '0.88rem' }}>
            Нет аккаунта?{' '}
            <Link to="/register" style={{ color: c.text, textDecoration: 'none', fontWeight: 500 }}>Зарегистрироваться</Link>
          </p>
        </form>
      </div>
    </div>
  );
}