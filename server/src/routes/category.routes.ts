import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Все роуты защищены authMiddleware
router.get('/', isAuth, CategoryController.getCategories);
router.post('/', isAuth, CategoryController.createCategory);
router.patch('/:id', isAuth, CategoryController.updateCategory);
router.delete('/:id', isAuth, CategoryController.deleteCategory);

export default router;