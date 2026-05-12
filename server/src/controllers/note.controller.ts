import type { Request, Response } from 'express';
import { NoteService } from '../services/note.service.js';

export class NoteController {
  static async getNotes(req: Request, res: Response) {
    try {
      const notes = await NoteService.getAll(req.user!.id);
      res.json(notes);
    } catch (e) {
      res.status(500).json({ message: 'Ошибка при получении заметок' });
    }
  }

  static async createNote(req: Request, res: Response) {
    try {
      const note = await NoteService.create(req.user!.id, req.body);
      res.status(201).json(note);
    } catch (e) {
      res.status(400).json({ message: 'Ошибка при создании заметки' });
    }
  }

  static async updateNote(req: Request, res: Response) {
    try {
      const note = await NoteService.update(req.user!.id, req.params.id, req.body);
      res.json(note);
    } catch (e) {
      res.status(400).json({ message: 'Ошибка при обновлении' });
    }
  }

  static async deleteNote(req: Request, res: Response) {
    try {
      await NoteService.delete(req.user!.id, req.params.id);
      res.status(204).send();
    } catch (e) {
      res.status(400).json({ message: 'Ошибка при удалении' });
    }
  }
}