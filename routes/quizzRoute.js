import express from 'express';
import { createQuizz, getQuizzByUserId, getQuizzWithQuestionsAndOptions, createQuestion, updateQuestion, deleteQuestion, validateQuizCode, submitQuizzData } from '../controllers/quizzController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', getQuizzByUserId)
router.post('/create', protect, createQuizz);
router.post('/isvalid', validateQuizCode)
router.post('/submit', submitQuizzData);
router.get('/code/:code', getQuizzWithQuestionsAndOptions);
router.post('/qacreate', createQuestion);
router.put('/qaupdate', updateQuestion);
router.delete('/qadelete/:question_id', deleteQuestion);

export default router;
