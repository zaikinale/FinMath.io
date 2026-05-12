import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/reports?start=2026-05-01&end=2026-05-31
router.get('/', isAuth, ReportController.getReport);

export default router;