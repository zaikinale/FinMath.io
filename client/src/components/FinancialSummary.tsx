import React from 'react';
import { FaArrowLeft, FaChartBar, FaExclamationTriangle, FaCalendarDay } from 'react-icons/fa';

export const FinancialSummary = ({ period, transactions, categories, onBack, s, c }) => {
  // 1. Форматирование заголовка периода
  const getPeriodLabel = () => {
    if (period === 'week') return 'за неделю';
    if (period === 'month') return 'за месяц';
    if (period === 'year') return 'за год';
    if (typeof period === 'object') return `с ${period.start} по ${period.end}`;
    return '';
  };

  // 2. Расчет данных
  const stats = categories.expense.map(cat => {
    const name = typeof cat === 'string' ? cat : cat.name;
    const limit = typeof cat === 'string' ? null : cat.limit;
    
    const spent = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        const now = new Date();
        const isCat = t.category === name && t.type === 'expense';
        
        if (!isCat) return false;

        if (period === 'week') return (now.getTime() - tDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        if (period === 'month') return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        if (period === 'year') return tDate.getFullYear() === now.getFullYear();
        if (typeof period === 'object') return tDate >= new Date(period.start) && tDate <= new Date(period.end);
        return true;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return { name, spent, limit };
  }).filter(s => s.spent > 0 || s.limit > 0);

  const totalSpent = stats.reduce((sum, item) => sum + item.spent, 0);

  return (
    <div style={{ animation: 'fadeIn 0.4s ease', color: '#fff' }}>
      {/* Шапка отчета */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div 
          onClick={onBack} 
          style={{ background: '#1a1a1a', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <FaArrowLeft />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Финансовый отчет</h2>
          <span style={{ fontSize: '0.8rem', color: c.muted }}>Показатели {getPeriodLabel()}</span>
        </div>
      </div>

      {/* Общий итог */}
      <div style={{ background: `linear-gradient(135deg, ${c.purple}22 0%, #141414 100%)`, padding: '2rem', borderRadius: '24px', border: `1px solid ${c.purple}33`, marginBottom: '2rem', textAlign: 'center' }}>
        <span style={{ color: c.muted, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Всего израсходовано</span>
        <h1 style={{ margin: '0.5rem 0', fontSize: '2.5rem', fontWeight: 900 }}>{totalSpent.toLocaleString()} ₽</h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#00000044', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', color: c.muted }}>
          <FaCalendarDay size={12}/> {stats.length} активных категорий
        </div>
      </div>

      {/* Детализация по категориям */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {stats.map(item => {
          const ratio = item.limit ? (item.spent / item.limit) : 0;
          const percent = Math.round(ratio * 100);
          const isOver = item.limit && item.spent > item.limit;

          return (
            <div key={item.name} style={{ background: '#141414', padding: '1.2rem', borderRadius: '18px', border: `1px solid ${isOver ? c.error + '44' : '#222'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1rem', display: 'block' }}>{item.name}</span>
                  <span style={{ fontSize: '0.8rem', color: c.muted }}>
                    {item.spent.toLocaleString()} ₽ {item.limit ? `/ ${item.limit.toLocaleString()} ₽` : ''}
                  </span>
                </div>
                {item.limit && (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: isOver ? c.error : c.purple }}>
                      {percent}%
                    </span>
                    {isOver && <FaExclamationTriangle color={c.error} size={10} style={{ marginLeft: '5px' }} />}
                  </div>
                )}
              </div>

              {/* Прогресс-бар лимита */}
              {item.limit && (
                <div style={{ width: '100%', height: '10px', background: '#0d0d0d', borderRadius: '20px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${Math.min(percent, 100)}%`, 
                    height: '100%', 
                    background: isOver ? c.error : c.purple,
                    boxShadow: isOver ? `0 0 15px ${c.error}66` : 'none',
                    transition: 'width 1s ease-out'
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {stats.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: c.muted }}>
          <FaChartBar size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>Нет данных по операциям за этот период</p>
        </div>
      )}
    </div>
  );
};