export class ReportService {
  static async getPeriodReport(userId: string, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const [transactions, categories] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId, date: { gte: start, lte: end } },
      }),
      prisma.category.findMany({ where: { userId } }),
    ]);

    // Карты для агрегации
    const expenseMap: Record<string, { name: string; spent: number; limit: number | null }> = {};
    const incomeMap: Record<string, { name: string; earned: number }> = {};

    // Инициализируем категории из базы, чтобы не потерять лимиты
    categories.forEach(cat => {
      // Разделяй по типу, если у тебя в модели Category есть поле type (например, 'expense' или 'income')
      // Если типа нет, инициализируем как расходную по умолчанию
      const isIncome = (cat as any).type === 'income'; 
      
      if (isIncome) {
        incomeMap[cat.name] = { name: cat.name, earned: 0 };
      } else {
        expenseMap[cat.name] = {
          name: cat.name,
          spent: 0,
          limit: cat.limit ? Number(cat.limit) : null
        };
      }
    });

    let totalExpense = 0;
    let totalIncome = 0;

    // Считаем транзакции
    transactions.forEach(t => {
      const amount = Math.abs(Number(t.amount));
      const catName = t.category || 'Без категории';

      if (t.type === 'expense') {
        totalExpense += amount;
        if (!expenseMap[catName]) {
          expenseMap[catName] = { name: catName, spent: 0, limit: null };
        }
        expenseMap[catName].spent += amount;
      } else if (t.type === 'income') {
        totalIncome += amount;
        if (!incomeMap[catName]) {
          incomeMap[catName] = { name: catName, earned: 0 };
        }
        incomeMap[catName].earned += amount;
      }
    });

    // Формируем аналитику по расходам (с лимитами и долей от общих трат)
    const expenseSummary = Object.values(expenseMap)
      .map(item => {
        const { name, spent, limit } = item;
        
        // Процент выполнения лимита (например, потратил 50% от лимита в 10к)
        const limitPercent = limit && limit > 0 ? Math.round((spent / limit) * 100) : 0;
        
        // Доля этой категории во ВСЕХ расходах (например, продукты — это 30% от всех трат)
        const sharePercent = totalExpense > 0 ? Math.round((spent / totalExpense) * 100) : 0;

        return {
          name,
          spent,
          limit,
          limitPercent,
          sharePercent,
          isOverLimit: limit ? spent > limit : false,
          overLimitAmount: limit && spent > limit ? spent - limit : 0
        };
      })
      .filter(item => item.spent > 0 || (item.limit && item.limit > 0));

    // Аналитика по доходам
    const incomeSummary = Object.values(incomeMap)
      .map(item => ({
        name: item.name,
        earned: item.earned,
        sharePercent: totalIncome > 0 ? Math.round((item.earned / totalIncome) * 100) : 0
      }))
      .filter(item => item.earned > 0);

    return {
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
      expenseSummary,
      incomeSummary,
      period: { start: startDate, end: endDate }
    };
  }
}