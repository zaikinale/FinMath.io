import { prisma } from '../lib/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

export class ReportService {
  static async getPeriodReport(userId: string, startDate: string, endDate: string) {
    // 1. Получаем агрегированные данные по расходам
    const expenseStats = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: 'expense',
        date: {
          gte: startDate, // Больше или равно
          lte: endDate,   // Меньше или равно
        },
      },
      _sum: {
        amount: true,
      },
    });

    // 2. Получаем названия категорий для этих ID
    const categories = await prisma.category.findMany({
      where: { userId },
      select: { id: true, name: true, color: true }
    });

    // 3. Формируем финальный отчет
    const report = expenseStats.map(stat => {
      const category = categories.find(c => c.id === stat.categoryId);
      return {
        categoryId: stat.categoryId,
        categoryName: category?.name || 'Без категории',
        color: category?.color || '#ccc',
        total: Math.abs(Number(stat._sum.amount || 0)), // Приводим к положительному числу для графиков
      };
    });

    // 4. Считаем общие итоги за период
    const totals = await prisma.transaction.aggregate({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true }
    });

    return {
      period: { startDate, endDate },
      categories: report,
      totalBalance: Number(totals._sum.amount || 0)
    };
  }
}