import type { Request, Response } from 'express';
import { AiService } from '../services/ai.service.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AiController {
  // 1. Твой существующий метод: Генерация аналитики за период
  static async getPeriodAnalytics(req: Request, res: Response) {
    try {
      // id пользователя положит сюда мидлвара authMiddleware после проверки куки
      const userId = (req as any).user.id;
      
      // Ждем параметры из урла: /api/ai/analytics?startDate=2026-05-01&endDate=2026-05-16
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Параметры startDate и endDate обязательны' });
      }

      // Вызываем метод сервиса
      const report = await AiService.generatePeriodReport(
        userId, 
        startDate as string, 
        endDate as string
      );

      // Возвращаем JSON с текстом отчета
      return res.json({ report });
    } catch (error: any) {
      console.error('Ошибка в AiController (getPeriodAnalytics):', error);
      return res.status(500).json({ message: error.message || 'Ошибка генерации ИИ-отчета' });
    }
  }

  // 2. Новый метод: Сохранение сгенерированного отчета в историю
  static async saveReport(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { periodType, dateRange, insight } = req.body;

      if (!periodType || !dateRange || !insight) {
        return res.status(400).json({ 
          message: 'Не все поля переданы. Обязательны: periodType, dateRange, insight' 
        });
      }

      const newReport = await prisma.aiReport.create({
        data: {
          periodType,
          dateRange,
          insight,
          userId,
        },
      });

      return res.status(201).json({ success: true, data: newReport });
    } catch (error: any) {
      console.error('Ошибка в AiController (saveReport):', error);
      return res.status(500).json({ 
        message: error.message || 'Внутренняя ошибка при сохранении отчета в базу данных' 
      });
    }
  }

  // 3. Новый метод: Получение всей истории сохраненных отчетов пользователя
  static async getReportsHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const reports = await prisma.aiReport.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }, // Свежие отчеты всегда будут первыми в списке
      });

      return res.json({ success: true, data: reports });
    } catch (error: any) {
      console.error('Ошибка в AiController (getReportsHistory):', error);
      return res.status(500).json({ 
        message: error.message || 'Внутренняя ошибка при получении истории отчетов' 
      });
    }
  }

  // 4. Новый метод: Удаление отчета из истории
  static async deleteReport(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      // Сначала ищем отчет, чтобы убедиться, что он существует
      const report = await prisma.aiReport.findUnique({
        where: { id },
      });

      if (!report) {
        return res.status(404).json({ message: 'Отчет не найден' });
      }

      // Проверка безопасности: не даем удалить чужой отчет
      if (report.userId !== userId) {
        return res.status(403).json({ message: 'Нет прав на удаление этого отчета' });
      }

      await prisma.aiReport.delete({
        where: { id },
      });

      return res.json({ success: true, message: 'Отчет успешно удален из истории' });
    } catch (error: any) {
      console.error('Ошибка в AiController (deleteReport):', error);
      return res.status(500).json({ 
        message: error.message || 'Внутренняя ошибка при удалении отчета' 
      });
    }
  }
}