import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Импорты роутов (ОБЯЗАТЕЛЬНО с .js расширением для ESM)
import authRoutes from './routes/auth.route.js'; 
import categoryRoutes from './routes/category.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import reportRoutes from './routes/report.routes.js';
// import noteRoutes from './routes/note.routes.js'; // Добавь, когда напишем

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// --- Middleware ---
app.use(helmet());
app.use(cors({
  origin: CLIENT_URL, 
  credentials: true 
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// --- Роуты ---
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes); // Исправил путь и добавил роут
app.use('/api/transactions', transactionRoutes); // Добавил транзакции
app.use('/api/reports', reportRoutes);

// --- Обработка несуществующих маршрутов (404) ---
app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// --- Глобальный обработчик ошибок (чтобы сервер не падал) ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});