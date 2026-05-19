import { FaTimes } from 'react-icons/fa';

export const TransactionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  register, 
  handleSubmit, 
  watch, 
  setValue, 
  categories, 
  s, 
  c 
}) => {
  if (!isOpen) return null;

  // Определяем текущий тип (Расход/Доход)
  const currentType = watch('type') || 'expense';
  
  // Безопасно извлекаем список категорий
  const categoriesList = Array.isArray(categories) 
    ? categories 
    : (categories[currentType] || []);

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(0,0,0,0.6)', 
      backdropFilter: 'blur(4px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000, 
      padding: '1rem' 
    }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '440px', background: s.isDark ? '#141414' : '#fff' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: s.isDark ? '#fff' : '#000' }}>Новая запись</h3>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', color: c.muted }} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Switcher: Expense / Income */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            background: s.isDark ? '#1a1a1a' : '#f0f0f0', 
            padding: '4px', 
            borderRadius: '12px' 
          }}>
            <button 
              type="button" 
              onClick={() => setValue('type', 'expense')} 
              style={{ 
                ...s.btn, 
                flex: 1, 
                justifyContent: 'center', 
                background: currentType === 'expense' ? (s.isDark ? '#2a2a2a' : '#fff') : 'transparent',
                color: currentType === 'expense' ? c.purple : c.muted,
                boxShadow: currentType === 'expense' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              Расход
            </button>
            <button 
              type="button" 
              onClick={() => setValue('type', 'income')} 
              style={{ 
                ...s.btn, 
                flex: 1, 
                justifyContent: 'center', 
                background: currentType === 'income' ? (s.isDark ? '#2a2a2a' : '#fff') : 'transparent',
                color: currentType === 'income' ? c.purple : c.muted,
                boxShadow: currentType === 'income' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              Доход
            </button>
          </div>
          
          {/* Amount Input */}
          <div style={{ position: 'relative' }}>
            <input 
              type="number" 
              step="any"
              {...register('amount', { required: true })} 
              style={{ 
                ...s.input, 
                fontSize: '1.8rem', 
                fontWeight: 700, 
                textAlign: 'center',
                padding: '1rem',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${c.border}`
              }} 
              placeholder="0" 
            />
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: c.muted }}>₽</span>
          </div>
          
          {/* Category Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', color: c.muted, marginLeft: '4px' }}>Категория</label>
            <select 
              {...register('categoryId', { required: true })} 
              style={{ ...s.input, cursor: 'pointer' }}
            >
              <option value="">Выберите категорию...</option>
              {categoriesList.map(cat => {
                // Обработка и объектов, и строк (для обратной совместимости)
                const id = typeof cat === 'object' ? cat.id : cat;
                const name = typeof cat === 'object' ? cat.name : cat;
                
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Date & Description */}
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: c.muted, display: 'block', marginBottom: '0.4rem' }}>Дата</label>
              <input type="date" {...register('date')} style={s.input} />
            </div>
            <div style={{ flex: 1.5 }}>
              <label style={{ fontSize: '0.75rem', color: c.muted, display: 'block', marginBottom: '0.4rem' }}>Комментарий</label>
              <input type="text" {...register('desc')} style={s.input} placeholder="На что потратили?" />
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            style={{ 
              ...s.btn, 
              background: c.purple, 
              color: '#fff', 
              justifyContent: 'center', 
              fontWeight: 700, 
              padding: '1rem',
              marginTop: '0.5rem',
              fontSize: '1rem'
            }}
          >
            Сохранить транзакцию
          </button>
        </form>
      </div>
    </div>
  );
};