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
    <div className="w-full bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-4 box-border shadow-sm">
      
      {/* Шапка календаря */}
      <div className="flex justify-between items-center mb-4 box-border">
        <button 
          onClick={() => changeMonth(-1)} 
          className="bg-transparent border-none cursor-pointer p-1.5 flex items-center justify-center rounded-lg text-[#111111] dark:text-[#f5f5f5] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <FaChevronLeft className="w-3 h-3" />
        </button>
        <div className="font-bold capitalize text-sm text-[#111111] dark:text-[#f5f5f5]">
          {format(currentDate, 'LLLL yyyy', { locale: ru })}
        </div>
        <button 
          onClick={() => changeMonth(1)} 
          className="bg-transparent border-none cursor-pointer p-1.5 flex items-center justify-center rounded-lg text-[#111111] dark:text-[#f5f5f5] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Дни недели */}
      <div className="grid grid-cols-7 gap-[2px] text-center mb-2 box-border">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
          <div key={d} className="text-[10px] text-[#666666] dark:text-[#999999] font-bold uppercase tracking-wider">{d}</div>
        ))}
      </div>

      {/* Сетка дней */}
      <div className="grid grid-cols-7 gap-1 box-border">
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, currentDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const hasData = hasTransactions(day);

          return (
            <div
              key={idx}
              onClick={() => onChange(format(day, 'yyyy-MM-dd'))}
              className={`h-[35px] flex flex-col items-center justify-center cursor-pointer rounded-lg text-xs relative font-semibold transition-all select-none box-border ${
                isSelected 
                  ? 'bg-violet-600 text-white' 
                  : isCurrentMonth 
                    ? 'text-[#111111] dark:text-[#f5f5f5] hover:bg-black/5 dark:hover:bg-white/5' 
                    : 'text-[#666666]/30 dark:text-[#999999]/30 hover:bg-black/5 dark:hover:bg-white/5'
              } ${
                isToday && !isSelected ? 'border border-solid border-violet-500' : 'border-none'
              }`}
            >
              {format(day, 'd')}
              
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