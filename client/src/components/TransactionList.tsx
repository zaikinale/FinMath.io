export const TransactionList = ({ transactions, isDark, c }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-[#666666] dark:text-[#888888] text-center py-8 font-medium text-sm box-border">
        Нет операций
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full box-border">
      {transactions.map((tx) => {
        // Проверяем, является ли категория объектом или строкой
        const categoryDisplay = typeof tx.category === 'object' && tx.category !== null
          ? tx.category.name 
          : (tx.category || tx.categoryId || "Без категории");

        const isExpense = tx.type === 'expense' || tx.amount < 0;

        return (
          <div 
            key={tx.id} 
            className="flex justify-between items-center p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] box-border hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
          >
            <div className="min-w-0 pr-2 box-border">
              <div className="font-bold text-sm text-[#111111] dark:text-white truncate">
                {tx.desc || "Без описания"}
              </div>
              <div className="text-xs text-violet-500 font-semibold mt-0.5 truncate">
                {categoryDisplay}
              </div>
            </div>
            
            <div className={`font-black text-sm tracking-tight whitespace-nowrap ${
              isExpense ? 'text-red-500' : 'text-emerald-500'
            }`}>
              {isExpense ? '' : '+'}{Number(tx.amount).toLocaleString()} ₽
            </div>
          </div>
        );
      })}
    </div>
  );
};