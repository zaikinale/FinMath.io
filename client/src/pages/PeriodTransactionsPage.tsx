import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';

export default function PeriodTransactionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Константы стиля (в точности как на Dashboard)
  const c = {
    bg: '#0a0a0a',
    card: '#141414',
    text: '#f5f5f5',
    muted: '#888888',
    border: '#2a2a2a',
    purple: '#8b5cf6',
    green: '#22c55e',
  };

  // Логика даты
  const dateParam = searchParams.get('from') || new Date().toISOString().split('T')[0];
  const currentViewDate = new Date(dateParam);

  const shiftMonth = (offset) => {
    const d = new Date(currentViewDate);
    d.setMonth(d.getMonth() + offset);
    setSearchParams({ from: d.toISOString().split('T')[0] });
  };

  // Данные (замени на свои реальные данные)
  const transactions = [
    { id: 1, cat: 'Магнит', amount: -3200, date: '2026-05-12', type: 'expense' },
    { id: 2, cat: 'Зарплата', amount: 85000, date: '2026-05-10', type: 'income' },
    { id: 3, cat: 'Яндекс Такси', amount: -450, date: '2026-05-10', type: 'expense' },
  ];

  const filteredTransactions = useMemo(() => {
    const targetMonth = currentViewDate.getMonth();
    const targetYear = currentViewDate.getFullYear();
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [dateParam]);

  const grouped = filteredTransactions.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {});

  const s = {
    container: {
      minHeight: '100vh',
      background: c.bg,
      color: c.text,
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem 1rem'
    },
    content: {
      maxWidth: '600px',
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2.5rem'
    },
    backLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: c.muted,
      cursor: 'pointer',
      fontSize: '0.9rem',
      textDecoration: 'none',
      border: 'none',
      background: 'none'
    },
    calendarStrip: {
      background: c.card,
      border: `1px solid ${c.border}`,
      borderRadius: '16px',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2rem'
    },
    monthLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontWeight: 700,
      fontSize: '1.1rem',
      textTransform: 'capitalize'
    },
    dateGroup: {
      marginBottom: '1.5rem'
    },
    dateTitle: {
      fontSize: '0.75rem',
      color: c.muted,
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.75rem',
      paddingLeft: '0.25rem'
    },
    txRow: {
      background: c.card,
      border: `1px solid ${c.border}`,
      borderRadius: '12px',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    categoryIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: 'rgba(139, 92, 246, 0.1)',
      color: c.purple,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={s.container}>
      <div style={s.content}>
        <div style={s.header}>
          <button onClick={() => navigate('/dashboard')} style={s.backLink}>
            <FaArrowLeft /> На дашборд
          </button>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, color: c.purple }}>FinMath</div>
          </div>
        </div>

        <div style={s.calendarStrip}>
          <button onClick={() => shiftMonth(-1)} style={{ background: 'none', border: 'none', color: c.text, cursor: 'pointer' }}>
            <FaChevronLeft />
          </button>
          <div style={s.monthLabel}>
            <FaCalendarAlt size={16} style={{ color: c.purple }} />
            {currentViewDate.toLocaleDateString('ru', { month: 'long', year: 'numeric' })}
          </div>
          <button onClick={() => shiftMonth(1)} style={{ background: 'none', border: 'none', color: c.text, cursor: 'pointer' }}>
            <FaChevronRight />
          </button>
        </div>

        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([date, txs]) => (
            <div key={date} style={s.dateGroup}>
              <div style={s.dateTitle}>
                {new Date(date).toLocaleDateString('ru', { day: 'numeric', month: 'long' })}
              </div>
              {txs.map(tx => (
                <div key={tx.id} style={s.txRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={s.categoryIcon}>{tx.cat[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tx.cat}</div>
                      <div style={{ fontSize: '0.7rem', color: c.muted }}>Операция #{tx.id}</div>
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 800, 
                    color: tx.amount > 0 ? c.green : c.text,
                    fontSize: '1rem'
                  }}>
                    {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} ₽
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: c.muted, marginTop: '4rem' }}>
            Здесь пока ничего нет
          </div>
        )}
      </div>
    </div>
  );
}