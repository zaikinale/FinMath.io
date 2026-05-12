import type { Request, Response } from 'express';
import { CategoryService } from '../services/category.service.js';

export class CategoryController {
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAll((req as any).user.id);
      res.json(categories);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  static async createCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.create((req as any).user.id, req.body);
      res.status(201).json(category);
    } catch (e) {
      res.status(400).json({ error: 'Failed to create category' });
    }
  }

  static async updateCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.update((req as any).user.id, req.params.id, req.body);
      res.json(category);
    } catch (e) {
      res.status(400).json({ error: 'Update failed' });
    }
  }

  static async deleteCategory(req: Request, res: Response) {
    try {
      await CategoryService.delete((req as any).user.id, req.params.id);
      res.status(204).send();
    } catch (e) {
      res.status(400).json({ error: 'Delete failed' });
    }
  }
}