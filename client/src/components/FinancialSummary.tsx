import { useState } from 'react';
import { FaArrowLeft, FaChartBar, FaExclamationTriangle, FaWallet } from 'react-icons/fa';

export const FinancialSummary = ({ period, reportData, onBack, c }) => {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  
  // Форматирование заголовка периода
  const getPeriodLabel = () => {
    if (period === 'week') return 'за неделю';
    if (period === 'month') return 'за месяц';
    if (period === 'year') return 'за год';
    if (typeof period === 'object' && period?.start && period?.end) {
      return `с ${period.start} по ${period.end}`;
    }
    return '';
  };

  // Безопасно достаем данные агрегации из отчета бэкенда
  const totalExpense = reportData?.totalExpense || 0;
  const totalIncome = reportData?.totalIncome || 0;
  const balance = reportData?.balance || 0;
  
  const expenseStats = reportData?.expenseSummary || [];
  const incomeStats = reportData?.incomeSummary || [];

  // Переключаем текущий список в зависимости от выбранного таба
  const currentStats = activeTab === 'expense' ? expenseStats : incomeStats;

  return (
    <div className="w-full max-w-[600px] mx-auto animate-fade-in text-neutral-900 dark:text-white box-border">
      
      {/* Шапка отчета */}
      <div className="flex items-center gap-4 mb-6 box-border">
        <div 
          onClick={onBack} 
          className="bg-neutral-200 dark:bg-[#1a1a1a] text-neutral-700 dark:text-white p-3 rounded-xl cursor-pointer flex items-center justify-center hover:opacity-80 transition-all"
        >
          <FaArrowLeft className="w-4 h-4" />
        </div>
        <div>
          <h2 className="m-0 text-lg font-bold tracking-tight">Финансовая аналитика</h2>
          <span className="text-xs text-[#666666] dark:text-[#999999]">Показатели {getPeriodLabel()}</span>
        </div>
      </div>

      {/* КАРТОЧКА ОБЩЕГО БАЛАНСА (Доходы / Расходы / Итог) */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-[#141414] dark:to-[#0d0d0d] border border-[#e5e5e5] dark:border-[#222] p-6 rounded-3xl mb-6 shadow-md box-border">
        <div className="grid grid-cols-2 gap-4 text-center box-border">
          <div className="border-0 border-r border-solid border-[#e5e5e5] dark:border-[#222] pr-2 box-border">
            <span className="text-[#666666] dark:text-[#999999] text-[10px] font-bold uppercase tracking-wider">Доходы</span>
            <h3 className="m-0 mt-1 text-emerald-600 dark:text-emerald-500 text-xl font-black">
              +{totalIncome.toLocaleString()} ₽
            </h3>
          </div>
          <div className="box-border">
            <span className="text-[#666666] dark:text-[#999999] text-[10px] font-bold uppercase tracking-wider">Расходы</span>
            <h3 className="m-0 mt-1 text-red-600 dark:text-red-500 text-xl font-black">
              -{totalExpense.toLocaleString()} ₽
            </h3>
          </div>
        </div>
        
        <hr className="border-none h-[1px] bg-[#e5e5e5] dark:bg-[#222] my-4" />
        
        <div className="flex justify-between items-center px-2 box-border">
          <span className="text-[#666666] dark:text-[#999999] text-sm font-medium flex items-center gap-2">
            <FaWallet className="w-3 h-3" /> Чистый баланс:
          </span>
          <span className={`text-lg font-black tracking-tight ${
            balance >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'
          }`}>
            {balance.toLocaleString()} ₽
          </span>
        </div>
      </div>

      {/* ТАБЫ ПЕРЕКЛЮЧЕНИЯ (Расходы / Доходы) */}
      <div className="flex bg-[#f0f0f0] dark:bg-[#141414] border border-transparent dark:border-[#222] p-1 rounded-xl gap-1 mb-6 box-border">
        <button 
          type="button"
          onClick={() => setActiveTab('expense')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold border-none cursor-pointer transition-all ${
            activeTab === 'expense' 
              ? 'bg-white dark:bg-[#222] text-neutral-900 dark:text-white shadow-sm' 
              : 'bg-transparent text-[#666666] dark:text-[#666666] hover:opacity-80'
          }`}
        >
          Расходы ({expenseStats.length})
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('income')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold border-none cursor-pointer transition-all ${
            activeTab === 'income' 
              ? 'bg-white dark:bg-[#222] text-neutral-900 dark:text-white shadow-sm' 
              : 'bg-transparent text-[#666666] dark:text-[#666666] hover:opacity-80'
          }`}
        >
          Доходы ({incomeStats.length})
        </button>
      </div>

      {/* СПИСОК ПОЗИЦИЙ АНАЛИТИКИ */}
      <div className="flex flex-col gap-4 w-full box-border">
        {currentStats.map((item, idx) => {
          const uniqueKey = item.name ? `${item.name}_${idx}` : `category_${idx}`;
          const amount = activeTab === 'expense' ? item.spent : item.earned;

          return (
            <div 
              key={uniqueKey} 
              className={`p-5 rounded-2xl border box-border bg-white dark:bg-[#141414] transition-all ${
                activeTab === 'expense' && item.isOverLimit 
                  ? 'border-red-500/30 shadow-sm shadow-red-500/5' 
                  : 'border-[#e5e5e5] dark:border-[#222]'
              }`}
            >
              <div className="flex justify-between items-start mb-3 box-border">
                <div>
                  <span className="font-bold text-sm text-neutral-900 dark:text-white block">
                    {item.name || 'Без названия'}
                  </span>
                  <span className="text-xs text-[#666666] dark:text-[#999999] font-medium block mt-0.5">
                    {amount.toLocaleString()} ₽ 
                    {activeTab === 'expense' && item.limit ? ` / из лимита ${item.limit.toLocaleString()} ₽` : ''}
                  </span>
                </div>
                
                <div className="text-right box-border">
                  <span className="text-[11px] text-[#666666] dark:text-[#666666] font-bold block mb-0.5">
                    доля: {item.sharePercent || 0}%
                  </span>
                  
                  {activeTab === 'expense' && item.limit && (
                    <span className={`text-sm font-black inline-flex items-center gap-1 ${
                      item.isOverLimit ? 'text-red-500' : 'text-violet-500 dark:text-violet-400'
                    }`}>
                      {item.limitPercent}%
                      {item.isOverLimit && <FaExclamationTriangle className="text-red-500 w-3 h-3" />}
                    </span>
                  )}
                </div>
              </div>

              {/* ЛИНЕЙНЫЙ ГРАФИК (ПРОГРЕСС-БАР) */}
              <div className="w-full h-2 bg-[#f0f0f0] dark:bg-[#0d0d0d] rounded-full overflow-hidden box-border">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    activeTab === 'expense' 
                      ? (item.isOverLimit ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-violet-500') 
                      : 'bg-emerald-500'
                  }`}
                  style={{ 
                    width: `${Math.min(activeTab === 'expense' && item.limit ? item.limitPercent : item.sharePercent, 100)}%` 
                  }}
                />
              </div>

              {/* Индикатор превышения лимита */}
              {activeTab === 'expense' && item.isOverLimit && (
                <div className="text-xs text-red-500 font-semibold mt-2.5 m-0 animate-pulse">
                  Превышение лимита на {item.overLimitAmount?.toLocaleString()} ₽!
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* ПУСТОЙ ЭКРАН */}
      {currentStats.length === 0 && (
        <div className="text-center py-12 text-[#666666] dark:text-[#999999] box-border">
          <FaChartBar className="w-10 h-10 mx-auto opacity-20 mb-3" />
          <p className="text-sm font-medium m-0">Нет операций данного типа за выбранный период</p>
        </div>
      )}

    </div>
  );
};