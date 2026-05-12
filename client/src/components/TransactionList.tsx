import React from 'react';

export const TransactionList = ({ transactions, isDark, c }) => {
  if (!transactions || transactions.length === 0) {
    return <div style={{ color: c.muted, textAlign: 'center', padding: '2rem' }}>Нет операций</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {transactions.map((tx) => {
        // Проверяем, является ли категория объектом или строкой
        const categoryDisplay = typeof tx.category === 'object' && tx.category !== null
          ? tx.category.name 
          : (tx.category || tx.categoryId || "Без категории");

        const isExpense = tx.type === 'expense' || tx.amount < 0;

        return (
          <div key={tx.id} style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '1rem', background: 'rgba(255,255,255,0.03)', 
            borderRadius: '12px', border: `1px solid ${c.border}` 
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{tx.desc || "Без описания"}</div>
              {/* Выводим именно строку categoryDisplay */}
              <div style={{ fontSize: '0.75rem', color: c.purple }}>{categoryDisplay}</div>
            </div>
            <div style={{ 
              fontWeight: 800, 
              color: isExpense ? '#ff4444' : '#00c853' 
            }}>
              {isExpense ? '' : '+'}{Number(tx.amount).toLocaleString()} ₽
            </div>
          </div>
        );
      })}
    </div>
  );
};