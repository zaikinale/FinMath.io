import { Router } from 'express';
// Добавляем .js ко всем путям, которые начинаются с точки
import { register, login } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { RegisterSchema } from '../schemas/auth.schema.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.post('/register', validate(RegisterSchema), register);
router.post('/login', login);

// Получение активных сессий (защищенный роут)
router.get('/sessions', isAuth, async (req, res) => {
  // Проверяем наличие пользователя (req.user заполняется в isAuth)
  if (!req.user) {
    return res.status(401).json({ message: "Пользователь не найден" });
  }

  const sessions = await prisma.session.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(sessions);
});

// Выход (удаление текущей сессии)
router.post('/logout', isAuth, async (req, res) => {
  const { refreshToken } = req.cookies;
  
  if (refreshToken) {
    // Используем deleteMany на случай, если сессия уже удалена (чтобы не было Error 404 от Prisma)
    await prisma.session.deleteMany({ 
      where: { refreshToken } 
    });
  }
  
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Вышли из системы' });
});

export default router;