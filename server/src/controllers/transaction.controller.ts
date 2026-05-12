import type { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service.js';

export class TransactionController {
  static async getTransactions(req: Request, res: Response) {
    try {
      const date = req.query.date as string;
      const transactions = await TransactionService.getAll(req.user!.id, date);
      res.json(transactions);
    } catch (e) {
      res.status(500).json({ message: 'Ошибка при получении транзакций' });
    }
  }

  static async createTransaction(req: Request, res: Response) {
    try {
      const { transaction, limitExceeded } = await TransactionService.create(req.user!.id, req.body);
      
      // Возвращаем транзакцию и флаг превышения лимита, чтобы фронт мог показать уведомление
      res.status(201).json({
        transaction,
        warning: limitExceeded ? 'Внимание! Лимит по категории превышен.' : null
      });
    } catch (e) {
      res.status(400).json({ message: 'Ошибка при создании транзакции' });
    }
  }

  static async deleteTransaction(req: Request, res: Response) {
    try {
      await TransactionService.delete(req.user!.id, req.params.id);
      res.status(204).send();
    } catch (e) {
      res.status(400).json({ message: 'Ошибка при удалении' });
    }
  }
}