import React, { useState, useEffect } from 'react';
import { FaTimes, FaShieldAlt, FaSave, FaChevronRight, FaPlus, FaTrashAlt } from 'react-icons/fa';

export const CategorySettingsModal = ({ isOpen, onClose, categories, setCategories, s, c }) => {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [selectedCatName, setSelectedCatName] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [tempLimit, setTempLimit] = useState("");

  const currentCats = categories[activeTab] || [];

  // Сброс выбора при смене таба
  useEffect(() => {
    if (currentCats.length > 0) {
      const first = currentCats[0];
      setSelectedCatName(typeof first === 'string' ? first : first.name);
    } else {
      setSelectedCatName("");
    }
  }, [activeTab, isOpen]);

  // Синхронизация лимита
  useEffect(() => {
    const cat = currentCats.find(item => (typeof item === 'string' ? item : item.name) === selectedCatName);
    setTempLimit(cat && typeof cat !== 'string' ? (cat.limit || "") : "");
  }, [selectedCatName]);

  if (!isOpen) return null;

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    const newItem = activeTab === 'expense' ? { name: newCatName.trim(), limit: null } : newCatName.trim();
    
    setCategories({
      ...categories,
      [activeTab]: [...currentCats, newItem]
    });
    setNewCatName("");
    setSelectedCatName(newCatName.trim());
  };

  const handleDelete = (name: string) => {
    setCategories({
      ...categories,
      [activeTab]: currentCats.filter(cat => (typeof cat === 'string' ? cat : cat.name) !== name)
    });
    if (selectedCatName === name) setSelectedCatName("");
  };

  const handleSaveLimit = () => {
    if (activeTab !== 'expense') return;
    setCategories({
      ...categories,
      expense: categories.expense.map(cat => {
        const name = typeof cat === 'string' ? cat : cat.name;
        return name === selectedCatName ? { name, limit: tempLimit ? Number(tempLimit) : null } : cat;
      })
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', background: '#141414', border: `1px solid ${c.border}`, padding: 0, overflow: 'hidden', borderRadius: '24px' }}>
        
        {/* Header */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#141414' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <button onClick={() => setActiveTab('expense')} style={{ background: activeTab === 'expense' ? c.purple : 'transparent', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Расходы</button>
             <button onClick={() => setActiveTab('income')} style={{ background: activeTab === 'income' ? c.purple : 'transparent', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Доходы</button>
          </div>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', color: c.muted }} />
        </div>

        <div style={{ display: 'flex', height: '450px' }}>
          
          {/* Sidebar */}
          <div style={{ width: '40%', borderRight: `1px solid ${c.border}`, display: 'flex', flexDirection: 'column', background: '#0d0d0d' }}>
            
            {/* Add Form */}
            <form onSubmit={handleAddCategory} style={{ padding: '1rem', borderBottom: `1px solid ${c.border}`, display: 'flex', gap: '0.5rem' }}>
              <input 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Новая..."
                style={{ ...s.input, background: '#1a1a1a', fontSize: '0.8rem', padding: '0.5rem' }}
              />
              <button type="submit" style={{ ...s.btn, background: c.purple, color: '#fff', padding: '0.5rem' }}><FaPlus /></button>
            </form>

            {/* List */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {currentCats.map((cat) => {
                const name = typeof cat === 'string' ? cat : cat.name;
                const isActive = selectedCatName === name;
                return (
                  <div key={name} onClick={() => setSelectedCatName(name)} style={{ padding: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isActive ? c.purple + '22' : 'transparent', borderLeft: `3px solid ${isActive ? c.purple : 'transparent'}` }}>
                    <span style={{ color: '#fff', fontSize: '0.9rem' }}>{name}</span>
                    <FaTrashAlt onClick={(e) => { e.stopPropagation(); handleDelete(name); }} style={{ color: '#ff4444', fontSize: '0.75rem', opacity: 0.5 }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Settings Panel */}
          <div style={{ width: '60%', padding: '2rem', background: '#141414', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            {selectedCatName ? (
              activeTab === 'expense' ? (
                <div>
                  <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>{selectedCatName}</h2>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ color: c.muted, fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Месячный лимит (₽)</label>
                    <input 
                      type="number" 
                      value={tempLimit} 
                      onChange={(e) => setTempLimit(e.target.value)} 
                      style={{ ...s.input, background: '#0d0d0d', color: '#fff', textAlign: 'center', fontSize: '1.4rem' }}
                      placeholder="Без лимита"
                    />
                  </div>
                  <button onClick={handleSaveLimit} style={{ ...s.btn, background: c.purple, color: '#fff', width: '100%', justifyContent: 'center' }}>
                    <FaSave style={{ marginRight: '8px' }} /> Сохранить
                  </button>
                </div>
              ) : (
                <div>
                  <h2 style={{ color: '#fff' }}>{selectedCatName}</h2>
                  <p style={{ color: c.muted }}>Для категорий доходов лимиты не предусмотрены.</p>
                </div>
              )
            ) : (
              <span style={{ color: c.muted }}>Выберите или добавьте категорию</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};