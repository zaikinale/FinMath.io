import { prisma } from '../lib/prisma.js';

export class NoteService {
  static async getAll(userId: string) {
    return await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async create(userId: string, data: { title: string, content?: string }) {
    return await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        userId
      }
    });
  }

  static async update(userId: string, id: string, data: { title?: string, content?: string }) {
    return await prisma.note.update({
      where: { id, userId },
      data
    });
  }

  static async delete(userId: string, id: string) {
    return await prisma.note.delete({
      where: { id, userId }
    });
  }
}