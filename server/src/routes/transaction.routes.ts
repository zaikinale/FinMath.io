import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', isAuth, TransactionController.getTransactions);
router.post('/', isAuth, TransactionController.createTransaction);
router.delete('/:id', isAuth, TransactionController.deleteTransaction);

export default router;