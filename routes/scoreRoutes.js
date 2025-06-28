// routes/scoreRoutes.js
import express from 'express';
import { submitAnswers } from '../controllers/scoreController.js';

const router = express.Router();

router.post('/submit', submitAnswers);

export default router;
