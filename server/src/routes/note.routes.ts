import { Router } from 'express';
import { NoteController } from '../controllers/note.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', isAuth, NoteController.getNotes);
router.post('/', isAuth, NoteController.createNote);
router.patch('/:id', isAuth, NoteController.updateNote);
router.delete('/:id', isAuth, NoteController.deleteNote);

export default router;