import React from 'react';
import { FaTimes } from 'react-icons/fa';

export const TransactionModal = ({ isOpen, onClose, onSubmit, register, handleSubmit, watch, setValue, categories, s, c }) => {
  if (!isOpen) return null;

  // ТУТ ИСПРАВЛЕНИЕ: выбираем нужный массив категорий на основе значения 'type' (expense или income)
  const currentType = watch('type') || 'expense';
  const categoriesList = Array.isArray(categories) ? categories : (categories[currentType] || []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Новая запись</h3>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: s.isDark ? '#1a1a1a' : '#f0f0f0', padding: '4px', borderRadius: '10px' }}>
            <button 
              type="button" 
              onClick={() => setValue('type', 'expense')} 
              style={{ ...s.btn, flex: 1, justifyContent: 'center', background: watch('type') === 'expense' ? c.card : 'transparent' }}
            >
              Расход
            </button>
            <button 
              type="button" 
              onClick={() => setValue('type', 'income')} 
              style={{ ...s.btn, flex: 1, justifyContent: 'center', background: watch('type') === 'income' ? c.card : 'transparent' }}
            >
              Доход
            </button>
          </div>
          
          <input type="number" {...register('amount')} style={{ ...s.input, fontSize: '1.4rem', fontWeight: 700, textAlign: 'center' }} placeholder="0 ₽" />
          
          <select {...register('categoryId')} style={s.input}>
            {/* ИСПОЛЬЗУЕМ отфильтрованный список */}
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="date" {...register('date')} style={s.input} />
            <input type="text" {...register('desc')} style={s.input} placeholder="Комментарий" />
          </div>
          
          <button type="submit" style={{ ...s.btn, background: c.accent, color: c.accentText, justifyContent: 'center', fontWeight: 700 }}>
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
};