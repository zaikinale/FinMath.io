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

  // СИНХРОНИЗАЦИЯ ЛИМИТА: Исправлено чтение вложенного объекта budget из Prisma
  useEffect(() => {
    const cat = currentCats.find(item => item.id === selectedCatId);
    
    if (cat?.budget && typeof cat.budget === 'object') {
      setTempLimit(cat.budget.amount?.toString() || "");
    } else {
      setTempLimit("");
    }
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

      const safeCreated = { ...created, budget: null };

      setCategories({
        ...categories,
        [activeTab]: [...currentCats, safeCreated]
      });
      setNewCatName("");
      setSelectedCatId(safeCreated.id);
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

  // --- ЭНДПОИНТ: СОХРАНЕНИЕ ЛИМИТА ---
  const handleSaveLimit = async () => {
    if (activeTab !== 'expense' || !selectedCatId || loading) return;

    setLoading(true);
    try {
      const updated = await FinanceService.updateCategory(selectedCatId, {
        budgetAmount: tempLimit ? Number(tempLimit) : null
      });

      setCategories({
        ...categories,
        expense: categories.expense.map(cat => cat.id === updated.id ? updated : cat)
      });
      alert("Лимит успешно обновлен");
    } catch (err) {
      console.error("Ошибка сохранения лимита:", err);
      alert("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = currentCats.find(cat => cat.id === selectedCatId);

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-[10px] flex items-center justify-center z-[2000] p-4 box-border">
      
      {/* Главный контейнер карточки */}
      <div className="w-full max-w-[700px] flex flex-col bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-3xl overflow-hidden box-border shadow-2xl">
        
        {/* Header Tabs */}
        <div className="px-6 py-4 border-0 border-b border-solid border-[#e5e5e5] dark:border-[#2a2a2a] flex justify-between items-center bg-white dark:bg-[#141414] box-border">
          <div className="flex gap-2 items-center box-border">
             <button 
               onClick={() => setActiveTab('expense')} 
               className={`px-4 py-2 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ${
                 activeTab === 'expense' 
                   ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/10' 
                   : 'bg-transparent text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5'
               }`}
             >
               Расходы
             </button>
             <button 
               onClick={() => setActiveTab('income')} 
               className={`px-4 py-2 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ${
                 activeTab === 'income' 
                   ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/10' 
                   : 'bg-transparent text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5'
               }`}
             >
               Доходы
             </button>
          </div>
          <FaTimes 
            onClick={onClose} 
            className="cursor-pointer text-[#666666] dark:text-[#999999] hover:opacity-80 transition-opacity w-4 h-4" 
          />
        </div>

        {/* Тело модалки с разбивкой на две колонки */}
        <div className="flex h-[450px] w-full box-border">
          
          {/* Левый сайдбар: Список категорий */}
          <div className="w-[40%] border-0 border-r border-solid border-[#e5e5e5] dark:border-[#2a2a2a] flex flex-col bg-neutral-50 dark:bg-[#0d0d0d] box-border">
            
            {/* Форма добавления */}
            <form onSubmit={handleAddCategory} className="p-4 border-0 border-b border-solid border-[#e5e5e5] dark:border-[#2a2a2a] flex gap-2 box-border">
              <input 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Название..."
                disabled={loading}
                className="flex-1 px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-neutral-900 dark:text-white text-xs box-border outline-none transition-colors focus:border-neutral-400 dark:focus:border-neutral-600 disabled:opacity-60"
              />
              <button 
                type="submit" 
                disabled={loading} 
                className="w-9 h-9 bg-violet-600 hover:bg-violet-500 text-white rounded-xl flex items-center justify-center border-none cursor-pointer transition-colors disabled:opacity-60 flex-shrink-0"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </form>

            {/* Элементы списка */}
            <div className="overflow-y-auto flex-1 box-border">
              {currentCats.map((cat) => (
                <div 
                  key={cat.id} 
                  onClick={() => setSelectedCatId(cat.id)} 
                  className={`px-5 py-4 cursor-pointer flex justify-between items-center transition-all border-0 border-l-[3px] border-solid ${
                    selectedCatId === cat.id 
                      ? 'bg-violet-500/10 border-violet-500' 
                      : 'bg-transparent border-transparent hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                  }`}
                >
                  <span className="text-neutral-900 dark:text-white text-sm font-semibold truncate pr-2 box-border">
                    {cat.name}
                  </span>
                  <FaTrashAlt 
                    onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }} 
                    className="text-red-500 w-3 h-3 opacity-60 hover:opacity-100 cursor-pointer transition-opacity flex-shrink-0" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Правая часть: Настройки выбранной категории */}
          <div className="w-[60%] p-8 bg-white dark:bg-[#141414] flex flex-col justify-center items-center text-center box-border">
            {selectedCategory ? (
              activeTab === 'expense' ? (
                <div className="w-full max-w-[250px] mx-auto box-border">
                  <h2 className="text-neutral-900 dark:text-white m-0 mb-6 text-xl font-black truncate">
                    {selectedCategory.name}
                  </h2>
                  <div className="mb-8 box-border">
                    <label className="text-[#666666] dark:text-[#999999] text-[10px] font-bold block mb-3 uppercase tracking-wider">
                      Месячный лимит (₽)
                    </label>
                    <input 
                      type="number" 
                      value={tempLimit} 
                      onChange={(e) => setTempLimit(e.target.value)} 
                      className="w-full bg-transparent border-none border-b-2 border-solid border-[#e5e5e5] dark:border-[#2a2a2a] text-neutral-900 dark:text-white text-center text-3xl font-black outline-none pb-2 transition-colors focus:border-violet-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="∞"
                    />
                  </div>
                  <button 
                    onClick={handleSaveLimit} 
                    disabled={loading}
                    className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-none cursor-pointer transition-colors shadow-sm shadow-violet-500/10 disabled:opacity-60"
                  >
                    <FaSave className="w-3.5 h-3.5" /> Сохранить
                  </button>
                </div>
              ) : (
                <div className="box-border">
                  <h2 className="text-neutral-900 dark:text-white m-0 text-xl font-black truncate">
                    {selectedCategory.name}
                  </h2>
                  <p className="text-[#666666] dark:text-[#999999] text-xs font-semibold mt-3 m-0 max-w-[280px]">
                    Для категорий доходов лимиты не предусмотрены.
                  </p>
                </div>
              )
            ) : (
              <span className="text-[#666666] dark:text-[#999999] text-xs font-medium">
                Выберите категорию из списка слева
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};