import express from 'express';
import { createQuizz, getQuizzByUserId, getQuizzWithQuestionsAndOptions, createQuestion, updateQuestion, deleteQuestion, validateQuizCode, submitQuizzData, quizzAttendees } from '../controllers/quizzController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getQuizzByUserId)
router.post('/create', protect, createQuizz);
router.post('/isvalid', validateQuizCode)
router.post('/submit', submitQuizzData);
router.get('/code/:code', getQuizzWithQuestionsAndOptions);
router.post('/qacreate', protect, createQuestion);
router.put('/qaupdate', protect, updateQuestion);
router.delete('/qadelete/:question_id', deleteQuestion);
router.get('/attendees/:id', protect, quizzAttendees);

export default router;
