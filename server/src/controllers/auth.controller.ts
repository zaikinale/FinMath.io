import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
// Добавляем расширения .js
import { prisma } from '../lib/prisma.js';
import { generateTokens, sendTokenCookies } from '../utils/token.util.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email уже занят' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Сохраняем сессию в БД
    await prisma.session.create({
      data: {
        refreshToken,
        userId: user.id,
        userAgent: req.headers['user-agent'] || 'unknown',
        ip: req.ip || '0.0.0.0',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    sendTokenCookies(res, accessToken, refreshToken);
    res.status(201).json({ user: { id: user.id, email: user.email } });
  } catch (e) {
    console.error(e); // Полезно видеть ошибку в консоли при разработке
    res.status(500).json({ message: 'Ошибка при регистрации' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Неверные данные' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Создаем запись о новой сессии
    await prisma.session.create({
      data: {
        refreshToken,
        userId: user.id,
        userAgent: req.headers['user-agent'] || 'unknown',
        ip: req.ip || '0.0.0.0',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    sendTokenCookies(res, accessToken, refreshToken);
    res.json({ user: { id: user.id, email: user.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка при входе' });
  }
};