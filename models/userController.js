import { supabase } from '../lib/supabase.js';


export const getDashboardDataForUser = async (user_id) => {
  // 1. Get all quizzes created by the user
  const { data: quizzes, error: quizError } = await supabase
    .from('quizzes')
    .select('id, title')
    .eq('user_id', user_id);

  if (quizError) throw new Error('Failed to fetch quizzes');

  // 2. For each quiz, fetch attendees
  const dashboardData = await Promise.all(
    quizzes.map(async (quiz) => {
      const { data: attendees } = await supabase
        .from('quizz_attendee')
        .select('attendee_name, score, submitted_at')
        .eq('quizz_id', quiz.id);

      return {
        quizz_id: quiz.id,
        title: quiz.title,
        attendees: attendees || []
      };
    })
  );

  return dashboardData;
};