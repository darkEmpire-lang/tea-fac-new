import { Router } from 'express';
import { createIncome, getIncomes, updateIncome, deleteIncome } from '../controllers/incomeController.js';

const router = Router();
router.post('/', createIncome);
router.get('/', getIncomes);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

export default router;
