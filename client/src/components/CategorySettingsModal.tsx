import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTrashAlt } from 'react-icons/fa';

export const CategorySettingsModal = ({ isOpen, onClose, categories, setCategories, s, c }) => {
  const [newCategory, setNewCategory] = useState("");
  const [activeTab, setActiveTab] = useState("expense");

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    // Обновляем состояние категорий в родительском компоненте
    setCategories({
      ...categories,
      [activeTab]: [...categories[activeTab], newCategory.trim()]
    });
    setNewCategory("");
  };

  const handleDelete = (catToDelete) => {
    setCategories({
      ...categories,
      [activeTab]: categories[activeTab].filter(cat => cat !== catToDelete)
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: '1rem' }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Настройка категорий</h3>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', color: c.muted }} />
        </div>

        {/* Табы: Расходы / Доходы */}
        <div style={{ display: 'flex', gap: '0.5rem', background: s.isDark ? '#1a1a1a' : '#f0f0f0', padding: '4px', borderRadius: '10px', marginBottom: '1.5rem' }}>
          <button onClick={() => setActiveTab('expense')} style={{ ...s.btn, flex: 1, background: activeTab === 'expense' ? c.card : 'transparent' }}>Расходы</button>
          <button onClick={() => setActiveTab('income')} style={{ ...s.btn, flex: 1, background: activeTab === 'income' ? c.card : 'transparent' }}>Доходы</button>
        </div>

        {/* Форма добавления */}
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input 
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={s.input} 
            placeholder="Название..." 
          />
          <button type="submit" style={{ ...s.btn, background: c.purple, color: '#fff', padding: '0 1.2rem' }}>
            <FaPlus />
          </button>
        </form>

        {/* Список текущих категорий */}
        <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {categories[activeTab].map((cat) => (
            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: s.isDark ? '#1a1a1a' : '#f9f9f9', borderRadius: '8px', border: `1px solid ${c.border}` }}>
              <span style={{ fontSize: '0.9rem' }}>{cat}</span>
              <FaTrashAlt 
                onClick={() => handleDelete(cat)}
                style={{ cursor: 'pointer', color: '#dc2626', fontSize: '0.8rem', opacity: 0.7 }} 
              />
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{ ...s.btn, width: '100%', marginTop: '1.5rem', border: `1px solid ${c.border}` }}>
          Готово
        </button>
      </div>
    </div>
  );
};