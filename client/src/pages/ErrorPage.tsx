import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaExclamationTriangle } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function ErrorPage() {
  const [isDark, setIsDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const navigate = useNavigate();

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const c = {
    bg: isDark ? '#0a0a0a' : '#fafafa',
    text: isDark ? '#f5f5f5' : '#111111',
    muted: isDark ? '#999999' : '#666666',
    border: isDark ? '#2a2a2a' : '#e5e5e5',
    accent: isDark ? '#ffffff' : '#000000',
    accentText: isDark ? '#0a0a0a' : '#ffffff',
  };

  const btnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 500,
    cursor: 'pointer', textDecoration: 'none', transition: 'opacity 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', background: c.bg, color: c.text, fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center', transition: 'background 0.3s, color 0.3s', position: 'relative'
    }}>
      {/* Кнопка назад */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'none', border: 'none', color: c.muted, fontSize: '0.875rem', cursor: 'pointer', padding: 0
        }}
      >
        <FaArrowLeft style={{ width: '14px', height: '14px' }} /> Назад
      </button>

      {/* Иконка */}
      <div style={{ marginBottom: '1.5rem', color: c.muted }}>
        <FaExclamationTriangle style={{ width: '48px', height: '48px' }} />
      </div>

      {/* Код ошибки */}
      <h1 style={{ fontSize: 'clamp(4rem, 12vw, 7rem)', fontWeight: 800, lineHeight: 1, margin: 0, letterSpacing: '-0.04em', color: c.accent }}>
        404
      </h1>

      {/* Заголовок */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0.5rem 0 0.75rem', letterSpacing: '-0.02em' }}>
        Страница не найдена
      </h2>

      {/* Описание */}
      <p style={{ color: c.muted, fontSize: '1rem', maxWidth: '420px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
        Возможно, ссылка устарела, страница была удалена или вы ввели неверный адрес.
      </p>

      {/* Кнопки действий */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/"
          style={{ ...btnBase, background: c.accent, color: c.accentText }}
        >
          <FaHome style={{ width: '14px', height: '14px' }} /> На главную
        </Link>
        <button
          onClick={() => navigate(-1)}
          style={{ ...btnBase, background: 'transparent', border: `1px solid ${c.border}`, color: c.text }}
        >
          Вернуться назад
        </button>
      </div>

      {/* Футер-подсказка */}
      <p style={{ position: 'absolute', bottom: '1.5rem', color: c.muted, fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} FinTrack
      </p>
    </div>
  );
}