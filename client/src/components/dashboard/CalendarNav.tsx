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
    <div className="w-full bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl p-4 box-border shadow-sm">
      
      {/* Шапка навигации */}
      <div className="flex justify-between items-center mb-4 box-border">
        <button 
          onClick={() => handleMonthChange(-1)} 
          className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center rounded-lg text-neutral-800 dark:text-[#f5f5f5] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <FaChevronLeft className="w-3 h-3" />
        </button>
        <span className="font-bold text-xs capitalize text-neutral-900 dark:text-[#f5f5f5] tracking-tight">
          {monthName}
        </span>
        <button 
          onClick={() => handleMonthChange(1)} 
          className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center rounded-lg text-neutral-800 dark:text-[#f5f5f5] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Дни недели и сетка дней */}
      <div className="grid grid-cols-7 gap-1 text-center box-border">
        {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(d => (
          <div key={d} className="text-[10px] text-[#666666] dark:text-[#999999] font-bold uppercase pb-1 tracking-wider">
            {d}
          </div>
        ))}
        
        {days.map((d, i) => {
          if (!d) return <div key={i} className="h-[30px]" />;
          
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isSelected = value === dateKey;
          
          const hasData = transactions.some(t => {
            if (!t.date) return false;
            const tDate = typeof t.date === 'string' ? t.date.split('T')[0] : new Date(t.date).toISOString().split('T')[0];
            return tDate === dateKey;
          });

          return (
            <div 
              key={i} 
              onClick={() => onDateClick(dateKey)} 
              className={`h-[30px] flex items-center justify-center cursor-pointer rounded-lg text-xs relative font-semibold transition-all select-none box-border ${
                isSelected 
                  ? 'bg-violet-600 text-white shadow-sm' 
                  : 'text-neutral-900 dark:text-[#f5f5f5] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {d} 
              
              {/* Точка активности */}
              {hasData && !isSelected && (
                <div className="w-1 h-1 rounded-full bg-violet-500 absolute bottom-1 left-1/2 -translate-x-1/2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};