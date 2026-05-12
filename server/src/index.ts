import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
// 1. Убираем .ts и добавляем .js (обязательно для ESM)
import authRoutes from './routes/auth.route.js'; 

dotenv.config();

const app = express();
// 2. Если CLIENT_URL в .env не задан, ставим дефолтный порт Vite
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(helmet());
app.use(cors({
  origin: CLIENT_URL, 
  credentials: true 
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Роуты
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});