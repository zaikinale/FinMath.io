export const TransactionList = ({ transactions, isDark, c }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {transactions.length > 0 ? transactions.map(tx => (
        <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: `1px solid ${c.border}` }}>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: isDark ? '#222' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{tx.categoryId[0]}</div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{tx.desc || tx.categoryId}</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {tx.tags?.map(t => <span key={t} style={{ fontSize: '0.7rem', color: c.muted }}>#{t}</span>)}
              </div>
            </div>
          </div>
          <div style={{ fontWeight: 700, color: tx.amount > 0 ? c.green : c.text }}>
            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} ₽
          </div>
        </div>
      )) : <p style={{ textAlign: 'center', color: c.muted }}>Нет записей</p>}
    </div>
  );