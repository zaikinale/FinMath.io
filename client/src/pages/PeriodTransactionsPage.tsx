import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
// Импортируем наш сервис
import { FinanceService } from "../api/finance.service.js";

export default function PeriodTransactionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Состояние для данных из БД
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Константы стиля
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

  // --- ЭФФЕКТ ЗАГРУЗКИ ДАННЫХ ---
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(true);
        // Вычисляем начало и конец месяца для фильтрации (если бэкенд поддерживает фильтры)
        // Либо, если бэкенд возвращает все транзакции юзера, фильтруем на фронте
        const data = await FinanceService.getTransactions(); 
        setTransactions(data);
      } catch (err) {
        console.error("Ошибка загрузки транзакций:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlyData();
  }, [dateParam]); // Перезагружаем при смене месяца

  const shiftMonth = (offset) => {
    const d = new Date(currentViewDate);
    d.setMonth(d.getMonth() + offset);
    setSearchParams({ from: d.toISOString().split('T')[0] });
  };

  // Фильтрация и группировка (теперь используем реальные данные из БД)
  const filteredTransactions = useMemo(() => {
    const targetMonth = currentViewDate.getMonth();
    const targetYear = currentViewDate.getFullYear();
    
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, dateParam]);

  const grouped = filteredTransactions.reduce((acc, tx) => {
    // В БД поле называется 'date' (строка ISO или Date)
    // Приводим к формату YYYY-MM-DD для группировки
    const dayKey = new Date(tx.date).toISOString().split('T')[0];
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(tx);
    return acc;
  }, {});

  const s = {
    // ... твои стили без изменений ...
    container: { minHeight: '100vh', background: c.bg, color: c.text, fontFamily: 'system-ui, sans-serif', padding: '2rem 1rem' },
    content: { maxWidth: '600px', margin: '0 auto' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' },
    backLink: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: c.muted, cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'none', border: 'none', background: 'none' },
    calendarStrip: { background: c.card, border: `1px solid ${c.border}`, borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' },
    monthLabel: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.1rem', textTransform: 'capitalize' },
    dateGroup: { marginBottom: '1.5rem' },
    dateTitle: { fontSize: '0.75rem', color: c.muted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.25rem' },
    txRow: { background: c.card, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
    categoryIcon: (color) => ({
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: color ? `${color}22` : 'rgba(139, 92, 246, 0.1)',
      color: color || c.purple,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '0.9rem'
    })
  };

  if (loading) return <div style={{ color: c.text, textAlign: 'center', padding: '5rem' }}>Загрузка истории...</div>;

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
                    {/* Теперь берем имя и цвет из объекта category, который пришел с бэкенда */}
                    <div style={s.categoryIcon(tx.category?.color)}>
                        {tx.category?.name?.[0] || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tx.category?.name || 'Без категории'}</div>
                      <div style={{ fontSize: '0.7rem', color: c.muted }}>{tx.desc || 'Нет описания'}</div>
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 800, 
                    color: tx.type === 'income' ? c.green : c.text,
                    fontSize: '1rem'
                  }}>
                    {tx.type === 'income' ? `+${Number(tx.amount).toLocaleString()}` : `${Number(tx.amount).toLocaleString()}`} ₽
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: c.muted, marginTop: '4rem' }}>
            В этом месяце операций не найдено
          </div>
        )}
      </div>
    </div>
  );
}