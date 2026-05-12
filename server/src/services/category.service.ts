import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CategoryService {
  static async getAll(userId: string) {
    return await prisma.category.findMany({
      where: { userId },
      include: { budget: true }
    });
  }

  static async create(userId: string, data: any) {
    return await prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        icon: data.icon,
        color: data.color,
        userId
      }
    });
  }

  static async update(userId: string, categoryId: string, data: any) {
    return await prisma.category.update({
      where: { id: categoryId, userId },
      data: {
        name: data.name,
        icon: data.icon,
        color: data.color,
        // Если передан budgetAmount, обновляем или создаем лимит
        budget: data.budgetAmount !== undefined ? {
          upsert: {
            create: { amount: data.budgetAmount, userId },
            update: { amount: data.budgetAmount }
          }
        } : undefined
      },
      include: { budget: true }
    });
  }

  static async delete(userId: string, categoryId: string) {
    return await prisma.category.delete({
      where: { id: categoryId, userId }
    });
  }
}