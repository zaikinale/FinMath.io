import { Router } from 'express';
import { AiController } from '../controllers/ai.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();

// 1. Генерация отчета (твой существующий роут)
router.get('/analytics', isAuth, AiController.getPeriodAnalytics);

// 2. Сохранение уже сгенерированного отчета в историю
router.post('/reports', isAuth, AiController.saveReport);

// 3. Получение всей истории сохраненных отчетов пользователя
router.get('/reports', isAuth, AiController.getReportsHistory);

// 4. Удаление отчета из истории
router.delete('/reports/:id', isAuth, AiController.deleteReport);

export default router;