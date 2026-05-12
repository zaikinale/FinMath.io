import type { Request, Response } from 'express';
import { ReportService } from '../services/report.service.js';

export class ReportController {
  static async getReport(req: Request, res: Response) {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        return res.status(400).json({ message: 'Не указаны даты начала и конца периода' });
      }

      const report = await ReportService.getPeriodReport(
        req.user!.id, 
        start as string, 
        end as string
      );

      res.json(report);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Ошибка при генерации отчета' });
    }
  }
}