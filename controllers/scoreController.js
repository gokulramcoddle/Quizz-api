import { supabase } from '../lib/supabase.js';

export const submitAnswers = async (req, res) => {
  const { quiz_code, attendee_name, attendee_email, answers } = req.body;

  if (!quiz_code || !attendee_name || attendee_email|| !answers?.length) {
    return res.status(400).json({ success: false, message: 'Missing data' });
  }

  // 1. Find quiz by code
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('id')
    .eq('code', quiz_code)
    .single();

  if (quizError || !quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found' });
  }

  const quiz_id = quiz.id;
  let score = 0;

  // 2. Calculate score + prepare responses
  const responseInserts = [];

  for (const { question_id, selected_option_id } of answers) {
    const { data: correctOption } = await supabase
      .from('options')
      .select('id')
      .eq('question_id', question_id)
      .eq('is_correct', true)
      .single();

    const isCorrect = correctOption?.id === selected_option_id;
    if (isCorrect) score++;

    responseInserts.push({ question_id, selected_option_id, is_correct: isCorrect });
  }

  // 3. Insert attendee record
  const { data: attendeeData, error: attendeeError } = await supabase
    .from('quizz_attendee')
    .insert({
      attendee_name,
      attendee_email,
      score,
      total_questions: answers.length,
      quizz_id: quiz_id
    })
    .select('id')
    .single();

  if (attendeeError || !attendeeData) {
    return res.status(500).json({ success: false, message: 'Failed to save submission' });
  }

  const attendee_id = attendeeData.id;

  // 4. Insert responses
  const finalResponses = responseInserts.map(resp => ({
    ...resp,
    attendee_id
  }));

  await supabase.from('responses').insert(finalResponses);

  return res.status(200).json({
    success: true,
    message: 'Quiz submitted successfully',
    score,
    total: answers.length
  });
};

