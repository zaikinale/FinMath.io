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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] flex items-center justify-center z-[1000] p-4 box-border">
      
      {/* Карточка модального окна */}
      <div className="w-full max-w-[440px] bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-2xl p-6 box-border shadow-xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold m-0 text-black dark:text-white tracking-tight">Новая запись</h3>
          <FaTimes 
            onClick={onClose} 
            className="cursor-pointer text-[#666666] dark:text-[#999999] hover:opacity-80 transition-opacity w-4 h-4" 
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 box-border">
          
          {/* Switcher: Expense / Income */}
          <div className="flex gap-1 bg-[#f0f0f0] dark:bg-[#1a1a1a] p-1 rounded-xl box-border">
            <button 
              type="button" 
              onClick={() => setValue('type', 'expense')} 
              className={`flex-1 py-2 rounded-lg text-xs font-bold border-none cursor-pointer flex items-center justify-center transition-all ${
                currentType === 'expense' 
                  ? 'bg-white dark:bg-[#2a2a2a] text-violet-500 shadow-sm' 
                  : 'bg-transparent text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#f5f5f5]'
              }`}
            >
              Расход
            </button>
            <button 
              type="button" 
              onClick={() => setValue('type', 'income')} 
              className={`flex-1 py-2 rounded-lg text-xs font-bold border-none cursor-pointer flex items-center justify-center transition-all ${
                currentType === 'income' 
                  ? 'bg-white dark:bg-[#2a2a2a] text-violet-500 shadow-sm' 
                  : 'bg-transparent text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-[#f5f5f5]'
              }`}
            >
              Доход
            </button>
          </div>
          
          {/* Amount Input */}
          <div className="relative box-border">
            <input 
              type="number" 
              step="any"
              {...register('amount', { required: true })} 
              className="w-full text-3xl font-black text-center p-3 bg-transparent border-none border-b-2 border-[#e5e5e5] dark:border-[#2a2a2a] text-[#111111] dark:text-[#f5f5f5] box-border outline-none transition-colors focus:border-violet-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0" 
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-[#666666] dark:text-[#999999] font-bold">₽</span>
          </div>
          
          {/* Category Select */}
          <div className="flex flex-col gap-1.5 box-border">
            <label className="text-xs font-semibold text-[#666666] dark:text-[#999999] ml-1">Категория</label>
            <select 
              {...register('categoryId', { required: true })} 
              className="w-full px-3 py-2.5 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-[#111111] dark:text-[#f5f5f5] text-sm box-border outline-none cursor-pointer transition-colors focus:border-neutral-400 dark:focus:border-neutral-600"
            >
              <option value="" className="bg-white dark:bg-[#141414]">Выберите категорию...</option>
              {categoriesList.map(cat => {
                const id = typeof cat === 'object' ? cat.id : cat;
                const name = typeof cat === 'object' ? cat.name : cat;
                
                return (
                  <option key={id} value={id} className="bg-white dark:bg-[#141414]">
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Date & Description */}
          <div className="flex gap-4 box-border">
            <div className="flex-1 min-w-0 box-border">
              <label className="text-xs font-semibold text-[#666666] dark:text-[#999999] block mb-1.5">Дата</label>
              <input 
                type="date" 
                {...register('date')} 
                className="w-full px-3 py-2.5 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-[#111111] dark:text-[#f5f5f5] text-sm box-border outline-none transition-colors focus:border-neutral-400 dark:focus:border-neutral-600" 
              />
            </div>
            <div className="flex-[1.5] min-w-0 box-border">
              <label className="text-xs font-semibold text-[#666666] dark:text-[#999999] block mb-1.5">Комментарий</label>
              <input 
                type="text" 
                {...register('desc')} 
                className="w-full px-3 py-2.5 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-xl text-[#111111] dark:text-[#f5f5f5] text-sm box-border outline-none transition-colors focus:border-neutral-400 dark:focus:border-neutral-600" 
                placeholder="На что потратили?" 
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white border-none rounded-xl text-sm font-bold transition-colors cursor-pointer mt-2 shadow-sm shadow-violet-500/10"
          >
            Сохранить транзакцию
          </button>
        </form>
      </div>
    </div>
  );
};