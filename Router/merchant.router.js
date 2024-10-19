import express from 'express';
import { merchantHome, recordSale, recordExpense } from '../controllers/merchant.controller.js';

const router = express.Router();

router.get('/home', merchantHome);

router.post('/recordSale', recordSale);

router.post('/recordExpense', recordExpense);

export default router;