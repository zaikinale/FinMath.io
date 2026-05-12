import { prisma } from '../lib/prisma.js';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionService {
  static async getAll(userId: string, date?: string) {
    return await prisma.transaction.findMany({
      where: { 
        userId,
        ...(date && { date }) // Фильтрация по дате, если передана
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async create(userId: string, data: any) {
    const { amount, type, categoryId, date, desc } = data;

    // 1. Создаем транзакцию
    const transaction = await prisma.transaction.create({
      data: {
        amount: new Decimal(amount),
        type,
        categoryId,
        date,
        desc,
        userId
      },
      include: { category: { include: { budget: true } } }
    });

    // 2. Если это расход и у категории есть бюджет — проверяем превышение
    let limitExceeded = false;
    if (type === 'expense' && transaction.category.budget) {
      const budgetAmount = transaction.category.budget.amount;
      
      // Считаем сумму трат по этой категории за текущий месяц (на основе поля date)
      const monthStart = date.substring(0, 7); // Из "2026-05-12" получаем "2026-05"
      const totalSpent = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId,
          type: 'expense',
          date: { startsWith: monthStart }
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