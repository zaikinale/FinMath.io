import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { type ThemeColors, type ThemeStyles, type ReportPeriod } from './dashboard.types';

interface ReportPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (period: ReportPeriod) => void;
  c: ThemeColors;
  s: ThemeStyles;
}

export const ReportPeriodModal: React.FC<ReportPeriodModalProps> = ({ isOpen, onClose, onSelect, c, s }) => {
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 box-border">
      
      {/* Главный контейнер карточки */}
      <div className="w-full max-w-[350px] bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 rounded-3xl box-border shadow-2xl">
        
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-5 box-border">
          <h3 className="m-0 text-base font-bold text-neutral-900 dark:text-white tracking-tight">Выбор периода</h3>
          <button 
            onClick={onClose} 
            className="background-none border-none text-[#666666] dark:text-[#999999] hover:opacity-80 cursor-pointer p-1 transition-opacity flex items-center justify-center"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Сетка кнопок быстрого выбора */}
        <div className="flex flex-col gap-3 w-full box-border">
          {(['week', 'month', 'year'] as const).map(p => (
            <button 
              key={p} 
              onClick={() => onSelect(p)} 
              className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-800 dark:text-[#f5f5f5] border border-solid border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl font-semibold text-xs flex items-center justify-start gap-2.5 cursor-pointer transition-colors box-border"
            >
              <FaCalendarAlt className="text-violet-600 dark:text-violet-400 w-3 h-3 flex-shrink-0" /> 
              {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
            </button>
          ))}
          
          {/* Блок кастомного периода */}
          <div className="mt-2 pt-4 border-0 border-t border-solid border-[#e5e5e5] dark:border-[#2a2a2a] box-border">
            <p className="text-[11px] text-[#666666] dark:text-[#999999] font-bold uppercase tracking-wider m-0 mb-3">
              Кастомный период
            </p>
            
            <div className="flex flex-col gap-2 w-full box-border">
              <input 
                type="date" 
                onChange={(e) => setCustomRange({...customRange, start: e.target.value})} 
                className="w-full px-4 py-2.5 bg-white dark:bg-black/20 text-neutral-900 dark:text-white border border-solid border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-xs font-semibold outline-none box-border transition-colors focus:border-violet-500 [&::-webkit-calendar-picker-indicator]:dark:invert" 
              />
              <input 
                type="date" 
                onChange={(e) => setCustomRange({...customRange, end: e.target.value})} 
                className="w-full px-4 py-2.5 bg-white dark:bg-black/20 text-neutral-900 dark:text-white border border-solid border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-xs font-semibold outline-none box-border transition-colors focus:border-violet-500 [&::-webkit-calendar-picker-indicator]:dark:invert" 
              />
              
              <button 
                disabled={!customRange.start || !customRange.end} 
                onClick={() => onSelect(customRange)} 
                className="w-full h-11 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white font-bold text-xs border-none rounded-xl mt-2 cursor-pointer flex items-center justify-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-violet-500/10"
              >
                Показать отчет
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};