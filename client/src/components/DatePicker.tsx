import React from 'react';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths 
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const CalendarNavigation = ({ value, onChange, transactions, c, s }) => {
  const currentDate = new Date(value);
  
  // Логика генерации дней
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Проверка, есть ли транзакции в конкретный день (для точек/подсветки)
  const hasTransactions = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return transactions.some(t => t.date === dateStr);
  };

  const changeMonth = (offset) => {
    const newDate = offset > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
    onChange(format(newDate, 'yyyy-MM-dd'));
  };

  return (
    <div style={{ ...s.card, padding: '1rem' }}>
      {/* Шапка календаря */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={() => changeMonth(-1)} style={navBtnStyle}><FaChevronLeft size={12} color={c.text}/></button>
        <div style={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '0.9rem' }}>
          {format(currentDate, 'LLLL yyyy', { locale: ru })}
        </div>
        <button onClick={() => changeMonth(1)} style={navBtnStyle}><FaChevronRight size={12} color={c.text}/></button>
      </div>

      {/* Дни недели */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', marginBottom: '0.5rem' }}>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
          <div key={d} style={{ fontSize: '0.7rem', color: c.muted, fontWeight: 600 }}>{d}</div>
        ))}
      </div>

      {/* Сетка дней */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, currentDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const hasData = hasTransactions(day);

          return (
            <div
              key={idx}
              onClick={() => onChange(format(day, 'yyyy-MM-dd'))}
              style={{
                height: '35px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '8px',
                fontSize: '0.8rem',
                position: 'relative',
                background: isSelected ? c.purple : 'transparent',
                color: isSelected ? '#fff' : (isCurrentMonth ? c.text : `${c.muted}55`),
                transition: '0.2s',
                border: isSameDay(day, new Date()) ? `1px solid ${c.purple}` : 'none'
              }}
            >
              {format(day, 'd')}
              {/* Точка, если в этот день были операции */}
              {hasData && !isSelected && (
                <div style={{ 
                  width: '4px', height: '4px', borderRadius: '50%', 
                  background: c.purple, position: 'absolute', bottom: '4px' 
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const navBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center'
};