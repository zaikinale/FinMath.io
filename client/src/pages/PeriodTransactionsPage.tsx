import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { FinanceService } from "../api/finance.service.js";

export default function PeriodTransactionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const dateParam = searchParams.get('from') || new Date().toISOString().split('T')[0];
  const currentViewDate = new Date(dateParam);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(true);
        const data = await FinanceService.getTransactions(); 
        setTransactions(data);
      } catch (err) {
        console.error("Ошибка загрузки транзакций:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlyData();
  }, [dateParam]);

  const shiftMonth = (offset) => {
    const d = new Date(currentViewDate);
    d.setMonth(d.getMonth() + offset);
    setSearchParams({ from: d.toISOString().split('T')[0] });
  };

  const filteredTransactions = useMemo(() => {
    const targetMonth = currentViewDate.getMonth();
    const targetYear = currentViewDate.getFullYear();
    
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, dateParam]);

  const grouped = filteredTransactions.reduce((acc, tx) => {
    const dayKey = new Date(tx.date).toISOString().split('T')[0];
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(tx);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-[#f5f5f5] flex items-center justify-center font-sans">
        Загрузка истории...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-[#f5f5f5] font-sans px-4 py-8 box-border flex flex-col items-center">
      <div className="w-full max-w-[600px] flex flex-col">
        
        {/* Шапка */}
        <div className="w-full flex items-center justify-between mb-10">
          <button 
            type="button"
            onClick={() => navigate('/dashboard')} 
            className="bg-transparent border-none text-[#888888] hover:text-[#f5f5f5] cursor-pointer flex items-center gap-2 text-sm py-1 transition-colors"
          >
            <FaArrowLeft className="w-3.5 h-3.5" /> На дашборд
          </button>
          <div className="text-right">
            <div className="font-extrabold text-[#8b5cf6] tracking-wider">FinMath</div>
          </div>
        </div>

        {/* Переключатель месяца */}
        <div className="w-full bg-[#141414] border border-[#2a2a2a] rounded-2xl p-4 flex items-center justify-between mb-8 box-border">
          <button 
            type="button"
            onClick={() => shiftMonth(-1)} 
            className="bg-transparent border-none text-[#f5f5f5] hover:text-[#8b5cf6] cursor-pointer p-2 flex items-center transition-colors"
          >
            <FaChevronLeft size={14} />
          </button>
          
          <div className="flex items-center gap-3 font-bold text-base capitalize tracking-wide">
            <FaCalendarAlt size={16} className="text-[#8b5cf6]" />
            {currentViewDate.toLocaleDateString('ru', { month: 'long', year: 'numeric' })}
          </div>
          
          <button 
            type="button"
            onClick={() => shiftMonth(1)} 
            className="bg-transparent border-none text-[#f5f5f5] hover:text-[#8b5cf6] cursor-pointer p-2 flex items-center transition-colors"
          >
            <FaChevronRight size={14} />
          </button>
        </div>

        {/* Список транзакций */}
        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([date, txs]) => (
            <div key={date} className="mb-6 w-full">
              <div className="text-xs text-[#888888] font-extrabold uppercase tracking-wider mb-3 px-1">
                {new Date(date).toLocaleDateString('ru', { day: 'numeric', month: 'long' })}
              </div>
              
              <div className="flex flex-col gap-2">
                {txs.map(tx => (
                  <div key={tx.id} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex justify-between items-center box-border shadow-sm">
                    <div className="flex items-center gap-4">
                      
                      {/* Динамическая иконка категории */}
                      <div 
                        style={{
                          background: tx.category?.color ? `${tx.category.color}22` : 'rgba(139, 92, 246, 0.1)',
                          color: tx.category?.color || '#8b5cf6'
                        }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm uppercase flex-shrink-0"
                      >
                        {tx.category?.name?.[0] || '?'}
                      </div>
                      
                      <div className="flex flex-col">
                        <div className="font-semibold text-sm text-[#f5f5f5]">{tx.category?.name || 'Без категории'}</div>
                        <div className="text-xs text-[#888888] mt-0.5">{tx.desc || 'Нет описания'}</div>
                      </div>
                    </div>
                    
                    {/* Сумма */}
                    <div className={`font-extrabold text-base tracking-tight ${tx.type === 'income' ? 'text-[#22c55e]' : 'text-[#f5f5f5]'}`}>
                      {tx.type === 'income' ? `+${Number(tx.amount).toLocaleString()}` : `${Number(tx.amount).toLocaleString()}`} ₽
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-[#888888] font-medium mt-16 text-sm">
            В этом месяце операций не найдено
          </div>
        )}
      </div>
    </div>
  );
}