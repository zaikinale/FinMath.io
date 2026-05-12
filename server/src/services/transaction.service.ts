import { prisma } from '../lib/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionService {
  static async getAll(userId: string, dateStr?: string) {
    const where: any = { userId };

    if (dateStr) {
      // Создаем диапазон: от 00:00:00 до 23:59:59
      const start = new Date(dateStr);
      start.setUTCHours(0, 0, 0, 0);
      
      const end = new Date(dateStr);
      end.setUTCHours(23, 59, 59, 999);

      where.date = {
        gte: start,
        lte: end,
      };
    }

    return await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' } // Сортируем по дате операции, а не создания записи
    });
  }

  static async create(userId: string, data: any) {
    const { amount, type, categoryId, date, desc } = data;
    
    // Преобразуем входящую дату в объект Date для Prisma
    const transactionDate = new Date(date);

    // 1. Создаем транзакцию
    const transaction = await prisma.transaction.create({
      data: {
        amount: new Decimal(amount),
        type,
        categoryId,
        date: transactionDate,
        desc,
        userId
      },
      include: { category: { include: { budget: true } } }
    });

    // 2. Проверка бюджета
    let limitExceeded = false;
    if (type === 'expense' && transaction.category.budget) {
      const budgetAmount = transaction.category.budget.amount;
      
      // Определяем начало и конец текущего месяца для агрегации
      const startOfMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1);
      const endOfMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth() + 1, 0, 23, 59, 59, 999);

      const totalSpent = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId,
          type: 'expense',
          date: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: { amount: true }
      });

      const currentSum = totalSpent._sum.amount || new Decimal(0);
      if (currentSum.greaterThan(budgetAmount)) {
        limitExceeded = true;
      }
    }

    return { transaction, limitExceeded };
  }

  static async delete(userId: string, id: string) {
    return await prisma.transaction.delete({
      where: { id, userId }
    });
  }
}