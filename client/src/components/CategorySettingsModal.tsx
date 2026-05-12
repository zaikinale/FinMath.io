import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaPlus, FaTrashAlt } from 'react-icons/fa';

// Импорт твоего сервиса
import { FinanceService } from "../api/finance.service.js";

export const CategorySettingsModal = ({ isOpen, onClose, categories, setCategories, s, c }) => {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [tempLimit, setTempLimit] = useState("");
  const [loading, setLoading] = useState(false);

  const currentCats = categories[activeTab] || [];

  // Сброс выбора при смене таба или открытии
  useEffect(() => {
    if (isOpen && currentCats.length > 0) {
      setSelectedCatId(currentCats[0].id);
    } else {
      setSelectedCatId(null);
    }
  }, [activeTab, isOpen]);

  // Синхронизация лимита при выборе категории
  useEffect(() => {
    const cat = currentCats.find(item => item.id === selectedCatId);
    setTempLimit(cat?.limit?.toString() || "");
  }, [selectedCatId, currentCats]);

  if (!isOpen) return null;

  // --- ЭНДПОИНТ: СОЗДАНИЕ ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || loading) return;

    setLoading(true);
    try {
      const created = await FinanceService.createCategory({
        name: newCatName.trim(),
        type: activeTab
      });

      setCategories({
        ...categories,
        [activeTab]: [...currentCats, created]
      });
      setNewCatName("");
      setSelectedCatId(created.id);
    } catch (err) {
      console.error("Ошибка при создании:", err);
      alert("Не удалось создать категорию");
    } finally {
      setLoading(false);
    }
  };

  // --- ЭНДПОИНТ: УДАЛЕНИЕ ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить категорию? Все связанные транзакции могут остаться без категории.")) return;
    
    setLoading(true);
    try {
      await FinanceService.deleteCategory(id);
      setCategories({
        ...categories,
        [activeTab]: currentCats.filter(cat => cat.id !== id)
      });
      if (selectedCatId === id) setSelectedCatId(null);
    } catch (err) {
      alert("Ошибка при удалении");
    } finally {
      setLoading(false);
    }
  };

  // --- ЭНДПОИНТ: СОХРАНЕНИЕ ЛИМИТА (Только для расходов) ---
  const handleSaveLimit = async () => {
    if (activeTab !== 'expense' || !selectedCatId || loading) return;

    setLoading(true);
    try {
      const updated = await FinanceService.updateCategory(selectedCatId, {
        limit: tempLimit ? Number(tempLimit) : null
      });

      setCategories({
        ...categories,
        expense: categories.expense.map(cat => cat.id === updated.id ? updated : cat)
      });
      alert("Лимит обновлен");
    } catch (err) {
      alert("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = currentCats.find(cat => cat.id === selectedCatId);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
      <div style={{ ...s.card, width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', background: '#141414', border: `1px solid ${c.border}`, padding: 0, overflow: 'hidden', borderRadius: '24px' }}>
        
        {/* Header Tabs */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#141414' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <button onClick={() => setActiveTab('expense')} style={{ background: activeTab === 'expense' ? c.purple : 'transparent', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: '0.3s' }}>Расходы</button>
             <button onClick={() => setActiveTab('income')} style={{ background: activeTab === 'income' ? c.purple : 'transparent', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: '0.3s' }}>Доходы</button>
          </div>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', color: c.muted }} />
        </div>

        <div style={{ display: 'flex', height: '450px' }}>
          
          {/* Sidebar: Список категорий */}
          <div style={{ width: '40%', borderRight: `1px solid ${c.border}`, display: 'flex', flexDirection: 'column', background: '#0d0d0d' }}>
            
            <form onSubmit={handleAddCategory} style={{ padding: '1rem', borderBottom: `1px solid ${c.border}`, display: 'flex', gap: '0.5rem' }}>
              <input 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Название..."
                disabled={loading}
                style={{ flex: 1, background: '#1a1a1a', border: `1px solid ${c.border}`, borderRadius: '8px', color: '#fff', fontSize: '0.8rem', padding: '0.5rem' }}
              />
              <button type="submit" disabled={loading} style={{ ...s.btn, background: c.purple, color: '#fff', padding: '0.5rem', width: '40px' }}><FaPlus /></button>
            </form>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {currentCats.map((cat) => (
                <div 
                  key={cat.id} 
                  onClick={() => setSelectedCatId(cat.id)} 
                  style={{ 
                    padding: '1rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: selectedCatId === cat.id ? c.purple + '22' : 'transparent', 
                    borderLeft: `3px solid ${selectedCatId === cat.id ? c.purple : 'transparent'}`,
                    transition: '0.2s'
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '0.9rem' }}>{cat.name}</span>
                  <FaTrashAlt 
                    onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }} 
                    style={{ color: '#ff4444', fontSize: '0.75rem', opacity: 0.6, cursor: 'pointer' }} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Main Content: Настройки выбранной категории */}
          <div style={{ width: '60%', padding: '2rem', background: '#141414', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            {selectedCategory ? (
              activeTab === 'expense' ? (
                <div style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }}>
                  <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.5rem' }}>{selectedCategory.name}</h2>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ color: c.muted, fontSize: '0.75rem', display: 'block', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Месячный лимит (₽)</label>
                    <input 
                      type="number" 
                      value={tempLimit} 
                      onChange={(e) => setTempLimit(e.target.value)} 
                      style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `2px solid ${c.border}`, color: '#fff', textAlign: 'center', fontSize: '1.8rem', outline: 'none', padding: '0.5rem 0' }}
                      placeholder="∞"
                    />
                  </div>
                  <button 
                    onClick={handleSaveLimit} 
                    disabled={loading}
                    style={{ ...s.btn, background: c.purple, color: '#fff', width: '100%', justifyContent: 'center', padding: '0.8rem' }}
                  >
                    <FaSave style={{ marginRight: '8px' }} /> Сохранить
                  </button>
                </div>
              ) : (
                <div>
                  <h2 style={{ color: '#fff', fontSize: '1.5rem' }}>{selectedCategory.name}</h2>
                  <p style={{ color: c.muted, marginTop: '1rem' }}>Для категорий доходов лимиты не предусмотрены.</p>
                </div>
              )
            ) : (
              <span style={{ color: c.muted }}>Выберите категорию из списка слева</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};