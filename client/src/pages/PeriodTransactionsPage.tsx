import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaReceipt, FaCalendarDay } from 'react-icons/fa';

export function PeriodTransactionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDark, setIsDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const c = {
    bg: isDark ? '#0a0a0a' : '#fafafa', card: isDark ? '#141414' : '#ffffff',
    text: isDark ? '#f5f5f5' : '#111111', muted: isDark ? '#999999' : '#666666',
    border: isDark ? '#2a2a2a' : '#e5e5e5', accent: isDark ? '#ffffff' : '#000000',
    green: '#16a34a', red: '#dc2626'
  };

  // Получаем даты из URL
  const fromParam = searchParams.get('from') || new Date().toISOString().split('T')[0];
  const toParam = searchParams.get('to') || fromParam;

  // Парсим для навигации
  const fromDate = new Date(fromParam);
  const shiftPeriod = (months: number) => {
    const newFrom = new Date(fromDate);
    newFrom.setMonth(newFrom.getMonth() + months);
    const newTo = new Date(newFrom);
    newTo.setDate(newTo.getDate() + (new Date(newFrom.getFullYear(), newFrom.getMonth() + 1, 0).getDate() - 1));
    setSearchParams({
      from: newFrom.toISOString().split('T')[0],
      to: newTo.toISOString().split('T')[0]
    });
  };

  // Моковые данные за период
  const periodTx = [
    { id: 1, cat: 'Продукты', amount: -4500, date: '12.05.2026' },
    { id: 2, cat: 'Фриланс', amount: 25000, date: '10.05.2026' },
    { id: 3, cat: 'Кафе', amount: -890, date: '09.05.2026' },
    { id: 4, cat: 'Аренда', amount: -35000, date: '01.05.2026' },
  ];

  const cardStyle: React.CSSProperties = { background: c.card, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem' };
  const btnNav: React.CSSProperties = { background: 'none', border: `1px solid ${c.border}`, color: c.text, padding: '0.5rem 0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, fontFamily: 'system-ui, -apple-system, sans-serif', paddingBottom: '2rem', transition: 'background 0.3s, color 0.3s' }}>
      {/* Шапка */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem 1rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: c.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: 0 }}>
          <FaArrowLeft /> Дашборд
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Операции за период</h1>
        <div style={{ width: '60px' }} /> {/* Spacer */}
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Навигация по периодам */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
          <button onClick={() => shiftPeriod(-1)} style={btnNav}><FaChevronLeft /> Пред.</button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: c.muted, margin: 0 }}>Период</p>
            <p style={{ fontSize: '1rem', fontWeight: 600, margin: '0.2rem 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaCalendarDay style={{ color: c.muted }} /> {fromDate.toLocaleDateString('ru', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={() => shiftPeriod(1)} style={btnNav}>След. <FaChevronRight /></button>
        </div>

        {/* Список */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaReceipt style={{ color: c.muted }} /> {periodTx.length} операций
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {periodTx.map(tx => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: c.bg, borderRadius: '10px', border: `1px solid ${c.border}`, transition: 'transform 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: c.card, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.muted, fontSize: '0.8rem' }}>{tx.cat[0]}</div>
                  <div><p style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>{tx.cat}</p><p style={{ fontSize: '0.75rem', color: c.muted, margin: '0.15rem 0 0' }}>{tx.date}</p></div>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: tx.amount > 0 ? c.green : c.text }}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            ))}
            {periodTx.length === 0 && (
              <p style={{ textAlign: 'center', color: c.muted, padding: '2rem 0', fontSize: '0.9rem' }}>Нет операций за этот период</p>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: c.muted, fontSize: '0.75rem', marginTop: '1rem' }}>
          Листайте периоды для просмотра истории • Данные хранятся локально
        </p>
      </div>
    </div>
  );
}