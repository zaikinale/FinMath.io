import { z } from 'zod';

export const RegisterSchema = z.object({
  body: z.object({
    email: z.string().email("Некорректный формат email"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  }),
});

// До кучи добавим схему для логина, она скоро пригодится
export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email("Некорректный формат email"),
    password: z.string().min(1, "Введите пароль"),
  }),
});