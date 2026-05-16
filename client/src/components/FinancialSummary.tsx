import React, { useState } from 'react';
import { FaArrowLeft, FaChartBar, FaExclamationTriangle, FaCalendarDay, FaWallet } from 'react-icons/fa';

export const FinancialSummary = ({ period, reportData, onBack, c }) => {
  const [activeTab, setActiveTab] = useState('expense'); // 'expense' или 'income'
  
  // Безопасные фолбэки для цветов темы, чтобы ничего не падало
  const errorColor = c?.error || '#ef4444';
  const successColor = c?.success || '#10b981';
  const mutedColor = c?.muted || '#888';
  const purpleColor = c?.purple || '#a855f7';

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
    <div style={{ animation: 'fadeIn 0.4s ease', color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Шапка отчета */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div 
          onClick={onBack} 
          style={{ background: '#1a1a1a', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <FaArrowLeft />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Финансовая аналитика</h2>
          <span style={{ fontSize: '0.8rem', color: mutedColor }}>Показатели {getPeriodLabel()}</span>
        </div>
      </div>

      {/* КАРТОЧКА ОБЩЕГО БАЛАНСА (Доходы / Расходы / Итог) */}
      <div style={{ background: 'linear-gradient(135deg, #141414 0%, #0d0d0d 100%)', padding: '1.5rem', borderRadius: '24px', border: '1px solid #222', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
          <div style={{ borderRight: '1px solid #222', paddingRight: '0.5rem' }}>
            <span style={{ color: mutedColor, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Доходы</span>
            <h3 style={{ margin: '0.2rem 0', color: successColor, fontSize: '1.3rem', fontWeight: 700 }}>+{totalIncome.toLocaleString()} ₽</h3>
          </div>
          <div>
            <span style={{ color: mutedColor, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Расходы</span>
            <h3 style={{ margin: '0.2rem 0', color: errorColor, fontSize: '1.3rem', fontWeight: 700 }}>-{totalExpense.toLocaleString()} ₽</h3>
          </div>
        </div>
        
        <hr style={{ border: 'none', height: '1px', background: '#222', margin: '1rem 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
          <span style={{ color: mutedColor, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaWallet size={12}/> Чистый баланс:
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, marginLeft: 'auto', color: balance >= 0 ? successColor : errorColor }}>
            {balance.toLocaleString()} ₽
          </span>
        </div>
      </div>

      {/* ТАБЫ ПЕРЕКЛЮЧЕНИЯ (Расходы / Доходы) */}
      <div style={{ display: 'flex', background: '#141414', padding: '0.3rem', borderRadius: '12px', gap: '0.3rem', marginBottom: '1.5rem' }}>
        <button 
          type="button"
          onClick={() => setActiveTab('expense')}
          style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: '9px', background: activeTab === 'expense' ? '#222' : 'transparent', color: activeTab === 'expense' ? '#fff' : '#666', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Расходы ({expenseStats.length})
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('income')}
          style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: '9px', background: activeTab === 'income' ? '#222' : 'transparent', color: activeTab === 'income' ? '#fff' : '#666', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Доходы ({incomeStats.length})
        </button>
      </div>

      {/* СПИСОК ПОЗИЦИЙ АНАЛИТИКИ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {currentStats.map((item, idx) => {
          // Защита от дублей ID / Key: связка имени и индекса гарантирует уникальность для React Virtual DOM
          const uniqueKey = item.name ? `${item.name}_${idx}` : `category_${idx}`;
          const amount = activeTab === 'expense' ? item.spent : item.earned;

          return (
            <div key={uniqueKey} style={{ background: '#141414', padding: '1.2rem', borderRadius: '18px', border: `1px solid ${item.isOverLimit ? errorColor + '44' : '#222'}` }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1rem', display: 'block' }}>{item.name || 'Без названия'}</span>
                  <span style={{ fontSize: '0.8rem', color: mutedColor }}>
                    {amount.toLocaleString()} ₽ 
                    {activeTab === 'expense' && item.limit ? ` / из лимита ${item.limit.toLocaleString()} ₽` : ''}
                  </span>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  {/* Доля категории в общем объеме трат/поступлений за период */}
                  <span style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '2px' }}>
                    доля: {item.sharePercent || 0}%
                  </span>
                  
                  {/* Процент выполнения лимита бюджета (только для расходов) */}
                  {activeTab === 'expense' && item.limit && (
                    <span style={{ fontSize: '1rem', fontWeight: 900, color: item.isOverLimit ? errorColor : purpleColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {item.limitPercent}%
                      {item.isOverLimit && <FaExclamationTriangle color={errorColor} size={12} />}
                    </span>
                  )}
                </div>
              </div>

              {/* ЛИНЕЙНЫЙ ГРАФИК (ПРОГРЕСС-БАР) */}
              <div style={{ width: '100%', height: '8px', background: '#0d0d0d', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(activeTab === 'expense' && item.limit ? item.limitPercent : item.sharePercent, 100)}%`, 
                  height: '100%', 
                  background: activeTab === 'expense' ? (item.isOverLimit ? errorColor : purpleColor) : successColor,
                  boxShadow: item.isOverLimit ? `0 0 10px ${errorColor}44` : 'none',
                  transition: 'width 0.8s ease-out'
                }} />
              </div>

              {/* Индикатор превышения лимита */}
              {activeTab === 'expense' && item.isOverLimit && (
                <div style={{ fontSize: '0.75rem', color: errorColor, marginTop: '0.5rem', fontWeight: 500 }}>
                  Превышение лимита на {item.overLimitAmount?.toLocaleString()} ₽!
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* ПУСТОЙ ЭКРАН (Если за период нет транзакций нужного типа) */}
      {currentStats.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: mutedColor }}>
          <FaChartBar size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>Нет операций данного типа за выбранный период</p>
        </div>
      )}

    </div>
  );
};