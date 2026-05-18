import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { type Transaction, type ThemeColors } from './dashboard.types';

interface CalendarNavProps {
  value: string;
  onChange: (date: string) => void;
  onDateClick: (date: string) => void;
  transactions: Transaction[];
  c: ThemeColors;
}

export const CalendarNav: React.FC<CalendarNavProps> = ({ value, onChange, transactions, c, onDateClick }) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const shift = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  
  const days: (number | null)[] = [];
  for (let i = 0; i < shift; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  
  const monthName = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(date);
  
  const handleMonthChange = (offset: number) => {
    const newDate = new Date(year, month + offset, 1);
    onChange(newDate.toISOString().split('T')[0]);
  };

  return (
    <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={() => handleMonthChange(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text }}><FaChevronLeft size={12}/></button>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'capitalize' }}>{monthName}</span>
        <button onClick={() => handleMonthChange(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text }}><FaChevronRight size={12}/></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
        {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(d => (<div key={d} style={{ fontSize: '0.65rem', color: c.muted, fontWeight: 600, paddingBottom: '4px' }}>{d}</div>))}
        {days.map((d, i) => {
          if (!d) return <div key={i} />;
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isSelected = value === dateKey;
          const hasData = transactions.some(t => {
            if (!t.date) return false;
            const tDate = typeof t.date === 'string' ? t.date.split('T')[0] : new Date(t.date).toISOString().split('T')[0];
            return tDate === dateKey;
          });
          return (
            <div key={i} onClick={() => onDateClick(dateKey)} style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '6px', fontSize: '0.75rem', position: 'relative', background: isSelected ? c.purple : 'transparent', color: isSelected ? '#fff' : c.text, transition: '0.2s' }}>
              {d} {hasData && !isSelected && (<div style={{ width: '4px', height: '4px', borderRadius: '50%', background: c.purple, position: 'absolute', bottom: '3px' }} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
};