import { supabase } from '../lib/supabase.js';

export const insertQuizz = async ({ title, code, user_id }) => {
  return await supabase
    .from('quizzes')
    .insert([
      {
        title: title,
        code: code,
        user_id: user_id, //now correctly mapped
      },
    ])
    .select()
    .single();
};

// services/quizz.ts
export const fetchQuizzesByUser = async (userId) => {
  const { data, error } = await supabase
    .from('quizzes')
    // nested select: questions(count)
    .select('id, title, code, created_at, questions(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[supabase] fetch quizzes →', error.message);
    return [];
  }

  // Flatten the nested count for easier use in RN
  return data.map((q) => ({
    id: q.id,
    title: q.title,
    code: q.code,
    createdAt: q.created_at,
    questions: q.questions[0]?.count ?? 0, // questions is an array with one object {count}
  }));
};



export const fetchQuizzDetailsByCode = async (code, page = 1, limit = 1) => {
  const offset = (page - 1) * limit;

  // 1. Get quiz by code
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('id, title')
    .eq('code', code)
    .single();

  if (quizError || !quiz) {
    throw new Error('Quiz not found');
  }

  // 2. Get all questions
  const { data: allQuestions, error: questionsError } = await supabase
    .from('questions')
    .select('id, text')
    .eq('quizz_id', quiz.id)
    .order('id', { ascending: true });

  if (questionsError) {
    throw new Error('Failed to fetch questions');
  }

  const totalQuestions = allQuestions.length;
  const paginatedQuestions = allQuestions.slice(offset, offset + limit);

  // 3. Fetch options for each question
  const questionsWithOptions = await Promise.all(
    paginatedQuestions.map(async (question) => {
      const { data: options } = await supabase
        .from('options')
        .select('id, text, is_correct')
        .eq('question_id', question.id);

      return {
        ...question,
        options: options || []
      };
    })
  );

  return {
    id: quiz.id,
    title: quiz.title,
    questions: questionsWithOptions,
    total_questions: totalQuestions,
    page,
    per_page: limit
  };
};

export const createQuestionWithOptions = async ({ quizz_id, text, options }) => {
  // 1. Insert question
  const { data: question, error: questionError } = await supabase
    .from('questions')
    .insert({ text, quizz_id })
    .select('id')
    .single();

  if (questionError || !question) {
    throw new Error('Failed to create question');
  }

  // 2. Insert options
  const formattedOptions = options.map((opt) => ({
    text: opt.text,
    is_correct: opt.is_correct || false,
    question_id: question.id
  }));

  const { error: optionsError } = await supabase
    .from('options')
    .insert(formattedOptions);

  if (optionsError) {
    throw new Error('Failed to create options');
  }

  return question;
};

export const updateQuestionAndOptions = async ({ question_id, text, options }) => {
  // 1. Update question text (if provided)
  if (text) {
    const { error: questionError } = await supabase
      .from('questions')
      .update({ text })
      .eq('id', question_id);

    if (questionError) {
      throw new Error('Failed to update question text');
    }
  }

  // 2. Update each option
  if (Array.isArray(options)) {
    for (const opt of options) {
      const { error: optionError } = await supabase
        .from('options')
        .update({
          text: opt.text,
          is_correct: opt.is_correct
        })
        .eq('id', opt.id)
        .eq('question_id', question_id);

      if (optionError) {
        throw new Error(`Failed to update option with ID ${opt.id}`);
      }
    }
  }

  return true;
};

export const deleteQuestionAndOptions = async (question_id) => {
  if (!question_id) throw new Error('Missing question_id');

  // 1. Delete options first (foreign key constraint)
  const { error: optionError } = await supabase
    .from('options')
    .delete()
    .eq('question_id', question_id);

  if (optionError) {
    throw new Error('Failed to delete options');
  }

  // 2. Then delete the question
  const { error: questionError } = await supabase
    .from('questions')
    .delete()
    .eq('id', question_id);

  if (questionError) {
    throw new Error('Failed to delete question');
  }

  return true;
};


export const validateCode = async (code) => {
 const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('code', code)
    .single(); // gets exactly one row, assuming code is unique

  if (error) {
    console.error('Error validating code');
    return null;
  }
  return data;
}

export const submitQuizz = async (attendee_name, attendee_email, score, total_questions, quizz_id) => {

  const {data, error} = await supabase
   .from('quizz_attendee')
   .insert(
    [{
      attendee_name,
      attendee_email,
      score,
      total_questions,
      quizz_id   
     }]
   )
   .select();

   if (error) {
    console.error("Validation Error:", error);
    return null;
  }
  
  return data;
}

export const quizzAttendee = async (id) => {
  const { data, error } = await supabase
    .from('quizz_attendee')
    .select('*')
    .eq('quizz_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quiz attendees:', error.message);
    throw new Error(error.message);
  }

  return data;
};

