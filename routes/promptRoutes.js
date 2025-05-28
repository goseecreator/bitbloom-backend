
import express from 'express';
import { handlePromptPurchase } from '../controllers/purchaseController.js';

const router = express.Router();
router.post('/buy-prompt', handlePromptPurchase);

export default router;
