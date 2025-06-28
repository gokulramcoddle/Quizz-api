import express from 'express';
import { createQuizz, getQuizzByUserId, getQuizzWithQuestionsAndOptions, createQuestion, updateQuestion, deleteQuestion } from '../controllers/quizzController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getQuizzByUserId)
router.post('/create', protect, createQuizz);
router.get('/code/:code', protect, getQuizzWithQuestionsAndOptions);
router.post('/qacreate', protect, createQuestion);
router.put('/qaupdate', updateQuestion);
router.delete('/qadelete/:question_id', deleteQuestion);

export default router;
