import express from 'express';
import { createQuizz, getQuizzByUserId, getQuizzWithQuestionsAndOptions, createQuestion, updateQuestion, deleteQuestion, validateQuizCode } from '../controllers/quizzController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getQuizzByUserId)
router.post('/create', createQuizz);
router.post('/isvalid', validateQuizCode)
router.get('/code/:code', protect, getQuizzWithQuestionsAndOptions);
router.post('/qacreate', createQuestion);
router.put('/qaupdate', updateQuestion);
router.delete('/qadelete/:question_id', deleteQuestion);

export default router;
