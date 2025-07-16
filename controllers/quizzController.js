
import { nanoid } from 'nanoid';
import { insertQuizz, fetchQuizzesByUser, fetchQuizzDetailsByCode, createQuestionWithOptions, updateQuestionAndOptions, deleteQuestionAndOptions, validateCode, submitQuizz } from '../models/quizzModel.js';

export const createQuizz = async (req, res) => {
  const { title, user_id } = req.body;
    console.log("Payload received:", req.body);  // Add this line

  if (!title || !user_id) {
    return res.status(400).json({ error: 'Missing title or user_id' });
  }

  const code = nanoid(6);

  const { data, error } = await insertQuizz({ title, code, user_id });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ message: 'Quiz created', quiz: data });
};


export const getQuizzByUserId = async (req, res) => {
  console.log('[debug] originalUrl:', req.originalUrl);
console.log('[debug] params:', req.params);

  const { userId } = req.params;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ success: false, message: 'Invalid or missing userId' });
  }

  const numericUserId = parseInt(userId, 10); // Convert to integer

  try {
    const quizzes = await fetchQuizzesByUser(numericUserId);
    return res.status(200).json({ success: true, quizzes });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes',
      error: error.message,
    });
  }
};

export const getQuizzWithQuestionsAndOptions = async (req, res) => {
  const code = req.params.code;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1;

  try {
    const quiz = await fetchQuizzDetailsByCode(code, page, limit);

    return res.status(200).json({
      success: true,
      quiz
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message
    });
  }
};

export const createQuestion = async (req, res) => {
  const { quizz_id, text, options } = req.body;

  if (!quizz_id || !text || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  try {
    const question = await createQuestionWithOptions({ quizz_id, text, options });

    return res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question_id: question.id
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const updateQuestion = async (req, res) => {
  const { question_id, text, options } = req.body;

  if (!question_id) {
    return res.status(400).json({ success: false, message: 'question_id is required' });
  }

  try {
    await updateQuestionAndOptions({ question_id, text, options });

    return res.status(200).json({
      success: true,
      message: 'Question and options updated successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const deleteQuestion = async (req, res) => {
  const { question_id } = req.params;

  try {
    await deleteQuestionAndOptions(parseInt(question_id));

    return res.status(200).json({
      success: true,
      message: 'Question and its options deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const validateQuizCode = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Quiz code is required' });
  }
try{
  const quiz = await validateCode(code);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Invalid code',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Valid code',
    });
  } catch(err) {
     return res.status(500).json({
      success: false,
      message: err.message || 'invalid code'
    });
  }
};

export const submitQuizzData = async (req, res) => {
  const {name, email, quizz_id, score, total_questions} = req.body;
  if (!name || !email || !quizz_id || score === undefined || total_questions === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try{
    await submitQuizz(name, email, score, total_questions, quizz_id);
    return res.status(200).json({
      success: true,
      message: 'Quiz data submitted successfully'
    });
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to submit quiz data'
    });
  }
}